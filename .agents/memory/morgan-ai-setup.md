---
name: Morgan AI setup
description: How the Anthropic/Morgan AI chat is wired — direct SDK, not integrations proxy
---

The `lib/integrations-anthropic-ai` client.ts checks for `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` and will throw if absent. The user has their own key as `ANTHROPIC_API_KEY` (not the integrations vars).

**Rule:** Instantiate Anthropic directly in the route — do NOT import from `@workspace/integrations-anthropic-ai/src/client`.

```ts
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

**Model:** `claude-sonnet-4-6` (confirmed working)

**SSE streaming pattern:** Use `anthropic.messages.stream({...})` with `for await (const event of stream)`, check `event.type === "content_block_delta" && event.delta.type === "text_delta"`, write `data: JSON.stringify({ content })\n\n` chunks, end with `data: JSON.stringify({ done: true })\n\n`.

**Route location:** `artifacts/api-server/src/routes/anthropic/morgan.ts`, mounted via `artifacts/api-server/src/routes/index.ts`.
**Widget location:** `artifacts/lensflow-site/src/components/MorganChat.tsx`, mounted globally in App.tsx.
