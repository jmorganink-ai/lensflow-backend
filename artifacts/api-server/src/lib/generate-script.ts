import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ScriptResult {
  script: string;
  title: string;
}

/**
 * Extract 3–5 short, punchy highlight phrases from a generated script.
 * These become cinematic caption overlays in the final video.
 */
export function extractHighlights(script: string): string[] {
  const sentences = script
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 80);

  // Prefer sentences with strong property marketing language
  const SIGNAL_WORDS = [
    "bedroom", "bathroom", "kitchen", "living", "outdoor", "garden",
    "garage", "location", "school", "stunning", "modern", "contemporary",
    "entertainer", "family", "ocean", "pool", "renovated", "open plan",
    "natural light", "north-facing", "views", "prestige", "exceptional",
    "rare", "opportunity", "lifestyle", "luxury", "space",
  ];

  const scored = sentences.map(s => {
    const lower = s.toLowerCase();
    const score = SIGNAL_WORDS.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
    return { s, score };
  });

  // Sort by score descending, take top 5
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ s }) => {
      // Trim to max 60 chars cleanly
      if (s.length <= 60) return s;
      const cut = s.slice(0, 60).lastIndexOf(" ");
      return s.slice(0, cut > 30 ? cut : 60) + "…";
    });

  return top;
}

export interface ListingContext {
  suburb?: string | null;
  state?: string | null;
  propertyType?: string | null;
  bedrooms?: string | null;
  platform?: string;
  summary?: string;
  // Enriched from Apify scrape
  address?: string | null;
  price?: string | null;
  bathrooms?: number | null;
  carSpaces?: number | null;
  scrapedDescription?: string | null;
  // Enriched from photo (Claude Vision) analysis
  features?: string[] | null;
  inputMode?: "url" | "photos";
  // Live Domain suburb market data
  suburbStats?: {
    medianSoldPrice?: number | null;
    medianDaysOnMarket?: number | null;
    numberSold?: number | null;
    clearanceRate?: number | null;
    periodLabel?: string | null;
  } | null;
}

// ── Presenter personas ────────────────────────────────────────────────────────
// Each presenter gets a distinct voice, angle, and opening style.

const PRESENTER_PERSONAS: Record<string, { role: string; style: string; opening: string }> = {
  mia: {
    role: "coastal lifestyle specialist at a top Australian agency",
    style:
      "warm, aspirational, and emotionally compelling. You speak to the lifestyle this home unlocks — sunsets, entertaining, relaxed coastal or suburban living. You paint a vivid picture of the life buyers will live here.",
    opening: "Open with a vivid sensory hook about the lifestyle or feeling of the property.",
  },
  sophie: {
    role: "family homes specialist with 15 years helping Australian families find the right home",
    style:
      "friendly, practical, and reassuring. You focus on space, flow, school catchments, community, and the day-to-day comfort a family needs. You speak directly to parents and growing families.",
    opening:
      "Open by connecting the property to family life — space for kids, entertaining, or the school/community location.",
  },
  oliver: {
    role: "prestige and investment property specialist at one of Australia's top agencies",
    style:
      "confident, sophisticated, and market-savvy. You speak to discerning buyers and investors. You highlight architectural quality, capital growth potential, and the prestige of the location.",
    opening:
      "Open with a bold, confident statement about the property's calibre or investment position.",
  },
  james: {
    role: "seasoned real estate auctioneer and investment advisor with 20 years across Australian capital city markets",
    style:
      "authoritative, energetic, and direct. You have the commanding presence of a top auctioneer. You speak to serious buyers and investors with confidence and precision — cutting through the noise to what really matters about this property.",
    opening:
      "Open with a bold, punchy statement about what makes this property a standout opportunity — the kind of line you'd use to open a premium auction.",
  },
};

const DEFAULT_PERSONA = {
  role: "professional real estate presenter at a top Australian agency",
  style: "engaging, confident, and conversational",
  opening: "Open with a vivid, specific hook about the property type and lifestyle.",
};

