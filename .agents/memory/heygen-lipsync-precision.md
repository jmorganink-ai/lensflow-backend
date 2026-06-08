---
name: HeyGen Lipsync Precision API
description: POST /v3/lipsyncs — apply new audio to an existing video with frame-accurate lip-sync. Separate from video generation; works on any source video.
---

# HeyGen Lipsync Precision

Separate from video generation — takes an **existing video** and replaces its audio with frame-accurate lip-sync.
Use when you already have a rendered video and want to swap in a new voiceover.

## vs. audio_url in POST /v3/videos
| | `audio_url` in POST /v3/videos | POST /v3/lipsyncs |
|-|-------------------------------|-------------------|
| Input | Avatar look ID + audio URL | Any source video + new audio |
| Output | New avatar video with lip-sync | Same video, audio replaced |
| Best for | LensFlow pipeline (generate + lipsync in one step) | Re-dubbing existing videos |

## Create lipsync
```
POST /v3/lipsyncs
```
```json
{
  "video": { "type": "url", "url": "https://example.com/source.mp4" },
  "audio": { "type": "url", "url": "https://example.com/new-audio.mp3" },
  "mode": "precision"
}
```
Returns `{ "data": { "lipsync_id": "ls_abc123" } }`

## Poll status
```
GET /v3/lipsyncs/{lipsync_id}
```
Statuses: `pending` → `running` → `completed` (has `video_url`) / `failed` (has `failure_message`)

## Key parameters
| Param | Default | Description |
|-------|---------|-------------|
| `mode` | — | `"precision"` for avatar-inference lip-sync |
| `enable_caption` | false | Generate captions |
| `enable_dynamic_duration` | true | Output duration adjusts to match new audio length |
| `disable_music_track` | false | Strip background music from source |
| `enable_speech_enhancement` | false | Enhance speech quality |
| `start_time` / `end_time` | — | Partial lipsync (seconds) |
| `keep_the_same_format` | — | Preserve source resolution/bitrate |
| `callback_url` | — | Webhook on completion |

## Asset inputs — both `video` and `audio` accept:
- `{ "type": "url", "url": "https://..." }` — public HTTPS URL
- `{ "type": "asset_id", "asset_id": "..." }` — uploaded via POST /v3/assets

## Other endpoints
- `GET /v3/lipsyncs` — list with cursor pagination
- `PATCH /v3/lipsyncs/{id}` — update title
- `DELETE /v3/lipsyncs/{id}` — delete

## LensFlow use cases
- **Re-dub existing jobs** — swap ElevenLabs voiceover on a completed HeyGen video without re-rendering the avatar
- **Multi-language** — take a rendered presenter video and lipsync a translated audio track
- **Quality upgrade** — re-lipsync an old job with a newer ElevenLabs voice
