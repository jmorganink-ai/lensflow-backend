import { logger } from "./logger";

const HEYGEN_API_BASE = "https://api.heygen.com";

// Default avatar IDs — override via env vars if you have custom avatars
// Get your avatar IDs from app.heygen.com → Avatars
const AVATAR_FEMALE = process.env.HEYGEN_AVATAR_FEMALE ?? "Daisy-inskirt-20220818";
const AVATAR_MALE   = process.env.HEYGEN_AVATAR_MALE   ?? "Josh_Chipmunk_public";

// HeyGen voice IDs for Australian-adjacent English accents
// Get yours from app.heygen.com → Voices
const VOICE_FEMALE = process.env.HEYGEN_VOICE_FEMALE ?? "2d5b0e6cf36f460aa7fc47e3eee4ba54";
const VOICE_MALE   = process.env.HEYGEN_VOICE_MALE   ?? "ad7dc22ff5884b9f84c06bb77e1ca1ec";

function getAvatarConfig(voiceName?: string | null): { avatarId: string; voiceId: string } {
  const name = (voiceName ?? "").toLowerCase();
  if (name === "oliver") {
    return { avatarId: AVATAR_MALE, voiceId: VOICE_MALE };
  }
  return { avatarId: AVATAR_FEMALE, voiceId: VOICE_FEMALE };
}

export interface HeyGenResult {
  videoUrl: string;
  videoId: string;
}

export async function generatePresenterVideo(
  script: string,
  voiceName?: string | null,
): Promise<HeyGenResult> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY not set");

  const { avatarId, voiceId } = getAvatarConfig(voiceName);

  logger.info({ avatarId, voiceId }, "Submitting HeyGen video generation job");

  const submitRes = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: script,
            voice_id: voiceId,
          },
          background: {
            type: "color",
            value: "#0a0f1e",
          },
        },
      ],
      dimension: { width: 1280, height: 720 },
    }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`HeyGen submit failed (${submitRes.status}): ${text}`);
  }

  const submitData = (await submitRes.json()) as {
    data?: { video_id: string };
    error?: { message: string };
  };

  if (submitData.error) throw new Error(`HeyGen error: ${submitData.error.message}`);
  const videoId = submitData.data?.video_id;
  if (!videoId) throw new Error("HeyGen did not return a video_id");

  logger.info({ videoId }, "HeyGen video queued — polling for completion");

  // Poll up to 8 minutes (HeyGen typically takes 1-4 min)
  const POLL_INTERVAL_MS = 8_000;
  const MAX_ATTEMPTS = 60;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(
      `${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`,
      { headers: { "X-Api-Key": apiKey } },
    );

    if (!statusRes.ok) {
      logger.warn({ attempt, status: statusRes.status }, "HeyGen status poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      data?: { status: string; video_url?: string };
    };

    const status = statusData.data?.status;
    logger.info({ videoId, status, attempt }, "HeyGen poll");

    if (status === "completed") {
      const videoUrl = statusData.data?.video_url;
      if (!videoUrl) throw new Error("HeyGen completed but no video_url returned");
      logger.info({ videoId, videoUrl }, "HeyGen video ready");
      return { videoUrl, videoId };
    }

    if (status === "failed") {
      throw new Error(`HeyGen video generation failed (id=${videoId})`);
    }
  }

  throw new Error(`HeyGen timed out after ${MAX_ATTEMPTS} polls (video_id=${videoId})`);
}