function buildPrompt(
  listingUrl: string,
  context?: ListingContext,
  voiceName?: string | null,
): string {
  let domain = listingUrl;
  try {
    domain = new URL(listingUrl).hostname.replace("www.", "");
  } catch {
    // use raw URL if parse fails
  }

  const persona = PRESENTER_PERSONAS[(voiceName ?? "").toLowerCase()] ?? DEFAULT_PERSONA;

  const contextLines: string[] = [];
  if (context?.summary)            contextLines.push(`Property: ${context.summary}`);
  if (context?.address)            contextLines.push(`Address: ${context.address}`);
  if (context?.suburb)             contextLines.push(`Suburb: ${context.suburb}`);
  if (context?.state)              contextLines.push(`State: ${context.state}`);
  if (context?.propertyType)       contextLines.push(`Property type: ${context.propertyType}`);
  if (context?.bedrooms)           contextLines.push(`Bedrooms: ${context.bedrooms}`);
  if (context?.bathrooms)          contextLines.push(`Bathrooms: ${context.bathrooms}`);
  if (context?.carSpaces)          contextLines.push(`Car spaces: ${context.carSpaces}`);
  if (context?.price)              contextLines.push(`Price: ${context.price}`);
  if (context?.scrapedDescription) contextLines.push(`Listing description: ${context.scrapedDescription}`);
  if (context?.features && context.features.length > 0)
    contextLines.push(`Visible features (from photos): ${context.features.join(", ")}`);
  if (context?.suburbStats) {
    const s = context.suburbStats;
    const parts: string[] = [];
    if (s.medianSoldPrice) parts.push(`median sold $${s.medianSoldPrice.toLocaleString()}`);
    if (s.medianDaysOnMarket) parts.push(`avg ${s.medianDaysOnMarket} days on market`);
    if (s.clearanceRate != null) parts.push(`${s.clearanceRate}% clearance rate`);
    if (s.numberSold) parts.push(`${s.numberSold} sales`);
    if (parts.length > 0) {
      const period = s.periodLabel ? ` (${s.periodLabel})` : "";
      contextLines.push(`Live suburb market data${period}: ${parts.join(", ")}`);
    }
  }

  const isPhotoMode = context?.inputMode === "photos";
  const sourceLine = isPhotoMode
    ? `Source: agent-uploaded property photos${context?.address ? ` for ${context.address}` : ""} (analysed with AI vision)`
    : `Listing URL: ${listingUrl}\nPlatform: ${context?.platform ?? domain}`;

  return `You are ${persona.role}. Write a compelling 45-second presenter video script for a property listing.

Your presenting style: ${persona.style}

${sourceLine}
${contextLines.length > 0 ? contextLines.join("\n") : ""}

Respond with a JSON object with exactly two fields:
- "title": a short descriptive property title (max 60 chars, e.g. "3-Bed Family Home in Paddington" or "Luxury Penthouse · Sydney CBD")
- "script": the spoken presenter script

The script should:
- ${persona.opening}
- Highlight 3 key selling points in natural, conversational language true to your persona
- Mention the location's lifestyle or investment advantages
- Close with a confident call to action that fits your persona

Keep the script to exactly 4 short paragraphs, ~120 words total. No stage directions — just the spoken words.`;
}

export async function generateListingScript(
  listingUrl: string,
  context?: ListingContext,
  voiceName?: string | null,
): Promise<ScriptResult> {
  const prompt = buildPrompt(listingUrl, context, voiceName);

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { title?: string; script?: string };
      if (parsed.script) {
        logger.info({ listingUrl, voiceName, chars: parsed.script.length }, "Anthropic script generated");
        return { script: parsed.script, title: parsed.title ?? "" };
      }
    }
    // If JSON parse fails, treat entire response as script
    logger.info({ listingUrl, voiceName, chars: raw.length }, "Anthropic script generated (raw)");
    return { script: raw, title: "" };
  } catch (err) {
    logger.error({ err, listingUrl, voiceName }, "Anthropic script generation failed — using fallback");
    const fb = buildFallbackScript(listingUrl, domain(listingUrl), voiceName);
    return { script: fb, title: "" };
  }
}

function domain(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function buildFallbackScript(_listingUrl: string, domainStr: string, voiceName?: string | null): string {
  const name = (voiceName ?? "").toLowerCase();

  if (name === "james") {
    return `I'm James. And when I say this property stopped me in my tracks — I mean it. In 20 years of real estate, very few listings genuinely stand out. This one does.

From the moment you step inside, you'll understand why. The quality, the light, the flow — it's been built for the way Australians actually want to live.

Three things that make this exceptional: the spaces that adapt to your life, the finishes that will outlast trends, and a location that gives you everything at your doorstep.

Don't wait on this one. Call me directly to arrange your private inspection — properties like this don't sit on market.`;
  }

  if (name === "sophie") {
    return `If you've been searching for the family home that ticks every box — stop searching. This one has the space, the flow, and the location your family deserves.

From generous living areas that spill outdoors to bedrooms that give everyone room to breathe, every corner of this home has been designed around real family life.

You're also in the heart of a community with great schools, parks, and everything daily life needs within easy reach.

Come and see it for yourself. Bring the family — because this is the one they'll thank you for. Book your inspection today.`;
  }

  if (name === "oliver") {
    return `In a market where genuine quality is increasingly rare, this property stands apart. Architecturally considered, immaculately presented, and positioned in one of the country's most sought-after locations.

For the discerning buyer or astute investor, the fundamentals here are undeniable — scarcity of land, proven capital growth trajectory, and premium finishes that will hold their value.

Whether you're consolidating, upgrading, or expanding your portfolio, this represents the calibre of asset that simply doesn't come to market often.

Contact us to arrange a private viewing. Opportunities at this level move quickly — and for good reason. ${domainStr}`;
  }

  return `Welcome to this exceptional property, presented exclusively through ${domainStr}. From the moment you step inside, you'll be captivated by the quality, space, and light that define every room.

This stunning home delivers the lifestyle today's buyers are searching for — generous living areas that flow seamlessly to the outdoors, premium finishes throughout, and a location that puts everything at your doorstep.

Whether you're hosting friends in the open-plan entertaining space or retreating to the peaceful master suite, every detail has been crafted with your comfort in mind.

This is a rare opportunity in today's market. Contact us now to arrange your private inspection and experience it for yourself.`;
}
