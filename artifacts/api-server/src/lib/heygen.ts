import { logger } from "./logger";

const HEYGEN_API_BASE = "https://api.heygen.com";

// ── Per-presenter avatar / look IDs ──────────────────────────────────────────
// Set these env vars in Secrets to lock each presenter to a specific HeyGen avatar.
// To find valid IDs for your account call GET /api/heygen/avatars.
//
// IMPORTANT: HeyGen has two ID types:
//   - avatar_id (e.g. "Gala_standing_businesssofa_front") — public/library avatars
//   - look_id   (e.g. "2d06d0f7cca14fe0a9c03e92bd059e27") — custom studio looks
// These are sent differently in the API payload. This code auto-detects which type
// based on whether the ID looks like a UUID (hex with dashes).
const AVATAR_MIA     = process.env.HEYGEN_AVATAR_MIA     ?? process.env.HEYGEN_AVATAR_FEMALE ?? "Gala_standing_businesssofa_front";
const AVATAR_SOPHIE  = process.env.HEYGEN_AVATAR_SOPHIE  ?? process.env.HEYGEN_AVATAR_FEMALE ?? "Freja_public_1";
const AVATAR_OLIVER  = process.env.HEYGEN_AVATAR_OLIVER  ?? process.env.HEYGEN_AVATAR_MALE   ?? "Onat_Suit_Front_public";
const AVATAR_JAMES   = process.env.HEYGEN_AVATAR_JAMES   ?? process.env.HEYGEN_AVATAR_MALE   ?? "Bryan_Suit_Front_public";

// Returns the correct HeyGen character payload depending on whether the ID is
// a UUID-style look_id or a named avatar_id.
function buildCharacterPayload(avatarId: string): Record<string, unknown> {
  const isLookId = /^[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}$/.test(avatarId.replace(/-/g, ""));
  if (isLookId) {
    return { type: "avatar", avatar_id: avatarId };
  }
  return { type: "avatar", avatar_id: avatarId, avatar_style: "normal" };
}

// ── Per-presenter HeyGen voice IDs ───────────────────────────────────────────
// These are HeyGen-side voices (not ElevenLabs). Override per presenter if needed.
const VOICE_FEMALE   = process.env.HEYGEN_VOICE_FEMALE        ?? "f8c69e517f424cafaecde32dde57096b"; // Allison (Australian)
const VOICE_JAMES    = process.env.HEYGEN_VOICE_JAMES         ?? "f38a635bee7a4d1f9b0a654a31d050d2"; // Chill Brian (Australian male)
const VOICE_OLIVER   = process.env.HEYGEN_VOICE_OLIVER        ?? "kbxy8S61KI1ZTJZFHKQV";            // Educated British Baritone

// ElevenLabs voice IDs that map to male presenters
const ELEVENLABS_MALE_VOICE_IDS = new Set([
  "jfIS2w2yJi0grJZPyEsk", // Oliver
  "yXFr3XVHzrViCIHi1yoc", // James
]);

const MALE_VOICE_NAMES = new Set(["oliver", "james", "morgan voice", "aussie voice"]);

function getAvatarConfig(
  voiceName?: string | null,
  elevenLabsVoiceId?: string | null,
): { avatarId: string; voiceId: string } {
  const name = (voiceName ?? "").toLowerCase().trim();

  if (name === "mia"    || name === "emma")                                        return { avatarId: AVATAR_MIA,    voiceId: VOICE_FEMALE };
  if (name === "sophie" || name === "sophia" || name === "australian real estate agent") return { avatarId: AVATAR_SOPHIE, voiceId: VOICE_FEMALE };
  if (name === "oliver" || name === "aussie voice")                                return { avatarId: AVATAR_OLIVER, voiceId: VOICE_OLIVER };
  if (name === "james"  || name === "morgan voice")                                return { avatarId: AVATAR_JAMES,  voiceId: VOICE_JAMES };

  // Fallback: infer from voice gender
  const isMale =
    MALE_VOICE_NAMES.has(name) ||
    (elevenLabsVoiceId != null && ELEVENLABS_MALE_VOICE_IDS.has(elevenLabsVoiceId));

  return isMale
    ? { avatarId: AVATAR_JAMES,  voiceId: VOICE_JAMES }
    : { avatarId: AVATAR_MIA,    voiceId: VOICE_FEMALE };
}

export class HeyGenTimeoutError extends Error {
  constructor(videoId: string) {
    super(`HeyGen timed out waiting for video (video_id=${videoId})`);
    this.name = "HeyGenTimeoutError";
  }
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
  timeoutMs = 90_000,
  elevenLabsAudioUrl?: string | null,
): Promise<HeyGenResult> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY not set");

  // Prefer custom digital-twin avatar saved in user settings over the defaults
  const fallback = getAvatarConfig(voiceName, elevenLabsVoiceId);
  const avatarId = customAvatarId ?? fallback.avatarId;
  const voiceId  = customHeygenVoiceId ?? fallback.voiceId;

  // If an ElevenLabs audio URL is provided, use it for lip-sync instead of HeyGen's own TTS
  const voiceInput = elevenLabsAudioUrl
    ? { type: "audio", audio_url: elevenLabsAudioUrl }
    : { type: "text", input_text: script, voice_id: voiceId };

  logger.info(
    { avatarId, voiceName, presenter: voiceName ?? "unknown", usingElevenLabs: !!elevenLabsAudioUrl },
    "Submitting HeyGen video generation job",
  );

  const submitRes = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_inputs: [
        {
          character: buildCharacterPayload(avatarId),
          voice: voiceInput,
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

  const POLL_INTERVAL_MS = 6_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(
      `${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`,
      { headers: { "X-Api-Key": apiKey } },
    );

    if (!statusRes.ok) {
      logger.warn({ status: statusRes.status }, "HeyGen status poll failed — retrying");
      continue;
    }

    const statusData = (await statusRes.json()) as {
      data?: { status: string; video_url?: string };
    };

    const status = statusData.data?.status;
    logger.info({ videoId, status, elapsed: Date.now() - (deadline - timeoutMs) }, "HeyGen poll");

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

  throw new HeyGenTimeoutError(videoId);
}

// ── Diagnostic helpers ────────────────────────────────────────────────────────

export async function listHeyGenAvatars(): Promise<unknown> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY not set");
  const res = await fetch(`${HEYGEN_API_BASE}/v2/avatars`, {
    headers: { "X-Api-Key": apiKey },
  });
  if (!res.ok) throw new Error(`HeyGen avatars list failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function listHeyGenVoices(): Promise<unknown> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY not set");
  const res = await fetch(`${HEYGEN_API_BASE}/v2/voices`, {
    headers: { "X-Api-Key": apiKey },
  });
  if (!res.ok) throw new Error(`HeyGen voices list failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export function getPresenterAvatarMap() {
  return {
    Mia:    { avatarId: AVATAR_MIA,    voiceId: VOICE_FEMALE },
    Sophie: { avatarId: AVATAR_SOPHIE, voiceId: VOICE_FEMALE },
    Oliver: { avatarId: AVATAR_OLIVER, voiceId: VOICE_OLIVER },
    James:  { avatarId: AVATAR_JAMES,  voiceId: VOICE_JAMES },
  };
}
