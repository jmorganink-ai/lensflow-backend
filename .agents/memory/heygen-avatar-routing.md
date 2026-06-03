---
name: HeyGen avatar routing
description: Correct avatar IDs for each presenter; how they're resolved; env var overrides.
---

Each presenter maps to a HeyGen avatar via `heygen.ts`. Fallback IDs (used when env vars aren't set):

- **Mia** → `Abigail_expressive_2024112501` (note: `501` not `601` — easy typo)
- **Sophie** → `Anna_public_3_20240108`
- **Oliver** → `Bryan_Suit_Front_public` (`Bryan_FrontFacing_public` no longer exists)
- **James** → `d6009ad7f6234aa1b98565649f5ffd55` (the account's John Morgan digital-twin avatar)

Override any of these via env vars: `HEYGEN_AVATAR_MIA`, `HEYGEN_AVATAR_SOPHIE`, `HEYGEN_AVATAR_OLIVER`, `HEYGEN_AVATAR_JAMES`, or the catch-alls `HEYGEN_AVATAR_MALE` / `HEYGEN_AVATAR_FEMALE`.

**Why:** `Bryan_FrontFacing_public` was removed from HeyGen's public library; `Abigail_expressive_2024112601` had a digit typo. Both caused silent presenter_video step failures — job showed "complete" but `hasVideo=false`.

**How to apply:** If HeyGen fails with "avatar look not found", run `GET /api/heygen/avatars` to list valid IDs for the account, then update the fallback constants in `artifacts/api-server/src/lib/heygen.ts` and rebuild.
