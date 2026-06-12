import { logger } from "./logger";

const DID_API_BASE = "https://api.d-id.com";

/**
 * D-ID /clips presenter IDs — trained video presenters, full natural movement.
 * Overridable per-presenter via env vars.
 *
 * D-ID has no custom-branded avatars — only ~98 stock presenters — so each
 * LensFlow persona maps to the closest-matching stock presenter. Override any
 * mapping with the matching env var if you create/buy a custom D-ID avatar.
 *   mia    → Amber  (warm professional female, outdoor)        — env DID_PRESENTER_MIA
 *   oliver → Matt   (Australian male, casual outdoor)          — env DID_PRESENTER_OLIVER
 *   sophie → Alyssa (polished female, red suite lobby)         — env DID_PRESENTER_SOPHIE
 *   james  → Dylan  (authoritative male, grey suit, lobby)     — env DID_PRESENTER_JAMES
 */
const CLIP_PRESENTER_IDS: Record<string, string> = {
  mia:
    process.env.DID_PRESENTER_MIA ??
    "v2_public_Amber_WhiteBlueShirt_Outdoor@k_pw06LqHE",
  oliver:
    process.env.DID_PRESENTER_OLIVER ??
    "v2_public_Matt_NoHands_GreyTshirt_Outdoor@rwE9avfhZE",
  sophie:
    process.env.DID_PRESENTER_SOPHIE ??
    "v2_public_Alyssa_NoHands_RedSuite_Lobby@qtzjxMSwEa",
  james:
    process.env.DID_PRESENTER_JAMES ??
    "v2_public_dylan_grey_suite_lobby@veRJGS_iOD",
};

const DEFAULT_CLIP_PRESENTER_ID =
  process.env.DID_PRESENTER_DEFAULT ??
  "v2_public_Matt_NoHands_GreyTshirt_Outdoor@rwE9avfhZE";

/**
 * The 4 branded LensFlow personas. These render with their REAL branded face
 * via D-ID /talks (an animated portrait); every other ("public") presenter uses
 * a stock /clips presenter. This is the "4 branded, rest public" model.
 */
const BRANDED_PRESENTERS = new Set(["mia", "oliver", "sophie", "james"]);

/**
 * Branded presenter portraits live in object storage and are served via the
 * app's /api/storage proxy (externally reachable in production — the same proxy
 * the pipeline already uses to hand mirrored videos to Shotstack). Built at
 * request time from REPLIT_DOMAINS so it resolves in both dev and production.
 * Override any presenter with an explicit image via env DID_IMAGE_<NAME>.
 */
function brandedPortraitUrl(name: string): string | null {
  const key = name.toLowerCase();
  const override = process.env[`DID_IMAGE_${key.toUpperCase()}`];
  if (override) return override;
  if (!BRANDED_PRESENTERS.has(key)) return null;
  const domain = (process.env.REPLIT_DOMAINS ?? "").split(",")[0]?.trim();
  if (!domain) return null;
  return `https://${domain}/api/storage/objects/presenters/${key}.jpg`;
}

/** Generic stock portraits — last-resort fallback only (no branded image). */
const STOCK_FALLBACK_IMAGES: Record<string, string> = {
  mia: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=512&q=80",
  oliver: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=512&q=80",
  sophie: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=512&q=80",
  james: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&q=80",
};

const DEFAULT_FALLBACK_IMAGE =
  process.env.DID_PRESENTER_IMAGE_URL ??
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=512&q=80";

/** Resolve the /talks source image: branded portrait → stock → default. */
function resolvePresenterImage(name?: string | null): string {
  const key = (name ?? "").toLowerCase();
  return (
    brandedPortraitUrl(key) ?? STOCK_FALLBACK_IMAGES[key] ?? DEFAULT_FALLBACK_IMAGE
  );
}

const DEFAULT_VOICE_ID = process.env.DID_VOICE_ID ?? "en-AU-WilliamNeural";

export class DIDTimeoutError extends Error {
  constructor() {
    super("D-ID timed out waiting for video completion");
    this.name = "DIDTimeoutError";
  }
}

export interface DIDResult {
  videoUrl: string;
  videoId: string;
}

