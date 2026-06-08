import { logger } from "./logger";

const HEYGEN_API_BASE = "https://api.heygen.com";

// ── Per-presenter avatar / look IDs ──────────────────────────────────────────
// Set these env vars in Secrets to lock each presenter to a specific HeyGen avatar.
// To find valid IDs for your account call GET /api/heygen/avatars.
//
// IMPORTANT: HeyGen has two ID types:
//   - avatar_id (e.g. "Gala_standing_businesssofa_front") — public/library avatars
//   - look_id   (UUID hex) — custom studio looks
// These are sent differently in the API payload. This code auto-detects which type
// based on whether the ID looks like a UUID (hex with dashes).
//
// AVATAR_* must be a valid LOOK ID (not a group ID) — group IDs cause
// "avatar look not found" errors from HeyGen video generation. Use the first
// look ID from each presenter group as the default. Verified 2026-06-08.
const AVATAR_MIA     = process.env.HEYGEN_AVATAR_MIA     ?? "6efa13ba628e4f9db8aee1164864fdb5"; // Radiant Professional
const AVATAR_SOPHIE  = process.env.HEYGEN_AVATAR_SOPHIE  ?? "b1a01a6df4e141d7ab71999b95403455"; // The Elegant, Smiling Real Estate Director
const AVATAR_OLIVER  = process.env.HEYGEN_AVATAR_OLIVER  ?? "072d3a64f1884dedaaca04d6ac6e7be7"; // Oliver in blue suite
const AVATAR_JAMES   = process.env.HEYGEN_AVATAR_JAMES   ?? "426df1e119054477a2188b41dbca60cf"; // James Presenter in blue suit

// ── Presenter look catalogue ──────────────────────────────────────────────────
// Each presenter can have multiple HeyGen avatar looks (outfits/scenes).
// The first entry in each array is the default; the id must match the avatar_id
// used in HeyGen (either a group/default ID or a specific look ID).
export interface PresenterLook {
  id: string;
  name: string;
  previewImageUrl?: string;
}

// HeyGen avatar group IDs — each group holds all looks for that presenter.
// Fetching /v2/avatar_group/{groupId}/avatars returns every look with its thumbnail.
//
// Verified group IDs (2026-06-08):
//   Mia:    1602766f0e7344199b7b1a8bcf7b7855 — Radiant Professional, Elegant Office, etc. (10 looks)
//           (91141b5f57114fccb565ab32ca058a1a is a second smaller group — not used)
//   Sophie: 267832a040cd46998928c37498777215 — blue blazer, blue sweater, grey blazer, etc.
//   Oliver: b88ace7a30a34a76ae92a16dd84c18af — confirmed via app.heygen.com. Looks were originally
//           named "James in..." but belong to Oliver. Renamed via v3 API to "Oliver in...".
//   James:  9f2454deef0840008f9d6f6753c6de7b — blue suit, blue shirt, beige blazer, navy suit, etc.
const GROUP_MIA    = process.env.HEYGEN_GROUP_MIA    ?? "1602766f0e7344199b7b1a8bcf7b7855";
const GROUP_SOPHIE = process.env.HEYGEN_GROUP_SOPHIE ?? "267832a040cd46998928c37498777215";
const GROUP_OLIVER = process.env.HEYGEN_GROUP_OLIVER ?? "b88ace7a30a34a76ae92a16dd84c18af";
const GROUP_JAMES  = process.env.HEYGEN_GROUP_JAMES  ?? "9f2454deef0840008f9d6f6753c6de7b";

const PRESENTER_GROUP_IDS: Record<string, string> = {
  mia:    GROUP_MIA,
  sophie: GROUP_SOPHIE,
  oliver: GROUP_OLIVER,
  james:  GROUP_JAMES,
};

