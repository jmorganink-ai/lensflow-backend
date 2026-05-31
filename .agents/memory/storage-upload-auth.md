---
name: Storage upload endpoint auth
description: The object-storage presigned-upload endpoint was scaffolded without auth; it must be gated.
---

# Storage upload presigned-URL endpoint must require auth

`POST /api/storage/uploads/request-url` (api-server `routes/storage.ts`) was
originally scaffolded with **no** `req.isAuthenticated()` check. Any anonymous
caller could mint presigned upload URLs and push arbitrary files into object
storage (cost/abuse risk). It is now gated behind auth.

**Why:** Both the photo-upload and self-recorded-video flows sit behind the
mobile AuthGate, so there is no legitimate unauthenticated upload. An open
presign endpoint is a storage-abuse vector.

**How to apply:** Any new endpoint that issues presigned upload URLs or accepts
client-supplied file references must check `req.isAuthenticated()` first. When a
client passes back a resulting URL to persist (e.g. `videoUrl` on
`/jobs/self-recorded`), validate it parses as a URL and its path contains
`/api/storage/` so external/arbitrary URLs can't be stored.
