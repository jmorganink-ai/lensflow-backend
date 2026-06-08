---
name: HeyGen Video Agent (Prompt to Video)
description: POST /v3/video-agents — send a text prompt, agent picks avatar/voice/style and renders. Two-step polling: session → video_id → video_url.
---

# HeyGen Video Agent (Prompt to Video)

## Create session
```
POST /v3/video-agents
```
```json
{
  "prompt": "A 45-second explainer about our Q3 product launch. Friendly tone.",
  "orientation": "landscape",
  "files": [{ "type": "url", "url": "https://example.com/deck.pdf" }],
  "callback_url": "https://yourapp.com/webhooks/heygen",
  "callback_id": "job-123"
}
```

### Parameters
| Param | Required | Description |
|-------|----------|-------------|
| `prompt` | Yes | 1–10,000 chars |
| `avatar_id` | No | Specific look; omit to let agent choose |
| `voice_id` | No | Specific voice; omit to let agent choose |
| `style_id` | No | From GET /v3/video-agents/styles |
| `orientation` | No | `"landscape"` or `"portrait"` |
| `files` | No | Up to 20 attachments (image/video/audio/pdf) |
| `callback_url` | No | Webhook on completion/failure |
| `callback_id` | No | Echoed back in webhook |

### File formats
```json
{ "type": "url", "url": "https://..." }
{ "type": "asset_id", "asset_id": "asset_abc" }
{ "type": "base64", "media_type": "image/png", "data": "iVBORw0..." }
```

### Response
```json
{ "data": { "session_id": "sess_abc123", "status": "generating", "video_id": null, "created_at": 1711382400 } }
```
Session statuses: `thinking` → `generating` → `completed` / `failed`

## Two-step polling
**Step 1** — poll session for video_id:
```
GET /v3/video-agents/{session_id}
```
**Step 2** — poll video for video_url:
```
GET /v3/videos/{video_id}
```

## GET /v3/videos/{video_id} full response fields
| Field | Description |
|-------|-------------|
| `id` | Video ID |
| `title` | Video title |
| `status` | pending / processing / completed / failed |
| `video_url` | Presigned download URL (when completed) |
| `thumbnail_url` | Thumbnail image |
| `gif_url` | Animated GIF preview |
| `captioned_video_url` | Video with burned-in captions |
| `subtitle_url` | SRT subtitle file |
| `duration` | Seconds |
| `created_at` / `completed_at` | Unix timestamps |
| `failure_code` | Machine-readable failure reason (when failed) |
| `failure_message` | Human-readable failure reason (when failed) |
| `video_page_url` | Link to video in HeyGen app |

## LensFlow use cases
- **Morgan AI** — "describe your video" flow → Video Agent generates it with no avatar ID needed
- **Quick demo / lead gen** — low-friction one-prompt video for marketing site visitors
- **Explore → refine** — use Video Agent to find a style, then recreate with Direct Video (POST /v3/videos) for production
