import { logger } from "./logger";

const DID_API_BASE = "https://api.d-id.com";

// Presenter-specific images — public URLs of real Mia/Oliver/Sophie stills.
// Falls back to a neutral D-ID stock avatar if none match.
const PRESENTER_IMAGES: Record<string, string> = {
  mia:
    process.env.DID_IMAGE_MIA ??
    "https://resource2.heygen.ai/best_frame_selection/candidates/a9abe68d714d4cf187aa99eb78ec5647.jpg",
  oliver:
    process.env.DID_IMAGE_OLIVER ??
    "https://resource2.heygen.ai/best_frame_selection/candidates/a9abe68d714d4cf187aa99eb78ec5647.jpg",
  sophie:
    process.env.DID_IMAGE_SOPHIE ??
    "https://resource2.heygen.ai/best_frame_selection/candidates/a9abe68d714d4cf187aa99eb78ec5647.jpg",
};

const DEFAULT_PRESENTER_IMAGE =
  process.env.DID_PRESENTER_IMAGE_URL ??
  "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg";

const DEFAULT_VOICE_ID = process.env.DID_VOICE_ID ?? "en-US-JennyNeural";

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
  /** Presenter name to pick the right source image (mia / oliver / sophie). */
  presenterName?: string;
  /** Pre-generated ElevenLabs audio URL. When provided D-ID uses this instead of its own TTS. */
  audioUrl?: string | null;
  /** Maximum ms to wait for the video (default 120 s). */
  timeoutMs?: number;
}

/**
 * Generate a talking-head presenter video via D-ID.
 *
 * Preferred path: pass `audioUrl` (the ElevenLabs voiceover we already generated)
 * so D-ID only does lipsync — no extra TTS cost and the voice is consistent with
 * the rest of the pipeline.
 *
 * Fallback path (no audioUrl): D-ID generates its own TTS from `script`.
 */
export async function generatePresenterVideoDID(
  script: string,
  options: DIDOptions = {},
): Promise<DIDResult> {
  const { presenterName, audioUrl, timeoutMs = 120_000 } = options;

  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error("DID_API_KEY not set");

  const basicAuth = Buffer.from(`${apiKey}:`).toString("base64");
  const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const sourceImage =
    (presenterName ? PRESENTER_IMAGES[presenterName.toLowerCase()] : null) ??
    DEFAULT_PRESENTER_IMAGE;

  // Build script block: audio URL (lipsync) or TTS text
  const scriptBlock = audioUrl
    ? { type: "audio", audio_url: audioUrl }
    : {
        type: "text",
        input: script,
        provider: { type: "microsoft", voice_id: DEFAULT_VOICE_ID },
      };

  logger.info(
    { presenterName, usingAudioUrl: !!audioUrl },
    "Submitting D-ID talk generation job",
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
    throw new Error(`D-ID create failed (${createRes.status}): ${text}`);
  }

  const createData = (await createRes.json()) as {
    id?: string;
    error?: { description: string };
  };
  if (createData.error)
    throw new Error(`D-ID error: ${createData.error.description}`);

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
      logger.warn({ status: statusRes.status }, "D-ID status poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      status?: string;
      result_url?: string;
      error?: { description: string };
    };

    logger.info({ talkId, status: statusData.status }, "D-ID poll");

    if (statusData.status === "done") {
      const videoUrl = statusData.result_url;
      if (!videoUrl) throw new Error("D-ID completed but no result_url returned");
      logger.info({ talkId, videoUrl }, "D-ID video ready");
      return { videoUrl, videoId: talkId };
    }

    if (statusData.status === "error") {
      throw new Error(
        `D-ID talk generation failed (id=${talkId}): ${statusData.error?.description ?? "unknown"}`,
      );
    }
  }

  throw new DIDTimeoutError();
}
