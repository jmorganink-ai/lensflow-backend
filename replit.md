# LensFlow AI

Full-stack real estate video pipeline app + marketing site. Real estate agencies paste a listing URL and LensFlow automatically writes a Claude AI script, synthesises an ElevenLabs voiceover, and renders a professional AI presenter video — in one click.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, proxied via `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Auth: Replit OIDC + session-based (`SESSION_SECRET` env)
- AI: Anthropic Claude (`claude-sonnet-4-5`) for script generation
- Voice: ElevenLabs voices (Mia, Oliver, Sophie)
- CRM: HubSpot connector (auto-syncs contacts on login)

## Where things live

- `artifacts/lensflow/` — pipeline app (React+Vite, serves at `/pipeline/`)
- `artifacts/lensflow-site/` — marketing site (React+Vite, serves at `/`)
- `artifacts/api-server/` — Express 5 API (serves at `/api`)
- `lib/db/` — Drizzle schema + migrations
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth
- `lib/api-client-react/` — generated React Query hooks
- `lib/api-zod/` — generated Zod schemas

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks + Zod validation on both client and server
- Pipeline simulation: all 5 steps run server-side; steps 01–03 are live (URL parse, Claude AI, ElevenLabs), steps 04–05 are simulated placeholders
- URL metadata extraction: `parse-listing-url.ts` parses suburb/state/type/beds from listing URL path — passed as context to Claude for property-specific scripts
- HubSpot contact sync: fire-and-forget in `upsertUser` — never blocks login, logs warn on failure
- Job ownership: all job queries filter by `req.user.id`; unauthenticated users can't see any jobs

## Product

- **Marketing site** (`/`): hero, presenters (Mia, Oliver, Sophie), pricing (Starter $79, Elite $199, Concierge $399), comparison table, FAQs, Morgan AI chat widget, lead capture
- **Pipeline app** (`/pipeline/`): personalized dashboard with stats (Videos Completed, Scripts Generated, Hours Saved, Failed), My Videos list, New Job form with live URL platform detection and presenter picker, Job Detail with 5-stage pipeline timeline, extracted metadata display, AI script panel (copy + download), voiceover player, Share button, Re-run + New Listing CTAs, Webhooks page, Settings page with API key display
- **Morgan AI**: floating chat widget powered by Claude — context-aware for both marketing site visitors and pipeline users; captures HubSpot leads

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Never call `pnpm dev` at workspace root — run via workflow restart
- `pipelineStepsTable` has `outputData text` column (added manually, not from original scaffold)
- `generate_script` step stores the raw script in `outputData`; downstream `create_voiceover` uses it
- `generatedScript` local variable carries script across steps in `runSimulation()` without DB re-fetch
- `@assets` alias resolves to `/attached_assets/` at repo root
- HubSpot connector ID: `conn_hubspot_01KSYB2VWDD2DRFF5DDN92TJ1X`
- ElevenLabs voices: Mia=`x3PfG9wL6FOEApZ1VJ9H`, Oliver=`yXFr3XVHzrViCIHi1yoc`, Sophie=`69h9o7wh5u0isWHzdogD`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
