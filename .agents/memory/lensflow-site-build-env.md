---
name: lensflow-site build env
description: lensflow-site vite.config throws without PORT even for production builds
---
The lensflow-site (and sibling web artifacts) `vite.config.ts` reads `process.env.PORT`
at config-load time and throws "PORT environment variable is required" if missing —
this fires for `vite build`, not just dev.

**Why:** The config derives server/base settings from PORT/BASE_PATH; a plain
`pnpm --filter @workspace/lensflow-site run build` fails before transforming anything.

**How to apply:** Always build the site with both vars, e.g.
`PORT=5000 BASE_PATH=/ pnpm --filter @workspace/lensflow-site run build`.
The dev workflow already injects these; only manual CLI builds need them.
