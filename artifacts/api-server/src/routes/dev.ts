import { Router } from "express";
import { db, jobsTable, pipelineStepsTable } from "@workspace/db";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { runSimulation } from "./jobs";
import { composePresenterVideoPremiumLuxuryV1 } from "../lib/shotstack";

const router = Router();

const PRESENTER_STEPS = [
  { name: "scrape_listing",  label: "Scrape Listing",       order: 1 },
  { name: "enhance_photos",  label: "AI Photo Glow-up",     order: 2 },
  { name: "generate_script", label: "Generate Script",      order: 3 },
  { name: "create_voiceover",label: "Generate Voiceover",   order: 4 },
  { name: "presenter_video", label: "Generate Presenter",   order: 5 },
  { name: "compose_video",   label: "Final Video Render",   order: 6 },
];

const VOICE_PHOTOS_STEPS = [
  { name: "scrape_listing",  label: "Scrape Listing",       order: 1 },
  { name: "enhance_photos",  label: "AI Photo Glow-up",     order: 2 },
  { name: "generate_script", label: "Generate Script",      order: 3 },
  { name: "create_voiceover",label: "Create Voiceover",     order: 4 },
  { name: "compose_video",   label: "Compose Video",        order: 5 },
];

router.post("/dev/run-test", async (req, res): Promise<void> => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const id = randomUUID();
  const listingUrl = (req.body as Record<string, string>).listingUrl
    ?? "https://www.realestate.com.au/property-house-vic-richmond-141826448";
  const voiceName = (req.body as Record<string, string>).voiceName ?? "mia";

  const PRESENTER_VOICE_IDS: Record<string, string> = {
    mia:    "x3PfG9wL6FOEApZ1VJ9H",
    oliver: "jfIS2w2yJi0grJZPyEsk",
    sophie: "69h9o7wh5u0isWHzdogD",
    james:  "yXFr3XVHzrViCIHi1yoc",
  };
  const voiceId = (req.body as Record<string, string>).voiceId
    ?? PRESENTER_VOICE_IDS[voiceName.toLowerCase()]
    ?? "x3PfG9wL6FOEApZ1VJ9H";

  await db.insert(jobsTable).values({
    id,
    userId: null,
    listingUrl,
    listingTitle: "Test Property — Richmond VIC",
    propertyAddress: "24 Church Street, Richmond VIC 3121",
    propertyImages: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1280",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1280",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1280",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1280",
    ],
    voiceName,
    voiceId,
    status: "pending",
    inputMode: "url",
    outputType: (req.body as Record<string, string>).outputType ?? "presenter",
    musicTrack: "uplifting",
  });

  const outputType = (req.body as Record<string, string>).outputType ?? "presenter";
  const steps = outputType === "voice_photos" ? VOICE_PHOTOS_STEPS : PRESENTER_STEPS;

  for (const step of steps) {
    await db.insert(pipelineStepsTable).values({
      id: randomUUID(),
      jobId: id,
      name: step.name,
      label: step.label,
      order: step.order,
      status: "pending",
    });
  }

  runSimulation(id).catch((err) => console.error("runSimulation error:", err));

  res.json({ jobId: id, message: "Pipeline started — check GET /api/dev/job-status/:id" });
});

/**
 * POST /api/dev/test-premium-template
 * Direct Shotstack-only test for premium_luxury_v1 — no full pipeline needed.
 */
router.post("/dev/test-premium-template", async (req, res): Promise<void> => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const body = req.body as Record<string, unknown>;

  const presenterVideoUrl = (body.presenterVideoUrl as string | undefined)
    ?? "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/skater.hd.mp4";

  const propertyTitle = (body.propertyTitle as string | undefined)
    ?? "24 Church Street, Richmond VIC 3121";

  const listingUrl = (body.listingUrl as string | undefined)
    ?? "https://www.realestate.com.au/property-house-vic-richmond-141826448";

  const propertyImages = (body.propertyImages as string[] | undefined) ?? [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1280",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1280",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1280",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1280",
  ];

  const highlights = (body.highlights as string[] | undefined) ?? [
    "Stunning period features throughout",
    "Gourmet kitchen with stone benchtops",
    "Private north-facing garden & entertaining",
  ];

  const testMode = (body.testMode as boolean | undefined) ?? false;
  const voiceName = (body.voiceName as string | undefined) ?? "mia";
  const musicTrack = (body.musicTrack as string | undefined) ?? "luxury";
  const musicUrl   = (body.musicUrl   as string | undefined) ?? null;

  try {
    const result = await composePresenterVideoPremiumLuxuryV1(
      presenterVideoUrl,
      propertyTitle,
      listingUrl,
      propertyImages,
      musicTrack,
      voiceName,
      testMode,
      highlights,
      musicUrl,
    );
    res.json({ success: true, renderId: result.renderId, videoUrl: result.videoUrl, template: "premium_luxury_v1" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * GET /api/dev/job-status/:id
 * Full job state for verification: steps, enhanced images, music metadata, video URL.
 */
router.get("/dev/job-status/:id", async (req, res): Promise<void> => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const jobId = req.params.id;
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const steps = await db
    .select()
    .from(pipelineStepsTable)
    .where(eq(pipelineStepsTable.jobId, jobId))
    .orderBy(pipelineStepsTable.order);

  res.json({
    id:              job.id,
    status:          job.status,
    videoUrl:        job.videoUrl,
    listingTitle:    job.listingTitle,
    propertyImages:  job.propertyImages,
    enhancedImages:  job.enhancedImages,
    enhancedCount:   (job.enhancedImages ?? []).filter((u, i) => u !== (job.propertyImages ?? [])[i]).length,
    musicMood:       job.musicMood,
    musicTrackName:  job.musicTrackName,
    musicTrackUrl:   job.musicTrackUrl,
    musicProvider:   job.musicProvider,
    steps: steps.map((s) => ({
      name:       s.name,
      status:     s.status,
      outputUrl:  s.outputUrl,
      outputData: s.outputData?.slice(0, 300),
    })),
  });
});

router.get("/dev/test-video/:name", (req, res): void => {
  const allowed = ["mia", "oliver"];
  const name = req.params.name.toLowerCase();
  if (!allowed.includes(name)) { res.status(404).json({ error: "not found" }); return; }
  const file = `/tmp/video_${name}.mp4`;
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `inline; filename="${name}-test.mp4"`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("fs").createReadStream(file).pipe(res);
});

export default router;
