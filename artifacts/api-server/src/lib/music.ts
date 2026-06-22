import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";
import type { ListingContext } from "./generate-script";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SHOTSTACK_AUDIO_API_BASE = "https://api.shotstack.io/audio/v1";

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

const STATIC_FALLBACK_TRACKS: Record<MusicMood, { trackName: string; trackUrl: string; provider: string }> = {
  luxury:    { trackName: "Berlin", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3", provider: "shotstack-static" },
  cinematic: { trackName: "Berlin", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3", provider: "shotstack-static" },
  calm:      { trackName: "Ambisax", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/ambisax.mp3", provider: "shotstack-static" },
  coastal:   { trackName: "Lit", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3", provider: "shotstack-static" },
  family:    { trackName: "Lit", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3", provider: "shotstack-static" },
  upbeat:    { trackName: "Lit", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3", provider: "shotstack-static" },
  prestige:  { trackName: "Berlin", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/berlin.mp3", provider: "shotstack-static" },
  modern:    { trackName: "Lit", trackUrl: "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/unminus/lit.mp3", provider: "shotstack-static" },
};

export interface MusicSelection {
  mood: MusicMood;
  trackId: string | null;
  trackName: string | null;
  trackUrl: string;
  provider: string;
}

/**
 * Ask Claude to pick the best music mood for this listing.
 * Returns a MusicMood enum value; falls back to "luxury" on any error.
 */
async function selectMoodWithClaude(
  listingContext: ListingContext,
  script: string,
  preferredMood?: MusicMood | null,
): Promise<MusicMood> {
  if (preferredMood && preferredMood in MOOD_QUERIES) {
    logger.info({ mood: preferredMood }, "Using script-selected music mood");
    return preferredMood;
  }

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
 * Search Shotstack /v3/audio/sounds for the best track matching the mood query.
 * Returns the top result or null if search fails.
 */
async function searchShotstackTrack(
  mood: MusicMood,
  listingContext: ListingContext,
  script: string,
): Promise<{ id: string; name: string; url: string; provider: string } | null> {
  const apiKey = (process.env.SHOTSTACK_PROD_API_KEY ?? process.env.SHOTSTACK_PRODUCTION_API_KEY ?? process.env.SHOTSTACK_API_KEY ?? process.env.SHOTSTACK_SANDBOX_API_KEY)?.trim();
  if (!apiKey) {
    logger.warn("Shotstack API key not set — skipping Shotstack music search");
    return null;
  }

  const contextTerms = [
    listingContext.propertyType,
    listingContext.suburb,
    listingContext.summary,
    listingContext.scrapedDescription,
    script.slice(0, 180),
  ]
    .filter(Boolean)
    .join(" ");
  const query = `${MOOD_QUERIES[mood]} ${contextTerms}`.trim();
  const url = `${SHOTSTACK_AUDIO_API_BASE}/sounds?query=${encodeURIComponent(query)}&limit=5`;

  try {
    const res = await fetch(url, {
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status, mood }, "Shotstack music search HTTP error");
      return null;
    }

    const data = (await res.json()) as {
      response?: {
        data?: Array<{
          id?: string;
          title?: string;
          name?: string;
          url?: string;
          preview?: string;
          preview_url?: string;
          provider?: string;
        }>;
      };
    };

    const items = data.response?.data ?? [];
    if (items.length === 0) {
      logger.warn({ mood }, "Shotstack music search returned no results");
      return null;
    }

    const best = items.find((item) => item.url || item.preview || item.preview_url) ?? items[0]!;
    const resolvedUrl = best.url ?? best.preview ?? best.preview_url;
    if (!resolvedUrl) {
      logger.warn({ mood, trackId: best.id ?? null }, "Shotstack music result missing usable URL");
      return null;
    }
    logger.info(
      { mood, trackId: best.id ?? null, trackName: best.title ?? best.name ?? null, provider: best.provider ?? "shotstack" },
      "Shotstack music track selected",
    );
    return {
      id: best.id ?? "",
      name: best.title ?? best.name ?? "Untitled track",
      url: resolvedUrl,
      provider: best.provider ?? "shotstack",
    };
  } catch (err) {
    logger.warn({ err, mood }, "Shotstack music search failed");
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
  preferredMood?: MusicMood | null,
): Promise<MusicSelection> {
  const mood = await selectMoodWithClaude(listingContext, script, preferredMood);

  const shotstackTrack = await searchShotstackTrack(mood, listingContext, script);

  if (shotstackTrack) {
    logger.info(
      { mood, trackId: shotstackTrack.id || null, trackName: shotstackTrack.name, provider: shotstackTrack.provider, volume: 0.12 },
      "Music selection complete — Shotstack track",
    );
    return {
      mood,
      trackId: shotstackTrack.id || null,
      trackName: shotstackTrack.name,
      trackUrl: shotstackTrack.url,
      provider: shotstackTrack.provider,
    };
  }

  const fallbackTrack = STATIC_FALLBACK_TRACKS[mood];
  logger.info(
    { mood, provider: fallbackTrack.provider, fallbackUrl: fallbackTrack.trackUrl, volume: 0.12 },
    "Music selection complete — static fallback track",
  );
  return {
    mood,
    trackId: null,
    trackName: fallbackTrack.trackName,
    trackUrl: fallbackTrack.trackUrl,
    provider: fallbackTrack.provider,
  };
}
