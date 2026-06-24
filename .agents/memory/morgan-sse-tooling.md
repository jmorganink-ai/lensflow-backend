---
name: Morgan SSE tool streaming
description: How Morgan's chat SSE handler must parse tool calls and chain tools; the multi-tool crash and its fix.
---

# Morgan SSE tool streaming (anthropic/morgan.ts POST messages handler)

## Rule: never hand-parse tool-call JSON from the stream
Do NOT accumulate `input_json_delta` fragments and `JSON.parse` them yourself. When
Claude requests 2+ tools in one turn the concatenated buffer is not valid single
JSON, so parsing throws (e.g. "Unexpected non-whitespace character after JSON at
position N") and the SSE stream crashes ("Stream interrupted").

**How to apply:** stream only text deltas to the client during a round, then call
`await stream.finalMessage()` and read the parsed `Anthropic.ToolUseBlock[]`
(`content.filter(b => b.type === "tool_use")`). The SDK assembles tool inputs
correctly regardless of how many tools were requested.

## Rule: handler is a bounded multi-round agentic loop
The handler loops up to `MAX_TOOL_ROUNDS` (currently 4). Each round: stream text →
finalMessage → if `stop_reason === "tool_use"`, execute EVERY block via
`executeMorganTool(name, input, log)`, push `{role:"assistant", content: msg.content}`
then `{role:"user", content: toolResultBlocks}` (each `tool_result` paired by
`tool_use_id: block.id`), repeat. Break early when stop_reason !== "tool_use".
The FINAL round runs with tools disabled so Claude is forced to emit text.

**Why:** a single-round handler made Morgan announce "let me try recent sales
instead" and then dead-end, because the follow-up call had no tools to chain with.
The loop lets Morgan chain (suburb stats → recent sales) and the tool-less final
round guarantees a text answer and prevents unbounded agentic looping.

## Display/persistence parity
`assembledText` accumulates every streamed text delta PLUS the manually-streamed
status indicators, and is what gets saved as the assistant message — so chat
history matches what the user saw (hidden tool payloads/results are excluded).

## Known gap (pre-existing, not yet fixed)
Domain helper fetches in `lib/domain.ts` and the Anthropic calls have no
timeout/AbortSignal. A hung upstream call can hold the SSE open indefinitely and
skip both `done:true` and message persistence. `executeMorganTool` catches thrown
errors (incl. SANDBOX_ONLY) but not stalled promises. If hardening: wrap tool +
model calls in a timeout that resolves to `{error: ...}` so the stream can finish.
