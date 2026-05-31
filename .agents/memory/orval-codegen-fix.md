---
name: Orval codegen collision fix
description: How the duplicate-export TS2308 error was fixed in the api-zod lib and how to regenerate safely.
---

## The rule
Never re-enable the `schemas` option in `lib/api-spec/orval.config.ts`. It generates TypeScript interfaces in `generated/types/` **and** Zod schemas in `generated/api.ts`, causing a duplicate export (TS2308) when orval's barrel `index.ts` re-exports both.

## Fix applied
1. Removed `schemas: { path: "generated/types", type: "typescript" }` from the `zod` output block in `orval.config.ts`.
2. Added `lib/api-spec/patch-zod-index.mjs` — a post-codegen script that strips the stale `export * from './generated/types'` line orval writes to `lib/api-zod/src/index.ts`.
3. The codegen npm script in `lib/api-spec/package.json` runs: `orval --config … && node ./patch-zod-index.mjs && pnpm -w run typecheck:libs`.
4. Types that were previously generated (e.g. `AuthUser`) are now hand-written in `lib/api-zod/src/types.ts` and re-exported from `lib/api-zod/src/index.ts`.

**Why:** Orval's `split` mode with both `schemas` and `client: "zod"` outputs a name collision. Removing `schemas` eliminates the TypeScript interface files; Zod schemas (in `api.ts`) are the source of truth and types can be derived via `z.infer<>`.

**How to apply:** After any change to `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen`. If a new component type needs a TypeScript interface (not just Zod), add it manually to `lib/api-zod/src/types.ts`.
