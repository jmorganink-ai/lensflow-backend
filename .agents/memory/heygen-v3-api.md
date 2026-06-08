---
name: HeyGen v3 API — Digital Twin video generation
description: v3 API docs for generating Digital Twin videos. Different endpoint and request shape from v2. Two engines available.
---

# HeyGen v3 API — Digital Twin Video Generation

Full docs index: https://heygen-1fa696a7.mintlify.app/llms.txt

## Key difference from v2
Our current code uses `/v2/video/generate` with `video_inputs[]` array format.
The v3 API uses a **flat** request body to `/v3/videos` — simpler and more powerful.

## Find look IDs (v3 way)
```
GET /v3/avatars/looks?avatar_type=digital_twin&ownership=private
```
Returns `id` field = the `avatar_id` to use. This is the correct way to list Digital Twin looks.

## Create video — v3 endpoint
```
POST /v3/videos
```
```json
{
  "type": "avatar",
  "avatar_id": "YOUR_LOOK_ID",
  "script": "Hello world",
  "voice_id": "YOUR_VOICE_ID",
  "resolution": "1080p",
  "aspect_ratio": "auto"
}
```
Returns `data.video_id`.

## Two engines
| Engine | Key | Notes |
|--------|-----|-------|
| Avatar IV | `avatar_iv` | Default when `engine` omitted. Standard quality. |
| Avatar V | `avatar_v` | Higher quality, cross-reference animation. Must check `supported_api_engines` on look first. |

**Avatar IV only params:** `motion_prompt`, `expressiveness` — DO NOT pass these with Avatar V.

To use Avatar V:
```json
{ "engine": { "type": "avatar_v" } }
```

Check support first:
```
GET /v3/avatars/looks/{look_id}
```
Check `supported_api_engines` array for `"avatar_v"` before requesting it.

## Poll for completion
```
GET /v3/videos/{video_id}
```
Statuses: `pending` → `processing` → `completed` (has `video_url`) or `failed` (has `failure_message`)

## Key optional parameters
| Param | Engine | Description |
|-------|--------|-------------|
| `resolution` | Both | `4k`, `1080p` (recommended), `720p` |
| `aspect_ratio` | Both | `auto` (recommended), `16:9`, `9:16`, `4:5`, `1:1` |
| `remove_background` | Both | Remove avatar background (needs matting training) |
| `background` | Both | Solid color or image |
| `voice_settings` | Both | `speed` (0.5–1.5), `pitch` (-50 to +50), `locale` |
| `motion_prompt` | IV only | Natural language body motion control |
| `expressiveness` | IV only | `high`, `medium`, `low` (default `low`) |
| `output_format` | Both | `mp4` (default) or `webm` (transparent/alpha) |
| `callback_url` | Both | Webhook — POST when video done |

## Webhook (instead of polling)
Pass `callback_url` in create request.
Register endpoint via `POST /v3/webhooks/endpoints`, subscribe to `avatar_video.success` and `avatar_video.fail`.

## Migration note
Current LensFlow code uses `/v2/video/generate` + `/v1/video_status.get`.
Migrating to v3 would give: simpler request format, Avatar V engine option, 1080p/4K resolution, `aspect_ratio: auto`, webhook callbacks, `motion_prompt` for body animation.
