import { logger } from "./logger";

const APIFY_API_BASE = "https://api.apify.com/v2";

export interface ScrapedListing {
  title: string | null;
  address: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  description: string | null;
  images: string[];
  pageText: string;
}

/**
 * Page function run inside Apify cheerio-scraper.
 * Handles realestate.com.au (Next.js __NEXT_DATA__) and domain.com.au,
 * falls back to og:image + img tag scanning for other platforms.
 */
const PAGE_FUNCTION = /* js */ `
async function pageFunction(context) {
  const { $, request } = context;

  // --- 1. Try __NEXT_DATA__ (realestate.com.au uses Next.js) ---
  let nextData = null;
  try {
    const raw = $('#__NEXT_DATA__').text();
    if (raw) nextData = JSON.parse(raw);
  } catch {}

  const images = [];

  if (nextData) {
    const pp = nextData?.props?.pageProps || {};
    const listing = pp.listing || pp.listingDetails || pp.data?.listing || {};

    // realestate.com.au: listing.media.images[]
    const mediaImages = listing?.media?.images || listing?.images || [];
    for (const img of mediaImages) {
      let url = img?.url || img?.src || img?.server?.baseUrl;
      if (url) {
        // Replace size tokens
        url = url.replace('{size}', '800x600').replace('{width}', '800').replace('{height}', '600').replace('%7Bsize%7D', '800x600');
        images.push(url);
      }
    }

    // domain.com.au: listing.photos[]
    const photos = listing?.photos || [];
    for (const p of photos) {
      const url = typeof p === 'string' ? p : p?.url || p?.src;
      if (url) images.push(url);
    }
  }

  // --- 2. Fallback: og:image meta ---
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage && images.length === 0) images.push(ogImage);

  // --- 3. Last resort: large img tags ---
  if (images.length === 0) {
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (src && src.startsWith('http') && !src.includes('placeholder') && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && !src.includes('sprite')) {
        images.push(src);
      }
    });
  }

  // --- Page text for OpenAI extraction ---
  const bodyText = $('body').text().replace(/\\s+/g, ' ').trim().slice(0, 8000);

  return {
    url: request.url,
    title: $('title').text().trim(),
    ogTitle: $('meta[property="og:title"]').attr('content') || null,
    ogDescription: $('meta[property="og:description"]').attr('content') || null,
    images: [...new Set(images)].slice(0, 10),
    pageText: bodyText,
    nextDataFound: !!nextData,
  };
}
`;

/**
 * Scrape a property listing URL with Apify and return structured data.
 * Requires APIFY_API_TOKEN environment variable.
 */
export async function scrapeListing(url: string): Promise<ScrapedListing> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN not set");

  logger.info({ url }, "Starting Apify scrape");

  // Start the cheerio-scraper actor run
  const runRes = await fetch(
    `${APIFY_API_BASE}/acts/apify~cheerio-scraper/runs?token=${token}&memory=256&timeout=120`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startUrls: [{ url }],
        pageFunction: PAGE_FUNCTION,
        maxRequestsPerCrawl: 1,
        requestHandlerTimeoutSecs: 60,
      }),
    }
  );

  if (!runRes.ok) {
    const text = await runRes.text();
    throw new Error(`Apify run start failed (${runRes.status}): ${text}`);
  }

  const runData = (await runRes.json()) as {
    data: { id: string; defaultDatasetId: string };
  };
  const runId = runData.data.id;
  const datasetId = runData.data.defaultDatasetId;

  logger.info({ runId, url }, "Apify run started — polling");

  // Poll for completion (max ~2 minutes)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 4000));

    const statusRes = await fetch(
      `${APIFY_API_BASE}/actor-runs/${runId}?token=${token}`
    );
    const statusData = (await statusRes.json()) as {
      data: { status: string };
    };
    const status = statusData.data.status;

    logger.info({ runId, status, attempt: i + 1 }, "Apify poll");

    if (status === "SUCCEEDED") break;
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
      throw new Error(`Apify run ended with status ${status} (id=${runId})`);
    }
  }

  // Fetch dataset items
  const itemsRes = await fetch(
    `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${token}&clean=true`
  );
  const items = (await itemsRes.json()) as Array<{
    title: string;
    ogTitle: string | null;
    ogDescription: string | null;
    images: string[];
    pageText: string;
    nextDataFound: boolean;
  }>;

  const item = items[0];
  if (!item) throw new Error("No data returned from Apify scrape");

  logger.info(
    { url, imageCount: item.images.length, nextDataFound: item.nextDataFound },
    "Apify scrape complete"
  );

  // Use OpenAI to extract structured property data from page text
  const structured = await extractStructuredData(
    item.pageText,
    item.ogTitle ?? item.title,
    url
  );

  return {
    title: structured.title || item.ogTitle || item.title || null,
    address: structured.address,
    price: structured.price,
    bedrooms: structured.bedrooms,
    bathrooms: structured.bathrooms,
    carSpaces: structured.carSpaces,
    description: structured.description || item.ogDescription || null,
    images: item.images,
    pageText: item.pageText,
  };
}

interface ExtractedData {
  title: string | null;
  address: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  description: string | null;
}

async function extractStructuredData(
  pageText: string,
  fallbackTitle: string,
  url: string
): Promise<ExtractedData> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.warn("OPENAI_API_KEY not set — skipping structured data extraction");
    return nullExtract(fallbackTitle);
  }

  const prompt = `Extract Australian property listing details from this page text. Return valid JSON only.

URL: ${url}
Page text: ${pageText.slice(0, 4000)}

Return exactly this shape:
{
  "title": "short descriptive title (e.g. '4-Bed House in Williamstown VIC')",
  "address": "full street address if found, else null",
  "price": "price string (e.g. '$1,290,000 - $1,350,000'), else null",
  "bedrooms": number or null,
  "bathrooms": number or null,
  "carSpaces": number or null,
  "description": "2-3 sentence property description from the listing, else null"
}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      logger.warn({ status: res.status }, "OpenAI extraction failed");
      return nullExtract(fallbackTitle);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const parsed = JSON.parse(data.choices[0].message.content) as ExtractedData;
    logger.info({ title: parsed.title, address: parsed.address }, "OpenAI extracted property data");
    return parsed;
  } catch (err) {
    logger.warn({ err }, "OpenAI extraction error — using fallback");
    return nullExtract(fallbackTitle);
  }
}

function nullExtract(title: string): ExtractedData {
  return {
    title,
    address: null,
    price: null,
    bedrooms: null,
    bathrooms: null,
    carSpaces: null,
    description: null,
  };
}
