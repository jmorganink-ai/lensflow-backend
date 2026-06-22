import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";
import { getAllowedPublicHosts } from "./publicBaseUrl";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PhotoAnalysisResult {
  summary: string;
  propertyType: string | null;
  bedrooms: string | null;
  bathrooms: number | null;
  features: string[];
  rawText: string;
}

export type SupportedMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

function mediaTypeFromUrl(url: string): SupportedMediaType {
  const lower = url.split("?")[0].toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

/**
 * SSRF guard: property photos are always served through our own object-storage
 * route (`/api/storage/...`) on a Replit dev/prod domain or localhost. Only fetch
 * URLs that match that shape so a malicious `propertyImages` payload cannot make
 * the server fetch arbitrary internal addresses.
 */
export function isAllowedImageUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  if (!parsed.pathname.startsWith("/api/storage/")) return false;

  const host = parsed.hostname.toLowerCase();
  const allowedDomains = getAllowedPublicHosts();

  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  const isAllowedDomain =
    allowedDomains.includes(host) ||
    host === "lensflow.com.au" ||
    host === "www.lensflow.com.au" ||
    host.endsWith(".onrender.com") ||
    host.endsWith(".replit.dev") ||
    host.endsWith(".replit.app") ||
    host.endsWith(".repl.co");

  return isLocalhost || isAllowedDomain;
}

export async function fetchImageAsBase64(
  url: string,
): Promise<{ data: string; mediaType: SupportedMediaType } | null> {
  if (!isAllowedImageUrl(url)) {
    logger.warn({ url }, "Rejected non-allowlisted property photo URL (SSRF guard)");
    return null;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) {
      logger.warn({ url, status: res.status }, "Failed to fetch property photo for vision");
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const data = Buffer.from(arrayBuffer).toString("base64");
    const headerType = res.headers.get("content-type");
    const mediaType =
      headerType && /image\/(jpeg|png|gif|webp)/.test(headerType)
        ? (headerType.split(";")[0] as SupportedMediaType)
        : mediaTypeFromUrl(url);
    return { data, mediaType };
  } catch (err) {
    logger.warn({ err, url }, "Error fetching property photo for vision");
    return null;
  }
}

export async function analysePropertyPhotos(
  imageUrls: string[],
  address?: string | null,
): Promise<PhotoAnalysisResult> {
  const limited = imageUrls.slice(0, 10);
  const images = (
    await Promise.all(limited.map((url) => fetchImageAsBase64(url)))
  ).filter((img): img is { data: string; mediaType: SupportedMediaType } => img !== null);

  if (images.length === 0) {
    throw new Error("No property photos could be fetched for vision analysis");
  }

  const contentBlocks: Anthropic.ContentBlockParam[] = images.map((img) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: img.mediaType,
      data: img.data,
    },
  }));

  const prompt = `You are a professional real estate analyst. You are looking at ${images.length} photo${images.length !== 1 ? "s" : ""} of a single property${address ? ` located at: ${address}` : ""}.

Analyse the photos and infer the property's key characteristics. Respond with a JSON object with exactly these fields:
- "summary": a concise 1-2 sentence description of the property and its standout qualities
- "propertyType": the property type if discernible (e.g. "House", "Apartment", "Townhouse"), or null
- "bedrooms": estimated number of bedrooms as a string if discernible, or null
- "bathrooms": estimated number of bathrooms as a number if discernible, or null
- "features": an array of 4-8 specific selling-point features you can actually see in the photos (e.g. "Stone benchtops", "North-facing backyard", "Open-plan living", "Renovated kitchen")

Only describe what you can genuinely see. Do not invent features that aren't visible.`;

  contentBlocks.push({ type: "text", text: prompt });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 700,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as {
        summary?: string;
        propertyType?: string | null;
        bedrooms?: string | number | null;
        bathrooms?: number | null;
        features?: string[];
      };
      logger.info({ imageCount: images.length }, "Property photos analysed with Claude Vision");
      return {
        summary: parsed.summary ?? "",
        propertyType: parsed.propertyType ?? null,
        bedrooms: parsed.bedrooms != null ? String(parsed.bedrooms) : null,
        bathrooms: typeof parsed.bathrooms === "number" ? parsed.bathrooms : null,
        features: Array.isArray(parsed.features) ? parsed.features : [],
        rawText: raw,
      };
    }

    logger.info({ imageCount: images.length }, "Property photos analysed (raw, no JSON)");
    return {
      summary: raw.slice(0, 300),
      propertyType: null,
      bedrooms: null,
      bathrooms: null,
      features: [],
      rawText: raw,
    };
  } catch (err) {
    logger.error({ err }, "Claude Vision photo analysis failed");
    throw err;
  }
}
