import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";
import type { ListingContext } from "./generate-script";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const HEYGEN_API_BASE = "https://api.heygen.com";

// Music moods supported — maps to natural-language queries for HeyGen semantic search
export type MusicMood =
  | "luxury"
  | "cinematic"
  | "calm"
  | "coastal"
  | "family"
  | "upbeat"
  | "prestige"
  | "modern";

const MOOD_QUERIES: Record<MusicMood, string> = {
  luxury:    "elegant luxury real estate ambient orchestral sophisticated",
  cinematic: "cinematic dramatic cinematic score real estate",
  calm:      "calm peaceful ambient piano minimal warm",
  coastal:   "relaxed coastal beach lifestyle acoustic breezy",
  family:    "warm uplifting family home acoustic cheerful gentle",
  upbeat:    "upbeat energetic modern bright corporate positive",
  prestige:  "sophisticated prestige premium piano strings understated",
  modern:    "modern contemporary electronic clean minimal corporate",
};

// Safe static fallback URLs — used only when HeyGen music search fails entirely
const STATIC_FALLBACK_URLS: Record<MusicMood, string> = {
  luxury:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  cinematic: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  calm:      "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/ambisax.mp3",
  coastal:   "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  family:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  upbeat:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
  prestige:  "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3",
  modern:    "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3",
};

export interface MusicSelection {
  mood: MusicMood;
  trackId: string | null;
  trackName: string | null;
  trackUrl: string;
  provider: "heygen" | "static";
}

/**
 * Ask Claude to pick the best music mood for this listing.
 * Returns a MusicMood enum value; falls back to "luxury" on any error.
 */
async function selectMoodWithClaude(
  listingContext: ListingContext,
  script: string,
): Promise<MusicMood> {
  const contextParts: string[] = [];
  if (listingContext.propertyType) contextParts.push(`Type: ${listingContext.propertyType}`);
  if (listingContext.suburb)       contextParts.push(`Suburb: ${listingContext.suburb}`);
  if (listingContext.state)        contextParts.push(`State: ${listingContext.state}`);
  if (listingContext.bedrooms)     contextParts.push(`Bedrooms: ${listingContext.bedrooms}`);
  if (listingContext.price)        contextParts.push(`Price: ${listingContext.price}`);
  if (listingContext.summary)      contextParts.push(`Summary: ${listingContext.summary}`);

  const prompt = `You are a real estate video producer. Pick the single best background music mood for this property listing video.

Property context:
${contextParts.join("\n") || "(no extra context)"}

Script excerpt (first 300 chars):
${script.slice(0, 300)}

Available moods:
- luxury: sophisticated, orchestral, premium feeling
- cinematic: dramatic, epic, powerful
- calm: peaceful, minimal, ambient piano
- coastal: relaxed, breezy, lifestyle
- family: warm, cheerful, gentle, approachable
- upbeat: energetic, modern, bright corporate
- prestige: understated elegance, piano + strings
- modern: clean, contemporary, electronic

Respond with ONLY the single mood word from the list above. No explanation.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 10,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("")
      .trim()
      .toLowerCase();

    if (raw in MOOD_QUERIES) {
      logger.info({ mood: raw }, "Claude selected music mood");
      return raw as MusicMood;
    }
    // Try to find a match inside the response
    for (const key of Object.keys(MOOD_QUERIES) as MusicMood[]) {
      if (raw.includes(key)) {
        logger.info({ mood: key }, "Claude music mood (extracted from response)");
        return key;
      }
    }
    logger.warn({ raw }, "Claude returned unrecognised mood — defaulting to luxury");
    return "luxury";
  } catch (err) {
    logger.warn({ err }, "Claude mood selection failed — defaulting to luxury");
    return "luxury";
  }
}

/**
 * Search HeyGen /v3/audio/sounds for the best track matching the mood query.
 * Returns the top result or null if search fails.
 */
async function searchHeyGenTrack(mood: MusicMood): Promise<{ id: string; name: string; url: string } | null> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    logger.warn("HEYGEN_API_KEY not set — skipping HeyGen music search");
    return null;
  }

  const query = MOOD_QUERIES[mood];
  const url = `${HEYGEN_API_BASE}/v3/audio/sounds?query=${encodeURIComponent(query)}&limit=3&min_score=0.65`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status, mood }, "HeyGen music search HTTP error");
      return null;
    }

    const data = (await res.json()) as {
      data?: {
        items?: Array<{
          id: string;
          name: string;
          audio_url: string;
          duration: number;
          score: number;
        }>;
      };
    };

    const items = data.data?.items ?? [];
    if (items.length === 0) {
      logger.warn({ mood }, "HeyGen music search returned no results");
      return null;
    }

    const best = items[0]!;
    logger.info({ mood, trackId: best.id, trackName: best.name, score: best.score, duration: best.duration }, "HeyGen music track selected");
    return { id: best.id, name: best.name, url: best.audio_url };
  } catch (err) {
    logger.warn({ err, mood }, "HeyGen music search failed");
    return null;
  }
}

/**
 * Full music selection pipeline:
 * 1. Claude picks a mood from listing context + script
 * 2. HeyGen /v3/audio/sounds returns best matching track
 * 3. Falls back to static Shotstack URL if HeyGen fails
 *
 * Never throws — always returns a MusicSelection.
 */
export async function selectAndFetchMusic(
  listingContext: ListingContext,
  script: string,
): Promise<MusicSelection> {
  // Step 1: Claude mood selection
  const mood = await selectMoodWithClaude(listingContext, script);

  // Step 2: HeyGen track search
  const heygenTrack = await searchHeyGenTrack(mood);

  if (heygenTrack) {
    logger.info(
      { mood, trackId: heygenTrack.id, trackName: heygenTrack.name, provider: "heygen", volume: 0.15 },
      "Music selection complete — HeyGen track",
    );
    return {
      mood,
      trackId: heygenTrack.id,
      trackName: heygenTrack.name,
      trackUrl: heygenTrack.url,
      provider: "heygen",
    };
  }

  // Step 3: Static fallback
  const fallbackUrl = STATIC_FALLBACK_URLS[mood];
  logger.info(
    { mood, provider: "static", fallbackUrl, volume: 0.15 },
    "Music selection complete — static fallback track",
  );
  return {
    mood,
    trackId: null,
    trackName: `${mood} (static fallback)`,
    trackUrl: fallbackUrl,
    provider: "static",
  };
}
