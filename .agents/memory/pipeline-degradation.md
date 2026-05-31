---
name: Pipeline graceful-degradation semantics
description: How runSimulation handles step failures and what job.status === "complete" does and does not guarantee
---

# Pipeline graceful-degradation semantics

`runSimulation()` in `artifacts/api-server/src/routes/jobs.ts` is intentionally fault-tolerant: each step wraps its real API call (Apify, Anthropic, ElevenLabs, HeyGen, Shotstack, Claude Vision) in try/catch, logs on failure, and **continues**. Steps are still marked `complete` and the job ends as `status: "complete"` even if individual steps produced no output.

**Why:** the product favours always delivering *something* (a script/partial result) over hard-failing the whole job when one upstream provider is down. Steps 04–05 began life as simulated placeholders, so the flow was built to tolerate missing outputs.

**How to apply:**
- Do NOT assume `job.status === "complete"` means every step succeeded or that a video exists. Check the specific artifact you need.
- The final video URL must be persisted to `jobsTable.videoUrl` at the end of the pipeline (not just on the pipeline step's `outputUrl`). Anything consuming the finished video (Output Video block, Send-to-CRM) reads `job.videoUrl`.
- If you ever want true hard-fail semantics, that's a deliberate behaviour change across the whole pipeline, not a per-step tweak.
