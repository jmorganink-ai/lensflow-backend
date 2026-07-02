---
name: Prod static asset routing & size limit
description: Why site media must stay small and how root-absolute asset paths resolve across the multi-artifact deploy
---

# Production static asset routing & size limit

## The 500-on-large-files rule
The deployed platform's static file handler returns **HTTP 500 for files larger than ~20–25 MB** (images and videos alike). Observed: 16.8 MB → 200, 32–46 MB → 500. This is the root cause of "black media tiles" reports — a too-large video/image 500s and the tile renders black.

**How to apply:** Keep every *referenced* media file well under 20 MB. Standard fix for videos: `ffmpeg -vf scale cap 1080, libx264 crf30 veryfast, -an, +faststart` (gets most reels to 0.4–2.1 MB). After any media change, scan both dists: `find artifacts/*/dist/public -type f -size +20M`.

## Cross-artifact path resolution (critical)
The marketing site (`lensflow-site`) is the **root artifact** (previewPath `/`). The pipeline app (`lensflow`) is served under `/pipeline/`.

A **root-absolute** asset URL (e.g. `/presenters/mia.mp4`, `/videos/sample-v1.mp4`, `/backgrounds/bg-reel-1.mp4`) in the browser always resolves against the origin root → it hits the **site's** `public/`, NOT the sub-app's own `public/`. The pipeline app deliberately relies on this: its `App.tsx`, `new-job.tsx`, and `dashboard.tsx` reference shared media root-absolute, so those files must exist (and be small) in **`lensflow-site/public/`**.

**Consequences:**
- The pipeline app's own `public/{videos,presenters,backgrounds}` are **dead weight** — never served at root — so they bloat the bundle without being reachable. Safe to delete the oversized ones.
- Assets that are *pipeline-specific* and don't exist on the site (e.g. the AI Photo Rescue `/enhancement/*.png` before/after images) MUST be referenced **base-path-aware** so they resolve under `/pipeline/`: `` `${import.meta.env.BASE_URL.replace(/\/$/, "")}/enhancement/x.png` `` → served from the pipeline dist.

## Build requirement
Both `lensflow-site` and `lensflow` vite configs **throw** if `PORT` and `BASE_PATH` are unset. Build manually with e.g. `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/lensflow-site build` and `PORT=5001 BASE_PATH=/pipeline/ pnpm --filter @workspace/lensflow build`.

## Known broken-source stubs (poster fallback acceptable)
`sophie.mp4` / `sophie-presenter.mp4` have no valid source (4 KB stubs); cards degrade to `sophie-poster.jpg`. Acceptable interim.