export interface DIDOptions {
  /** Presenter name to pick the right presenter (mia / oliver / sophie). */
  presenterName?: string;
  /** Pre-generated ElevenLabs audio URL. When provided D-ID uses this for lipsync — no extra TTS cost. */
  audioUrl?: string | null;
  /** Maximum ms to wait for the video (default 180 s — clips take longer than talks). */
  timeoutMs?: number;
  /** Test/dev mode uses shorter scripts to target ~10 second outputs. */
  testMode?: boolean;
}

const TEST_MODE_TARGET_SECONDS = 10;
const PRODUCTION_TARGET_SECONDS = 30;
const APPROX_WORDS_PER_SECOND = 2.4;

function limitScriptForDuration(script: string, targetSeconds: number): string {
  const normalized = script.replace(/\s+/g, " ").trim();
  if (!normalized) return normalized;

  const maxWords = Math.max(1, Math.floor(targetSeconds * APPROX_WORDS_PER_SECOND));
  const words = normalized.split(" ");
  if (words.length <= maxWords) return normalized;

  const truncated = words.slice(0, maxWords).join(" ").trim();
  const lastSentenceBreak = Math.max(
    truncated.lastIndexOf(". "),
    truncated.lastIndexOf("! "),
    truncated.lastIndexOf("? "),
  );

  if (lastSentenceBreak >= Math.floor(truncated.length * 0.6)) {
    return truncated.slice(0, lastSentenceBreak + 1).trim();
  }

  return `${truncated.replace(/[.,;:!?-]*$/, "").trim()}.`;
}

