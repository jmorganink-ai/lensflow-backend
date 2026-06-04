---
name: Domain API setup
description: Domain.com.au API environment detection, correct endpoint paths, and sandbox vs production behaviour
---

## Auto-detection pattern
`domain.ts` auto-detects sandbox vs production on first call:
- Tries `/v1/` first
- If 403 response body contains "Sandbox" → switches to `/sandbox/v1/` permanently (cached in `isSandbox`)
- Logs which environment was detected
- Some endpoints (suburb stats, sales results) are production-only even in sandbox — throws `SANDBOX_ONLY:` prefix so Morgan can give a helpful message

## Base URLs
- Production: `https://api.domain.com.au/v1`
- Sandbox: `https://api.domain.com.au/sandbox/v1`
- Auth: `https://auth.domain.com.au/v1/connect/token` (same for both)

## Domain developer portal
- Two projects: "lensflow" (sandbox, prj_01bc493cc4807c8fbfbdd176cc067c49, has Properties & Locations sandbox → working), "LENSFLOW - PRODUCTION" (has Listings Management Sandbox added — wrong package, doesn't give listing reads)
- **Correct package needed**: "Properties & Locations" (gives api_listings_read, api_suburbperformance_read etc.)
- "Listings Management" is for agents posting listings — NOT for reading listing data
- Production approval pending — when approved, update DOMAIN_CLIENT_ID + DOMAIN_CLIENT_SECRET in Replit secrets and restart; code handles the rest automatically

## Scopes confirmed working (sandbox)
- api_listings_read ✅
- api_properties_read ✅ (token OK, endpoint returns 403 "not permitted" in sandbox)
- api_suburbperformance_read ✅ (token OK, endpoint 404 — URL format unknown, production-only)
- api_salesresults_read ✅ (token OK, production-only endpoint)
- api_addresslocators_read ✅ (token OK, URL: /v1/addressLocators?searchLevel=Suburb&suburb=X&state=Y)
- api_demographics_read ✅ (token OK)
- api_enquiries_read ✅ (token OK)
- api_locations_read ✅ (token OK)
- api_agencies_read ✅ (token OK)

## Subnet performance URL — UNKNOWN
All attempted URL formats for suburb performance return 404 in both sandbox and prod. Domain docs ref: `suburbperformance_get_bynamedsuburb`. Need to find correct URL format when production access is live.

**Why:** The code is fully wired and waits for the right URL — findable by testing against production once credentials upgrade.
