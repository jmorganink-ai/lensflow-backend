# LensFlow Dashboard Merge Brief for Replit

## Mission
Merge the Codex visual direction with the safer React/dashboard approach.

Do **not** rebuild the app.
Do **not** touch the pipeline engine.
Do **not** touch API hooks, database logic, job creation, rendering, auth, billing, or backend code.

Only upgrade the **visual dashboard experience** inside the existing React dashboard.

---

## Use these as references

### Design reference
Use `lensflow-cosmic-template-pack.html` as the visual inspiration:
- luxury real estate SaaS feel
- campaign-first dashboard
- premium gold/black styling
- property campaign cards
- presenter section
- marketing value section
- market intelligence lower on page
- mobile-friendly layout

### Safety reference
Use the existing `dashboard.tsx` structure as the source of truth:
- keep `useGetJobStats()`
- keep `useGetMarketBrief()`
- keep `useRefreshMarketBrief()`
- keep `MarketBriefCard`
- keep `SampleVideos`
- keep `RoadmapCard`
- keep `JobStatusBadge`
- keep recent job links and job status logic
- keep all existing routes working

---

## Required dashboard changes

### 1. Make campaign creation the hero
Replace the top dashboard feeling from admin/reporting to:

**Create Luxury Property Campaigns in Minutes**

Subtitle:
**Turn listings, photos and videos into AI-powered marketing campaigns, presenter reels, property walkthroughs and social media content designed to help agents win more listings.**

Add a large CTA:
**Generate Property Campaign**

Link it to the existing route:
`/jobs/new`

Add four quick launch cards:
- Property URL → `/jobs/new`
- Upload Photos → `/jobs/new`
- Upload Video → `/jobs/new`
- Teleprompter → `/teleprompter`

---

### 2. Update the stats labels only
Keep the existing stats data sources, but change the customer-facing labels:

- `Videos Completed` → `Campaigns Created`
- `Scripts Generated` → `Properties Processed`
- `Hours Saved` → `Marketing Hours Saved`
- `Failed` can remain in the safer version OR become `Estimated Reach` only if it does not break data logic

For safest implementation, keep the fourth stat connected to `stats.failed`.
For premium implementation, create an estimated reach display from completed campaigns without changing backend.

---

### 3. Rename Recent Jobs
Change heading:
`Recent Jobs`

to:
`Recent Campaigns`

Change empty state:
`No videos yet`

to:
`No campaigns yet`

Change button:
`Generate Your First Video`

to:
`Generate Your First Campaign`

Do not change the job links or job status logic.

---

### 4. Move Market Brief lower
Do not delete it.

Move:
`<MarketBriefCard />`

below:
`<SampleVideos />`

Rename the card title:
`AU Market Brief`

to:
`AU Market Intelligence`

Keep the hook and refresh logic untouched.

---

### 5. Add Presenter Studio card
Add a visual card near the top of the dashboard:

**AI Presenter Studio Ready**

Show all four presenters:
- Mia — Luxury listings
- Oliver — Corporate premium
- Liam — Confident sales
- Sophie — Lifestyle reels

This is visual only for now.
Do not connect it to the pipeline unless existing presenter logic already exists.

---

### 6. Add Marketing Value Generated card
Add a visual value card:

- Script Creation: $50
- Voiceover: $75
- Video Production: $250
- Social Package: $150
- Estimated Value Today: $525

If campaigns exist, optionally calculate:
`completed campaigns * 525`

This is visual positioning only.
Do not change billing logic.

---

## Do not touch

Do not modify:
- scraping logic
- script generation
- voice generation
- HeyGen
- Shotstack
- OpenAI
- ElevenLabs
- database schema
- API client hooks
- authentication
- Stripe
- `/jobs/new`
- job detail page
- real 5-stage pipeline timeline
- final video render logic

---

## Important bug to fix separately, not part of dashboard cosmetic work

The repeated same-video issue is likely because the render pipeline is returning IDs instead of completed MP4 URLs.

Check:
- `triggerPresenterVideo()`
- `renderFinalReel()`
- `finalVideoUrl`
- job completion handler

Likely issue:
- HeyGen returns a `video_id`, not a playable MP4 URL
- Shotstack returns a render ID, not the finished MP4 URL
- app falls back to a demo/sample video because no real MP4 URL is stored

This should be fixed separately from the dashboard cosmetic work.

---

## Desired outcome

The dashboard should feel like:

**Luxury Real Estate Marketing Operating System**

Not:

**Internal admin panel**

The first thing an agent sees should be:
**Generate Property Campaign**

Not market stats or technical job logs.