// Static fallback — used when no group ID is configured for a presenter.
export const PRESENTER_LOOKS: Record<string, PresenterLook[]> = {
  mia:    [{ id: AVATAR_MIA,    name: "Default" }],
  oliver: [{ id: AVATAR_OLIVER, name: "Default" }],
  sophie: [{ id: AVATAR_SOPHIE, name: "Default" }],
  james:  [{ id: AVATAR_JAMES,  name: "Default" }],
};

// Fetch all looks for a presenter from their HeyGen avatar group.
// Falls back to the static list if no group is configured or the call fails.
export async function getPresenterLooks(presenter: string): Promise<PresenterLook[]> {
  const apiKey  = process.env.HEYGEN_API_KEY;
  const key     = presenter.toLowerCase();
  const groupId = PRESENTER_GROUP_IDS[key] ?? "";
  const fallback = PRESENTER_LOOKS[key] ?? [];

  if (!apiKey) return fallback;

  if (groupId) {
    try {
      const res = await fetch(`${HEYGEN_API_BASE}/v2/avatar_group/${groupId}/avatars`, {
        headers: { "X-Api-Key": apiKey },
        signal: AbortSignal.timeout(12_000),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          data?: { avatar_list?: Array<{ id: string; name?: string; image_url?: string }> };
        };
        const list = (data.data?.avatar_list ?? []).filter((a) => a.id);
        if (list.length > 0) {
          return list.map((a) => {
            // Oliver's looks were originally named "James in ..." in HeyGen (now fixed in dashboard).
            // Keep the server-side rename as a safety net in case HeyGen reverts or adds new looks.
            let name = a.name ?? a.id;
            if (key === "oliver") {
              name = name.replace(/^James\b/i, "Oliver");
            }
            return { id: a.id, name, previewImageUrl: a.image_url };
          });
        }
      }
    } catch {
      // fall through to static list
    }
  }

  return fallback;
}

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
const VOICE_FEMALE   = process.env.HEYGEN_VOICE_FEMALE        ?? "f8c69e517f424cafaecde32dde57096b"; // Allison (Australian) — shared fallback
const VOICE_MIA      = process.env.HEYGEN_VOICE_MIA           ?? VOICE_FEMALE;
const VOICE_SOPHIE   = process.env.HEYGEN_VOICE_SOPHIE        ?? VOICE_FEMALE;
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

  if (name === "mia"    || name === "emma")                                        return { avatarId: AVATAR_MIA,    voiceId: VOICE_MIA };
  if (name === "sophie" || name === "sophia" || name === "australian real estate agent") return { avatarId: AVATAR_SOPHIE, voiceId: VOICE_SOPHIE };
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
  lookId?: string | null,
): Promise<HeyGenResult> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY not set");

  // Priority: lookId (user-chosen outfit) > customAvatarId (user settings) > presenter default
  const fallback = getAvatarConfig(voiceName, elevenLabsVoiceId);
  const avatarId = lookId ?? customAvatarId ?? fallback.avatarId;
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
      dimension: { width: 1920, height: 1080 },
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
      data?: {
        status: string;
        video_url?: string;
        error?: {
          code?: string;
          message?: string;
          detail?: string;
          activity_name?: string;
        };
      };
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
      const heygenError = statusData.data?.error;
      logger.error(
        { videoId, errorCode: heygenError?.code, errorMessage: heygenError?.message, errorDetail: heygenError?.detail, activity: heygenError?.activity_name },
        "HeyGen video generation failed — full error detail",
      );
      const reason = heygenError?.message ?? heygenError?.detail ?? heygenError?.code ?? "unknown reason";
      throw new Error(`HeyGen video generation failed (id=${videoId}): ${reason}`);
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
    Mia:    { avatarId: AVATAR_MIA,    voiceId: VOICE_MIA },
    Sophie: { avatarId: AVATAR_SOPHIE, voiceId: VOICE_SOPHIE },
    Oliver: { avatarId: AVATAR_OLIVER, voiceId: VOICE_OLIVER },
    James:  { avatarId: AVATAR_JAMES,  voiceId: VOICE_JAMES },
  };
}
