# Lensflow Render Deployment Notes

Primary Render service:

- Service type: Web Service
- Blueprint file: `render.yaml`
- Git branch: `codex-backup-20260622`
- Health check: `/api/healthz`
- Runtime: Node 24 + pnpm 10.19.0

The Render build performs:

1. Install workspace dependencies with pnpm.
2. Build `@workspace/api-server`.
3. Build the marketing site with `BASE_PATH=/`.
4. Build the pipeline app with `BASE_PATH=/pipeline/`.

The Express server then serves:

- `/api`
- `/pipeline`
- `/`

Required before the service can fully work:

- `DATABASE_URL` from Render Postgres.
- Initial database schema push: `corepack pnpm@10.19.0 --filter @workspace/db run push`.
- Production provider secrets:
  - `ANTHROPIC_API_KEY`
  - `APIFY_API_TOKEN`
  - `ELEVENLABS_API_KEY`
  - `HEYGEN_API_KEY`
  - `DID_API_KEY`
  - `GEMINI_LENSFLOW_API_KEY` or `GEMINI_API_KEY`
  - `SHOTSTACK_PROD_API_KEY` or `SHOTSTACK_PRODUCTION_API_KEY`
  - `DOMAIN_CLIENT_ID`
  - `DOMAIN_CLIENT_SECRET`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

Render-specific changes already made:

- Stripe now accepts `STRIPE_SECRET_KEY` directly, with Replit connector fallback.
- Auth now accepts generic `OIDC_CLIENT_ID`, with `REPL_ID` fallback.
- Public callback/file URLs now use `PUBLIC_BASE_URL`, `APP_BASE_URL`, or `RENDER_EXTERNAL_URL`, with Replit domain fallback.

Known remaining production decision:

- Object storage still needs a non-Replit production backend before uploads and generated media are fully reliable on Render. The current object storage implementation was built around Replit's sidecar signer. Use Cloudflare R2/S3 or Google Cloud Storage with proper Render credentials, then wire `PUBLIC_OBJECT_SEARCH_PATHS` and `PRIVATE_OBJECT_DIR` accordingly.
- Auth needs a production OIDC provider before user login is production-ready. The app can accept `ISSUER_URL` + `OIDC_CLIENT_ID`, but those provider settings still need to be chosen and configured.

Do not point the custom domain until:

1. Render service is deployed.
2. Database schema exists.
3. `/api/healthz` returns OK.
4. Login/storage decisions are resolved or explicitly staged.
