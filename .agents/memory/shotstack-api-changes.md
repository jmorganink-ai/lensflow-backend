---
name: Shotstack API 2025 breaking changes
description: Breaking changes in Shotstack v1 API that affect shotstack.ts — asset types, URLs, transitions
---

## Rules

**`colour` asset type is removed.** Use `shape` instead:
```json
{ "type": "shape", "shape": "rectangle", "fill": { "color": "#0a0f1e" } }
```
Do NOT include `width` or `height` — the shape fills clip bounds automatically.

**Correct base URLs (code appends `/render` and `/renders/{id}` to these):**
- Production: `https://api.shotstack.io/edit/v1` → full render URL: `/edit/v1/render`
- Sandbox: `https://api.shotstack.io/edit/stage` → full render URL: `/edit/stage/render`
Old paths (`/v1`, `/stage/v1`, `/stage/v1/render`) all return 404. Using the sandbox key against the production `/edit/v1` URL returns 403 "Sandbox key cannot use Production API".

**`fadeOut` / `fadeIn` transition names are gone.** Use `"fade"` (or `"fadeSlow"`, `"fadeFast"`) for both in/out transitions.

**API keys may have leading whitespace** from the Replit secrets UI. Always `.trim()` before use — the `getShotstackConfig()` function already does this.

**HeyGen CDN video URLs expire.** `files.heygen.ai/asset/...` URLs return 403 after some time. Shotstack fetches assets at render time, so expired HeyGen URLs cause silent render failures (Shotstack status → "failed", response `{}`). Always pass a freshly-generated URL — never reuse saved HeyGen URLs from hours earlier.

**Why:** Shotstack migrated their API in 2025. The old v1 stage endpoint and `colour` asset type were removed in the new schema.

**How to apply:** Any time you modify `shotstack.ts` or add new Shotstack clip types, verify the asset type is in: `video | image | text | rich-text | audio | luma | caption | html | html5 | title | shape | svg | rich-caption`.
