---
name: ElevenLabs STT (speech-to-text)
description: How to call ElevenLabs transcription from the Express API and the browser, plus the cross-browser voice-input fallback strategy.
---

# ElevenLabs speech-to-text

`elevenlabs` SDK (v1.59.0) exposes `client.speechToText.convert({ file, model_id })`.
- Use `model_id: "scribe_v1"`.
- `file` accepts a Web `File`/`Blob`; construct one from a raw Buffer: `new File([new Uint8Array(buf)], "speech.webm", { type })`. Node 24 has global `File`.
- The route accepts the audio as a **raw body** (`express.raw({ type: ["audio/*","application/octet-stream"], limit: "25mb" })`), NOT multipart — `req.body` is the Buffer.
- Like the TTS route, STT is **not** in the OpenAPI spec; both are called via raw `fetch`, not generated hooks.

**Why:** Morgan voice input must work cross-browser. Web Speech API (`webkitSpeechRecognition`) only exists in Chromium. The fallback records with `MediaRecorder` and POSTs the blob to `/api/elevenlabs/stt`.

**How to apply (frontend):** prefer Web Speech API when present; else `MediaRecorder`. Always stop `getUserMedia` tracks on every failure path or the mic indicator stays on. Guard with `typeof MediaRecorder === "undefined"`.

**Cost note:** `/api/elevenlabs/stt` and `/api/elevenlabs/tts` are public + unauthenticated (paid). There is no rate limiting yet — consistent with existing TTS, but a known abuse surface if ever hardened.
