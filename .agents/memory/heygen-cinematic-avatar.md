---
name: HeyGen Cinematic Avatar API
description: Prompt-driven video generation — no script or voice needed. Up to 3 avatar looks, reference media, Seedance pipeline. Same /v3/videos endpoint, type="cinematic_avatar".
---

# HeyGen Cinematic Avatar

Same endpoint as Digital Twin: `POST /v3/videos` — just use `type: "cinematic_avatar"`.

## Key difference from Digital Twin
- **No script, no voice** — replaced by a natural-language `prompt`
- Up to **3 avatar looks** in one shot (`avatar_id` is an array)
- **Reference media** to steer style, motion, framing
- Powered by the **Seedance pipeline**

## Minimal request
```json
{
  "type": "cinematic_avatar",
  "prompt": "A real estate agent walks through a sunlit luxury home, gesturing toward the open-plan kitchen, shot handheld in a documentary style.",
  "avatar_id": ["YOUR_LOOK_ID"],
  "aspect_ratio": "16:9",
  "resolution": "1080p",
  "duration": 10
}
```

## Parameters
| Param | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `"cinematic_avatar"` |
| `prompt` | Yes | 1–10,000 chars describing shot, action, camera, mood |
| `avatar_id` | Yes | Array of 1–3 look IDs |
| `references` | No | Up to 3 videos / 9 images (shared budget with avatar_id) — url, asset_id, or base64 |
| `aspect_ratio` | No | `16:9` (default), `9:16`, `1:1` |
| `resolution` | No | `720p` (default) or `1080p` |
| `duration` | No | 4–15 seconds, default 10. Omit if `auto_duration: true` |
| `auto_duration` | No | Let HeyGen pick duration |
| `enhance_prompt` | No | Auto-expand short prompt to richer description |
| `callback_url` | No | Webhook POST when done |

## Media budget
avatar_id arrays + references share: **max 3 videos + 9 images total**

## LensFlow use cases
- **B-roll / property walkthrough shots** — generate cinematic property tour clips using Mia/Oliver without needing a separate voiceover
- **Marketing thumbnails / social clips** — short cinematic avatar clips for Instagram/LinkedIn
- **Multi-presenter shots** — pass 2–3 look IDs to feature multiple presenters in one scene
- Could replace or complement Shotstack for the final composition step

## Polling — same as Digital Twin
`GET /v3/videos/{video_id}` → statuses: pending → processing → completed (video_url) / failed (failure_message)
