---
name: HeyGen Image to Video API
description: Animate any image into a talking video — no avatar setup needed. Same POST /v3/videos endpoint, type="image". Good for one-off content or quick tests.
---

# HeyGen Image to Video

Same endpoint as Digital Twin: `POST /v3/videos` — use `type: "image"` with an `image` object instead of `avatar_id`.

## Minimal request (from URL)
```json
{
  "type": "image",
  "image": { "type": "url", "url": "https://example.com/person.jpg" },
  "script": "Hello! This video was generated from a photo.",
  "voice_id": "YOUR_VOICE_ID",
  "resolution": "1080p",
  "aspect_ratio": "auto"
}
```

## From uploaded asset
```bash
# 1. Upload
curl -X POST "https://api.heygen.com/v3/assets" -H "x-api-key: KEY" -F "file=@person.jpg"
# returns asset_id

# 2. Generate
{ "type": "image", "image": { "type": "asset_id", "asset_id": "ASSET_ID" }, ... }
```

## ElevenLabs audio lipsync (instead of script+voice_id)
```json
{
  "type": "image",
  "image": { "type": "url", "url": "..." },
  "audio_url": "https://example.com/narration.mp3"
}
```
`script` and `audio_url` are mutually exclusive. If using `script`, must also provide `voice_id`.

## Polling — same as all v3 videos
`GET /v3/videos/{video_id}` → pending → processing → completed (video_url) / failed (failure_message)

## Optional parameters
| Param | Description |
|-------|-------------|
| `resolution` | `4k`, `1080p` (recommended), `720p` |
| `aspect_ratio` | `auto` (matches source), `16:9`, `9:16`, `4:5`, `1:1` |
| `remove_background` | Remove image background |
| `background` | Solid color or image background |
| `voice_settings` | `speed` (0.5–1.5), `pitch` (-50 to +50), `locale` |
| `callback_url` | Webhook on completion |
| `callback_id` | Your own ID echoed back in webhook |

## Image-to-Video vs Photo Avatar
| | Image-to-Video | Photo Avatar |
|-|----------------|--------------|
| Setup | None — just pass image URL | Requires POST /v3/avatars first |
| Reusability | One-off per request | Reusable via avatar_id |
| Motion prompt | ❌ | ✅ |
| Expressiveness | ❌ | ✅ high/medium/low |
| Best for | Quick tests, one-off content | Recurring brand content |

## LensFlow use cases
- **Self-recorded jobs** (`inputMode: "selfie"`) — user uploads a photo, we animate it with their ElevenLabs voiceover via `audio_url`
- **Lead gen / quick demo** — animate a listing agent's headshot from a property profile page
- **No avatar required** — great for clients who don't want to film a full Digital Twin session
