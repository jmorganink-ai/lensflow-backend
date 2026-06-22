# Lensflow Backup Notes

Primary backup:

- GitHub repo: `https://github.com/jmorganink-ai/lensflow-backend.git`
- Backup branch: `codex-backup-20260622`
- Local working copy: `C:\Users\User\Projects\lensflow\lensflow-codex`

Additional recovery source:

- Replit export archive: `E:\Android\ReplitExport-jmorganink (2).tar.gz`

Intentionally excluded from GitHub:

- `.env` files and secret-like key files
- `node_modules`
- `dist` build output
- local smoke-test logs
- local `.agents` and `.canvas` runtime/context folders

Production still needs secrets/env vars to be re-added on the host, especially:

- `DATABASE_URL`
- `ANTHROPIC_API_KEY`
- `APIFY_API_TOKEN`
- `ELEVENLABS_API_KEY`
- `HEYGEN_API_KEY`
- `OPENAI_API_KEY`
- `SHOTSTACK_API_KEY` or production Shotstack keys
- `DID_API_KEY`
- `GEMINI_API_KEY` or `GEMINI_LENSFLOW_API_KEY`
- `DOMAIN_CLIENT_ID`
- `DOMAIN_CLIENT_SECRET`
- Stripe/Replit connector vars or replacement Stripe secrets

Restore outline:

```powershell
git clone -b codex-backup-20260622 https://github.com/jmorganink-ai/lensflow-backend.git lensflow-codex
cd lensflow-codex
corepack pnpm@10.19.0 install --no-frozen-lockfile --ignore-scripts
```

Build checks used:

```powershell
.\node_modules\.bin\tsc.cmd --build --pretty false
corepack pnpm@10.19.0 --filter @workspace/api-server run build
$env:PORT='3000'; $env:BASE_PATH='/'; corepack pnpm@10.19.0 --filter @workspace/lensflow-site run build
$env:PORT='3001'; $env:BASE_PATH='/pipeline/'; corepack pnpm@10.19.0 --filter @workspace/lensflow run build
```