function getAuthHeaders(apiKey: string) {
  const basicAuth = Buffer.from(`${apiKey}:`).toString("base64");
  return {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * Generate a presenter video using D-ID /clips — trained video presenters.
 * Looks completely natural (full body, real motion, proper lipsync).
 *
 * Pass `audioUrl` (ElevenLabs voiceover) to sync lips to our voice.
 * Falls back to Microsoft TTS if no audioUrl.
 */
async function generateClip(
  script: string,
  options: DIDOptions = {},
): Promise<DIDResult> {
  const { presenterName, audioUrl, timeoutMs = 180_000, testMode = false } = options;

  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error("DID_API_KEY not set");

  const headers = getAuthHeaders(apiKey);

  const presenterId =
    (presenterName
      ? CLIP_PRESENTER_IDS[presenterName.toLowerCase()]
      : null) ?? DEFAULT_CLIP_PRESENTER_ID;

  const targetDurationSeconds = testMode
    ? TEST_MODE_TARGET_SECONDS
    : PRODUCTION_TARGET_SECONDS;
  const limitedScript = limitScriptForDuration(script, targetDurationSeconds);

  const scriptBlock = audioUrl
    ? { type: "audio", audio_url: audioUrl }
    : {
        type: "text",
        input: limitedScript,
        provider: { type: "microsoft", voice_id: DEFAULT_VOICE_ID },
      };

  logger.info(
    {
      presenterName,
      presenterId,
      usingAudioUrl: !!audioUrl,
      testMode,
      targetDurationSeconds,
      originalScriptLength: script.length,
      submittedScriptLength: limitedScript.length,
    },
    "Submitting D-ID clip generation job",
  );

  const createRes = await fetch(`${DID_API_BASE}/clips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      presenter_id: presenterId,
      script: scriptBlock,
      config: { result_format: "mp4", output_resolution: 1080 },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`D-ID clip create failed (${createRes.status}): ${text}`);
  }

  const createData = (await createRes.json()) as {
    id?: string;
    error?: { description: string };
    kind?: string;
    description?: string;
  };

  if (createData.kind === "NotFoundError" || createData.error) {
    throw new Error(
      `D-ID clip error: ${createData.description ?? createData.error?.description ?? "unknown"}`,
    );
  }

  const clipId = createData.id;
  if (!clipId) throw new Error("D-ID did not return a clip id");

  logger.info({ clipId }, "D-ID clip queued — polling for completion");

  const POLL_INTERVAL_MS = 5_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${DID_API_BASE}/clips/${clipId}`, {
      headers,
    });

    if (!statusRes.ok) {
      logger.warn({ status: statusRes.status }, "D-ID clip status poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      status?: string;
      result_url?: string;
      error?: { description: string };
    };

    logger.info({ clipId, status: statusData.status }, "D-ID clip poll");

    if (statusData.status === "done") {
      const videoUrl = statusData.result_url;
      if (!videoUrl) throw new Error("D-ID clip completed but no result_url");
      logger.info({ clipId, videoUrl }, "D-ID clip video ready");
      return { videoUrl, videoId: clipId };
    }

    if (statusData.status === "error") {
      throw new Error(
        `D-ID clip failed (id=${clipId}): ${statusData.error?.description ?? "unknown"}`,
      );
    }
  }

  throw new DIDTimeoutError();
}

/**
 * Fallback: generate via D-ID /talks (animates a static image).
 * Looks robotic compared to /clips — only used when clips fails.
 */
async function generateTalk(
  script: string,
  options: DIDOptions = {},
): Promise<DIDResult> {
  const { presenterName, audioUrl, timeoutMs = 120_000, testMode = false } = options;

  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error("DID_API_KEY not set");

  const headers = getAuthHeaders(apiKey);

  const sourceImage = resolvePresenterImage(presenterName);

  const targetDurationSeconds = testMode
    ? TEST_MODE_TARGET_SECONDS
    : PRODUCTION_TARGET_SECONDS;
  const limitedScript = limitScriptForDuration(script, targetDurationSeconds);

  const scriptBlock = audioUrl
    ? { type: "audio", audio_url: audioUrl }
    : {
        type: "text",
        input: limitedScript,
        provider: { type: "microsoft", voice_id: DEFAULT_VOICE_ID },
      };

  logger.info(
    {
      presenterName,
      sourceImage,
      usingAudioUrl: !!audioUrl,
      testMode,
      targetDurationSeconds,
      originalScriptLength: script.length,
      submittedScriptLength: limitedScript.length,
    },
    "Submitting D-ID talk generation job (fallback)",
  );

  const createRes = await fetch(`${DID_API_BASE}/talks`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source_url: sourceImage,
      script: scriptBlock,
      config: { fluent: true, pad_audio: 0, stitch: true },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`D-ID talk create failed (${createRes.status}): ${text}`);
  }

  const createData = (await createRes.json()) as {
    id?: string;
    error?: { description: string };
  };
  if (createData.error)
    throw new Error(`D-ID talk error: ${createData.error.description}`);

  const talkId = createData.id;
  if (!talkId) throw new Error("D-ID did not return a talk id");

  logger.info({ talkId }, "D-ID talk queued — polling for completion");

  const POLL_INTERVAL_MS = 4_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${DID_API_BASE}/talks/${talkId}`, {
      headers,
    });

    if (!statusRes.ok) {
      logger.warn({ status: statusRes.status }, "D-ID talk poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      status?: string;
      result_url?: string;
      error?: { description: string };
    };

    logger.info({ talkId, status: statusData.status }, "D-ID talk poll");

    if (statusData.status === "done") {
      const videoUrl = statusData.result_url;
      if (!videoUrl) throw new Error("D-ID talk completed but no result_url");
      logger.info({ talkId, videoUrl }, "D-ID talk video ready");
      return { videoUrl, videoId: talkId };
    }

    if (statusData.status === "error") {
      throw new Error(
        `D-ID talk failed (id=${talkId}): ${statusData.error?.description ?? "unknown"}`,
      );
    }
  }

  throw new DIDTimeoutError();
}

/**
 * Primary entry point.
 *
 * Branded personas (Mia / Oliver / Sophie / James) render with their REAL face
 * via /talks (animated branded portrait), falling back to a stock /clips
 * presenter only if /talks fails. Every other ("public") presenter uses a stock
 * /clips presenter first, with /talks as the fallback. This delivers the
 * "4 branded, rest public" model without HeyGen credit.
 */
export async function generatePresenterVideoDID(
  script: string,
  options: DIDOptions = {},
): Promise<DIDResult> {
  const key = options.presenterName?.toLowerCase() ?? "";
  const useBrandedFace = BRANDED_PRESENTERS.has(key) && !!brandedPortraitUrl(key);

  if (useBrandedFace) {
    try {
      return await generateTalk(script, options);
    } catch (talkErr) {
      const reason = talkErr instanceof Error ? talkErr.message : String(talkErr);
      logger.warn(
        { reason, presenterName: options.presenterName },
        "D-ID branded /talks failed — falling back to stock /clips",
      );
      return generateClip(script, options);
    }
  }

  try {
    return await generateClip(script, options);
  } catch (clipErr) {
    const reason = clipErr instanceof Error ? clipErr.message : String(clipErr);
    logger.warn(
      { reason, presenterName: options.presenterName },
      "D-ID clips failed — falling back to /talks",
    );
    return generateTalk(script, options);
  }
}
