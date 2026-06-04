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

**Stage URL is gone.** Both sandbox and production keys now use `https://api.shotstack.io/v1`. The old `https://api.shotstack.io/stage/v1` path returns 404. The `getShotstackConfig()` function in `shotstack.ts` now uses `/v1` for both.

**`fadeOut` / `fadeIn` transition names are gone.** Use `"fade"` (or `"fadeSlow"`, `"fadeFast"`) for both in/out transitions.

**API keys may have leading whitespace** from the Replit secrets UI. Always `.trim()` before use — the `getShotstackConfig()` function already does this.

**Why:** Shotstack migrated their API in 2025. The old v1 stage endpoint and `colour` asset type were removed in the new schema.

**How to apply:** Any time you modify `shotstack.ts` or add new Shotstack clip types, verify the asset type is in: `video | image | text | rich-text | audio | luma | caption | html | html5 | title | shape | svg | rich-caption`.
