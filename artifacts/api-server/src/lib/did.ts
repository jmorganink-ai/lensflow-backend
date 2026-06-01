import { logger } from "./logger";

const DID_API_BASE = "https://api.d-id.com";

// Default presenter image — a professional neutral avatar used when no
// custom image is provided. D-ID requires a public source_url.
const DEFAULT_PRESENTER_IMAGE =
  process.env.DID_PRESENTER_IMAGE_URL ??
  "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg";

// Default D-ID voice — en-US neural voice that sounds natural for property scripts.
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

/**
 * Generate a talking-head presenter video via D-ID.
 *
 * Used as a backup when HeyGen doesn't complete within the 60-second budget.
 *
 * @param script      The voiceover script text.
 * @param timeoutMs   Maximum ms to wait for the video (default 90 s).
 */
export async function generatePresenterVideoDID(
  script: string,
  timeoutMs = 90_000,
): Promise<DIDResult> {
  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error("DID_API_KEY not set");

  // D-ID uses HTTP Basic auth: API key as username, empty password.
  const basicAuth = Buffer.from(`${apiKey}:`).toString("base64");
  const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  logger.info("Submitting D-ID talk generation job");

  const createRes = await fetch(`${DID_API_BASE}/talks`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source_url: DEFAULT_PRESENTER_IMAGE,
      script: {
        type: "text",
        input: script,
        provider: {
          type: "microsoft",
          voice_id: DEFAULT_VOICE_ID,
        },
      },
      config: {
        fluent: true,
        pad_audio: 0,
        stitch: true,
      },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`D-ID create failed (${createRes.status}): ${text}`);
  }

  const createData = (await createRes.json()) as { id?: string; error?: { description: string } };
  if (createData.error) throw new Error(`D-ID error: ${createData.error.description}`);

  const talkId = createData.id;
  if (!talkId) throw new Error("D-ID did not return a talk id");

  logger.info({ talkId }, "D-ID talk queued — polling for completion");

  const POLL_INTERVAL_MS = 4_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${DID_API_BASE}/talks/${talkId}`, { headers });

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
      throw new Error(`D-ID talk generation failed (id=${talkId}): ${statusData.error?.description ?? "unknown"}`);
    }
  }

  throw new DIDTimeoutError();
}
