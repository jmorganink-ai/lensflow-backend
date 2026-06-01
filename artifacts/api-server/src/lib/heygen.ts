import { logger } from "./logger";

const HEYGEN_API_BASE = "https://api.heygen.com";

// John Morgan — the only custom avatar in this HeyGen account.
// Used for James (the founder) and all male presenters.
const JOHN_MORGAN_AVATAR_ID = "d6009ad7f6234aa1b98565649f5ffd55";
const JOHN_MORGAN_VOICE_ID  = "6539347d386844db8516f1d3828938f0"; // "John Morgan" HeyGen voice

// Female presenters use Adriana Business Front — professional, Western-looking.
const FEMALE_AVATAR_ID = process.env.HEYGEN_AVATAR_FEMALE ?? "Adriana_Business_Front_public";
const FEMALE_VOICE_ID  = process.env.HEYGEN_VOICE_FEMALE  ?? "f8c69e517f424cafaecde32dde57096b"; // Allison

// ElevenLabs voice IDs that map to male presenters
const ELEVENLABS_MALE_VOICE_IDS = new Set([
  "yXFr3XVHzrViCIHi1yoc", // Oliver
  "J5tYJbZpL62OrQsj70q6", // James (morgan voice)
]);

// Male presenter voiceNames
const MALE_VOICE_NAMES = new Set(["oliver", "james", "morgan voice", "aussie voice"]);

function getAvatarConfig(voiceName?: string | null, elevenLabsVoiceId?: string | null): { avatarId: string; voiceId: string } {
  const name = (voiceName ?? "").toLowerCase();
  const isMale =
    MALE_VOICE_NAMES.has(name) ||
    (elevenLabsVoiceId != null && ELEVENLABS_MALE_VOICE_IDS.has(elevenLabsVoiceId));

  if (isMale) {
    return {
      avatarId: process.env.HEYGEN_AVATAR_MALE ?? JOHN_MORGAN_AVATAR_ID,
      voiceId: JOHN_MORGAN_VOICE_ID,
    };
  }
  return { avatarId: FEMALE_AVATAR_ID, voiceId: FEMALE_VOICE_ID };
}

export interface HeyGenResult {
  videoUrl: string;
  videoId: string;
}

export async function generatePresenterVideo(
  script: string,
  voiceName?: string | null,
  elevenLabsVoiceId?: string | null,
  customAvatarId?: string | null,
  customHeygenVoiceId?: string | null,
): Promise<HeyGenResult> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY not set");

  // Prefer custom digital-twin avatar saved in user settings over the defaults
  const fallback = getAvatarConfig(voiceName, elevenLabsVoiceId);
  const avatarId = customAvatarId ?? fallback.avatarId;
  const voiceId = customHeygenVoiceId ?? fallback.voiceId;

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

  // Poll up to 90 seconds (15 × 6s). HeyGen typically responds in 30-60s.
  // Keeping this tight prevents the step from blocking the pipeline for minutes.
  const POLL_INTERVAL_MS = 6_000;
  const MAX_ATTEMPTS = 15;

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
