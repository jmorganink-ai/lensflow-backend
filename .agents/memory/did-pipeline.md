---
name: D-ID pipeline integration
description: D-ID is now primary presenter video provider; key gotcha is pre-signed S3 URL must be mirrored to object storage before passing to Shotstack
---

# D-ID Pipeline Integration

## Rule
D-ID returns pre-signed S3 URLs. Shotstack cannot access these — they get stuck in "fetching" forever. Always mirror the D-ID video to our object storage and pass the public `/api/storage/` URL to Shotstack.

**Why:** Shotstack fetches source assets from a remote server. Pre-signed S3 URLs from D-ID have access restrictions that block Shotstack's fetch, causing the render to hang indefinitely in "fetching" status.

**How to apply:** In `presenter_video` step — after `generatePresenterVideoDID()` resolves, fetch the returned URL, buffer it, and call `storageForDID.uploadPublicBuffer(buffer, "presenter-videos/${jobId}.mp4", "video/mp4")`. Use the returned storage URL as `presenterVideoUrl`.

## Provider Order
- **Primary**: D-ID (`generatePresenterVideoDID`) 
- **Fallback**: HeyGen (`generatePresenterVideo`)

## D-ID Integration Details
- Auth: HTTP Basic, API key as username, empty password
- Create: `POST https://api.d-id.com/talks`
- Lipsync mode: pass `{ type: "audio", audio_url: voiceoverPublicUrl }` as script block — uses our ElevenLabs audio instead of D-ID's own TTS
- Poll: `GET /talks/{id}` every 4s; statuses: started → done/error
- Presenter images per name (Mia/Oliver/Sophie) configurable via `DID_IMAGE_*` env vars; fallback to HeyGen still frame URL

## HeyGen Credit Issue
HeyGen 150 "creator credits" ≠ API credits. `/v3/videos` requires "api credits" on a separate API plan. The 282 "Avatar IV" credits shown in Usage & History ARE the right type but HeyGen still blocked — moved to D-ID as primary.
