import { logger } from "./logger";

const DID_API_BASE = "https://api.d-id.com";

/**
 * D-ID /clips presenter IDs — trained video presenters, full natural movement.
 * Overridable per-presenter via env vars.
 *
 * Defaults chosen to best match LensFlow's Mia / Oliver / Sophie personas:
 *   mia    → Amber (warm professional female, outdoor)
 *   oliver → Matt  (Australian voice, male, outdoor) — env DID_PRESENTER_OLIVER_YOUNG
 *            Frank (older distinguished male, grey jacket) — env DID_PRESENTER_OLIVER_SENIOR
 *   sophie → Alyssa (polished female, lobby setting)
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
};

const DEFAULT_CLIP_PRESENTER_ID =
  process.env.DID_PRESENTER_DEFAULT ??
  "v2_public_Matt_NoHands_GreyTshirt_Outdoor@rwE9avfhZE";

/** Fallback: /talks image-warp presenter images (used only if clips fails) */
const FALLBACK_PRESENTER_IMAGES: Record<string, string> = {
  mia:
    process.env.DID_IMAGE_MIA ??
    "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg",
  oliver:
    process.env.DID_IMAGE_OLIVER ??
    "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg",
  sophie:
    process.env.DID_IMAGE_SOPHIE ??
    "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg",
};

const DEFAULT_FALLBACK_IMAGE =
  process.env.DID_PRESENTER_IMAGE_URL ??
  "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg";

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

  const sourceImage =
    (presenterName
      ? FALLBACK_PRESENTER_IMAGES[presenterName.toLowerCase()]
      : null) ?? DEFAULT_FALLBACK_IMAGE;

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
 * Primary entry point. Tries /clips first (natural trained presenter),
 * falls back to /talks (image-warp) if clips fails.
 */
export async function generatePresenterVideoDID(
  script: string,
  options: DIDOptions = {},
): Promise<DIDResult> {
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
