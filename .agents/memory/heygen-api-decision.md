---
name: HeyGen — Choosing the Right Video API
description: Side-by-side comparison of Video Agent, Direct Video, and Cinematic Avatar. LensFlow pipeline uses Direct Video.
---

# HeyGen — Choosing the Right API

| | Video Agent | Direct Video | Cinematic Avatar |
|-|-------------|--------------|-----------------|
| **Endpoint** | `POST /v3/video-agents` | `POST /v3/videos` | `POST /v3/videos` (`type: "cinematic_avatar"`) |
| **Input** | Natural language prompt | Structured JSON | Prompt + 1–3 avatar looks |
| **Script** | Agent writes it | You write it | None (motion-driven) |
| **Avatar** | Agent picks (or override) | You specify | You specify 1–3 looks |
| **Voice** | Agent picks (or override) | You specify | None |
| **Interactive** | ✅ chat mode | ❌ | ❌ |
| **Control** | Low | High | Medium |
| **Max resolution** | — | 4K | 1080p |
| **Clip length** | — | Any | 4–15 seconds |

## When to use each

**Video Agent** (`POST /v3/video-agents`)
- You want a video fast without managing avatars or scripts
- End users describe videos in natural language
- Use `mode: "chat"` for interactive storyboard review before rendering
- Trade-off: less control over exact composition

**Direct Video** (`POST /v3/videos`) ← **LensFlow uses this**
- Automated pipelines — personalized sales videos, daily reports
- Exact control over avatar, voice, and script
- Generating from data (CRM records, form submissions)
- Trade-off: you handle all creative decisions, IDs must be known upfront

**Cinematic Avatar** (`POST /v3/videos` with `type: "cinematic_avatar"`)
- Cinematic b-roll / motion shots — no talking head
- Up to 3 looks in one shot
- Steer style with reference videos/images
- Trade-off: no voice, 4–15 sec clips, max 1080p

## LensFlow pipeline mapping
- **Step 4 (presenter_video)** → Direct Video — we control avatar_id, voice_id, script ✅
- **Future: property B-roll** → Cinematic Avatar — prompt-driven walkthrough shots
- **Future: quick demo / lead gen** → Video Agent — low-friction "describe your video" flow

## Combining approaches
Use Video Agent to explore ideas → recreate with Direct Video for final production.
