---
name: HeyGen group IDs and default look IDs
description: Confirmed presenter group IDs and default look IDs for HeyGen video generation. Group IDs ≠ look IDs — never use a group ID as AVATAR_*.
---

# HeyGen Presenter Groups & Default Looks

## Critical rule
`AVATAR_*` constants and `HEYGEN_AVATAR_*` env vars must be **look IDs**, not group IDs.
Group IDs passed to the video generation API return "avatar look not found". Verified 2026-06-08.

## Mia
- **Group**: `91141b5f57114fccb565ab32ca058a1a` (approved group — "Mia avatar Twins's Looks")
- **Default look**: `bbed326b42fc45778ac396cdc194a0c6` — MIA PRESENTER
- Confirmed looks:
  - `bbed326b42fc45778ac396cdc194a0c6` — MIA PRESENTER (default)
  - `9868f07cb9804006adf1bb4cd7b9dbd1` — Mia in grey jumper
  - `46214c5723134232b60e6783b20509f2` — Mia professional white blouse
  - `63356b9323164c17add48dee43f18532` — Podcaster in a cozy studio
- Older group `1602766f0e7344199b7b1a8bcf7b7855` — NOT used (generic looks, not approved)
- Second smaller group `91141b5f` was also previously set as HEYGEN_AVATAR_MIA (group ID — wrong); fixed 2026-06-08

## Oliver
- **Group**: `b88ace7a30a34a76ae92a16dd84c18af`
- **Default look**: `072d3a64f1884dedaaca04d6ac6e7be7` — Oliver in blue suite
- Looks were originally named "James in..." in HeyGen; renamed in dashboard + server-side `replace(/^James/i, "Oliver")` safety net

## Sophie
- **Group**: `267832a040cd46998928c37498777215`
- **Default look**: `b1a01a6df4e141d7ab71999b95403455` — The Elegant, Smiling Real Estate Director

## James
- **Group**: `9f2454deef0840008f9d6f6753c6de7b`
- **Default look**: `426df1e119054477a2188b41dbca60cf` — James Presenter in blue suit

## How to apply
- Outfit picker fetches all looks dynamically via `/v2/avatar_group/{groupId}/avatars` — no hardcoding needed
- Only the default look ID matters in code (used when user picks no outfit)
- If a default renders with "avatar look not found", the ID is a group ID not a look ID — fetch first look from group and use that instead
