import { Router, type IRouter } from "express";
import { eq, desc, count, and } from "drizzle-orm";
import { db, jobsTable, pipelineStepsTable } from "@workspace/db";
import {
  CreateJobBody,
  GetJobParams,
  DeleteJobParams,
  SendJobToCrmBody,
  GenerateScriptBody,
  CreateSelfRecordedJobBody,
} from "@workspace/api-zod";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger";
import { generateVoiceover } from "./elevenlabs";
import { generateListingScript, type ListingContext } from "../lib/generate-script";
import { parseListingUrl } from "../lib/parse-listing-url";
import { generatePresenterVideo } from "../lib/heygen";
import { composePresenterVideo } from "../lib/shotstack";
import { scrapeListing } from "../lib/apify";
import { analysePropertyPhotos } from "../lib/analyse-photos";
import { enhancePropertyPhotos } from "../lib/enhance-photos";

const router: IRouter = Router();

const connectors = new ReplitConnectors();

const PIPELINE_STEPS_URL = [
  { name: "scrape_listing", label: "Scrape Listing", order: 1 },
  { name: "generate_script", label: "Generate Script", order: 2 },
  { name: "create_voiceover", label: "Create Voiceover", order: 3 },
  { name: "presenter_video", label: "Presenter Video", order: 4 },
  { name: "compose_video", label: "Compose Video", order: 5 },
];

const PIPELINE_STEPS_PHOTOS = [
  { name: "enhance_photos", label: "AI Photo Glow-up", order: 1 },
  { name: "analyse_photos", label: "Analyse Photos", order: 2 },
  { name: "generate_script", label: "Generate Script", order: 3 },
  { name: "create_voiceover", label: "Create Voiceover", order: 4 },
  { name: "presenter_video", label: "Presenter Video", order: 5 },
  { name: "compose_video", label: "Compose Video", order: 6 },
];

// Track in-progress simulations to prevent double-starts
const activeSimulations = new Set<string>();

// Step durations in ms — varied to feel realistic
const STEP_DURATIONS = [2200, 3100, 0, 3600, 2500]; // 0 = real ElevenLabs call

// Sample real estate script for voiceover (used when no real script yet)
function buildVoiceoverScript(listingUrl: string): string {
  try {
    const url = new URL(listingUrl);
    const domain = url.hostname.replace("www.", "");
    return `Welcome to this stunning property, listed exclusively on ${domain}. ` +
      `This exceptional home offers everything today's discerning buyer is looking for — ` +
      `spacious living areas, premium finishes, and an enviable location. ` +
      `From the moment you arrive, you'll appreciate the quality and attention to detail throughout. ` +
      `Whether you're entertaining guests in the open-plan living space or enjoying the tranquility of the outdoor areas, ` +
      `this property truly has it all. ` +
      `Don't miss this rare opportunity — contact us today to arrange your private inspection.`;
  } catch {
    return `Welcome to this exceptional property. ` +
      `This stunning home offers premium finishes, spacious living areas, and an unbeatable location. ` +
      `Featuring open-plan living, beautifully appointed bedrooms, and impressive outdoor entertaining. ` +
      `This is a rare opportunity you don't want to miss. ` +
      `Contact us today to arrange your private inspection.`;
  }
}

async function runSimulation(jobId: string): Promise<void> {
  try {
    // Fetch job to get voice details
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));

    await db
      .update(jobsTable)
      .set({ status: "processing" })
      .where(eq(jobsTable.id, jobId));

    const steps = await db
      .select()
      .from(pipelineStepsTable)
      .where(eq(pipelineStepsTable.jobId, jobId))
      .orderBy(pipelineStepsTable.order);

    let generatedScript: string | null = null;
    let presenterVideoUrl: string | null = null;
    let finalVideoUrl: string | null = null;
    let scrapedImages: string[] = [];
    // Photos used by downstream steps (analysis, video). Starts as the originals
    // and is replaced by the AI-enhanced versions once the glow-up step runs.
    let effectivePhotos: string[] = job.propertyImages ?? [];
    const isPhotoMode = job.inputMode === "photos";
    const listingContext: ListingContext = parseListingUrl(job.listingUrl);
    listingContext.inputMode = isPhotoMode ? "photos" : "url";
    if (job.propertyAddress) listingContext.address = job.propertyAddress;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const baseDuration = STEP_DURATIONS[i] ?? 2500;

      await db
        .update(pipelineStepsTable)
        .set({ status: "running", startedAt: new Date() })
        .where(eq(pipelineStepsTable.id, step.id));

      let outputUrl: string | null = null;
      let outputData: string | null = null;

      if (step.name === "enhance_photos") {
        // AI "Glow-up" — relight / declutter / sky-replace each uploaded photo
        try {
          const originals = job.propertyImages ?? [];
          logger.info({ jobId, count: originals.length }, "Enhancing property photos with Gemini");
          const { enhanced, enhancedCount } = await enhancePropertyPhotos(originals);
          effectivePhotos = enhanced;
          await db.update(jobsTable)
            .set({ enhancedImages: enhanced })
            .where(eq(jobsTable.id, jobId));
          outputData = [
            `Photos enhanced: ${enhancedCount} of ${originals.length}`,
            enhancedCount > 0
              ? "AI relit, colour-balanced and decluttered your photos for a premium listing look."
              : "Enhancement unavailable — original photos used.",
          ].join("\n");
          logger.info({ jobId, enhancedCount }, "AI photo glow-up complete");
        } catch (err) {
          logger.error({ err, jobId }, "Photo enhancement failed — continuing with originals");
          effectivePhotos = job.propertyImages ?? [];
          // Persist the fallback so the UI shows the (un-enhanced) photos rather
          // than a perpetual "enhancing…" spinner or stale prior-run results.
          await db.update(jobsTable)
            .set({ enhancedImages: effectivePhotos })
            .where(eq(jobsTable.id, jobId));
          outputData = "Enhancement unavailable — original photos used.";
          await new Promise((resolve) => setTimeout(resolve, baseDuration));
        }
      } else if (step.name === "analyse_photos") {
        // Real Claude Vision analysis of agent-uploaded photos
        try {
          const photos = effectivePhotos.length > 0 ? effectivePhotos : (job.propertyImages ?? []);
          logger.info({ jobId, count: photos.length }, "Analysing property photos with Claude Vision");
          const analysis = await analysePropertyPhotos(photos, job.propertyAddress);

          Object.assign(listingContext, {
            summary: analysis.summary || listingContext.summary,
            propertyType: analysis.propertyType ?? listingContext.propertyType,
            bedrooms: analysis.bedrooms ?? listingContext.bedrooms,
            bathrooms: analysis.bathrooms ?? listingContext.bathrooms,
            features: analysis.features,
          });

          // Use the address as the listing title if we don't have one
          if (job.propertyAddress && !job.listingTitle) {
            await db.update(jobsTable)
              .set({ listingTitle: job.propertyAddress })
              .where(eq(jobsTable.id, jobId));
          }

          outputData = [
            analysis.summary ? `Summary: ${analysis.summary}` : null,
            job.propertyAddress ? `Address: ${job.propertyAddress}` : null,
            analysis.propertyType ? `Type: ${analysis.propertyType}` : null,
            analysis.bedrooms ? `Bedrooms: ${analysis.bedrooms}` : null,
            analysis.bathrooms ? `Bathrooms: ${analysis.bathrooms}` : null,
            analysis.features.length > 0 ? `Features: ${analysis.features.join(", ")}` : null,
            `Photos analysed: ${photos.length}`,
          ].filter(Boolean).join("\n");
          logger.info({ jobId, featureCount: analysis.features.length }, "Claude Vision analysis complete");
        } catch (err) {
          logger.error({ err, jobId }, "Photo analysis failed — continuing with address only");
          outputData = [
            job.propertyAddress ? `Address: ${job.propertyAddress}` : null,
            `Photos provided: ${(job.propertyImages ?? []).length}`,
            "Note: AI vision analysis was unavailable; script generated from address.",
          ].filter(Boolean).join("\n");
          await new Promise((resolve) => setTimeout(resolve, baseDuration));
        }
      } else if (step.name === "scrape_listing") {
        // Real Apify scrape — falls back to URL parsing if Apify unavailable
        try {
          logger.info({ jobId, listingUrl: job.listingUrl }, "Scraping listing with Apify");
          const apifyResult = await scrapeListing(job.listingUrl);
          scrapedImages = apifyResult.images;

          // If agent uploaded manual photos, keep those — otherwise use scraped photos
          const hasManualPhotos = (job.propertyImages ?? []).length > 0;
          if (!hasManualPhotos && scrapedImages.length > 0) {
            await db.update(jobsTable)
              .set({ propertyImages: scrapedImages })
              .where(eq(jobsTable.id, jobId));
            // Reload job so downstream steps see the scraped images
            const [updated] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
            if (updated) Object.assign(job, updated);
            logger.info({ jobId, count: scrapedImages.length }, "Saved scraped property images to job");
          }

          // Merge Apify data into listingContext for script generation
          Object.assign(listingContext, {
            address: apifyResult.address,
            price: apifyResult.price,
            bathrooms: apifyResult.bathrooms,
            carSpaces: apifyResult.carSpaces,
            scrapedDescription: apifyResult.description,
            bedrooms: apifyResult.bedrooms?.toString() ?? listingContext.bedrooms,
            suburb: listingContext.suburb ?? (apifyResult.address?.split(",")[1]?.trim() ?? null),
          });

          // Update listing title if we got a better one from Apify
          if (apifyResult.title && !job.listingTitle) {
            await db.update(jobsTable)
              .set({ listingTitle: apifyResult.title })
              .where(eq(jobsTable.id, jobId));
          }

          const scraped = [
            apifyResult.title ? `Title: ${apifyResult.title}` : listingContext.summary,
            apifyResult.address ? `Address: ${apifyResult.address}` : null,
            apifyResult.price ? `Price: ${apifyResult.price}` : null,
            apifyResult.bedrooms ? `Bedrooms: ${apifyResult.bedrooms}` : null,
            apifyResult.bathrooms ? `Bathrooms: ${apifyResult.bathrooms}` : null,
            apifyResult.carSpaces ? `Car spaces: ${apifyResult.carSpaces}` : null,
            `Platform: ${listingContext.platform}`,
            `Photos found: ${scrapedImages.length}`,
          ].filter(Boolean).join("\n");
          outputData = scraped;
          logger.info({ jobId, imageCount: scrapedImages.length, hasManualPhotos }, "Apify scrape complete");
        } catch (err) {
          logger.warn({ err, jobId }, "Apify scrape failed — falling back to URL parsing");
          // Graceful fallback to URL metadata only
          const scraped = [
            listingContext.summary,
            listingContext.suburb ? `Suburb: ${listingContext.suburb}` : null,
            listingContext.state ? `State: ${listingContext.state}` : null,
            listingContext.propertyType ? `Type: ${listingContext.propertyType}` : null,
            listingContext.bedrooms ? `Bedrooms: ${listingContext.bedrooms}` : null,
            `Platform: ${listingContext.platform}`,
          ].filter(Boolean).join("\n");
          outputData = scraped;
          await new Promise((resolve) => setTimeout(resolve, baseDuration));
        }
      } else if (step.name === "generate_script") {
        // Real Anthropic call to generate a listing script
        try {
          logger.info({ jobId }, "Generating script with Anthropic");
          const result = await generateListingScript(job.listingUrl, listingContext);
          outputData = result.script;
          generatedScript = result.script;
          // Use AI title if available; else fall back to URL-parsed summary
          if (!result.title && listingContext.summary) {
            await db.update(jobsTable).set({ listingTitle: listingContext.summary }).where(eq(jobsTable.id, jobId));
          }
          // Update listing title on the job if we got one
          if (result.title) {
            await db
              .update(jobsTable)
              .set({ listingTitle: result.title })
              .where(eq(jobsTable.id, jobId));
          }
        } catch (err) {
          logger.error({ err, jobId }, "Script generation failed — continuing");
        }
        // Small delay to feel realistic regardless
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } else if (step.name === "create_voiceover" && job?.voiceId) {
        // Real ElevenLabs call — use AI-generated script if available
        try {
          logger.info({ jobId, voiceId: job.voiceId }, "Generating voiceover with ElevenLabs");
          const script = generatedScript ?? buildVoiceoverScript(job.listingUrl);
          const audioBuffer = await generateVoiceover(script, job.voiceId);
          const base64 = audioBuffer.toString("base64");
          outputUrl = `data:audio/mpeg;base64,${base64}`;
          logger.info({ jobId, bytes: audioBuffer.length }, "ElevenLabs voiceover generated");
        } catch (err) {
          logger.error({ err, jobId }, "ElevenLabs voiceover failed — continuing without audio");
        }
      } else if (step.name === "presenter_video") {
        // Real HeyGen call — generate AI presenter video from script
        try {
          const script = generatedScript ?? buildVoiceoverScript(job.listingUrl);
          logger.info({ jobId, voiceName: job.voiceName }, "Generating presenter video with HeyGen");
          const result = await generatePresenterVideo(script, job.voiceName, job.voiceId);
          presenterVideoUrl = result.videoUrl;
          finalVideoUrl = result.videoUrl;
          outputUrl = result.videoUrl;
          logger.info({ jobId, videoId: result.videoId }, "HeyGen presenter video ready");
        } catch (err) {
          logger.error({ err, jobId }, "HeyGen presenter video failed — continuing");
          await new Promise((resolve) => setTimeout(resolve, baseDuration));
        }
      } else if (step.name === "compose_video") {
        // Real Shotstack call — compose final branded video from presenter clip
        try {
          if (!presenterVideoUrl) throw new Error("No presenter video URL from step 4");
          logger.info({ jobId, presenterVideoUrl }, "Composing final video with Shotstack");
          const result = await composePresenterVideo(
            presenterVideoUrl,
            job.listingTitle,
            job.listingUrl,
            effectivePhotos.length > 0 ? effectivePhotos : (job.propertyImages ?? []),
          );
          outputUrl = result.videoUrl;
          finalVideoUrl = result.videoUrl;
          logger.info({ jobId, renderId: result.renderId }, "Shotstack final video ready");
        } catch (err) {
          logger.error({ err, jobId }, "Shotstack compose failed — continuing");
          await new Promise((resolve) => setTimeout(resolve, baseDuration));
        }
      } else {
        // Fallback simulated step
        await new Promise((resolve) => setTimeout(resolve, baseDuration));
      }

      await db
        .update(pipelineStepsTable)
        .set({
          status: "complete",
          completedAt: new Date(),
          ...(outputUrl ? { outputUrl } : {}),
          ...(outputData ? { outputData } : {}),
        })
        .where(eq(pipelineStepsTable.id, step.id));

      logger.info({ jobId, step: step.name, order: i + 1 }, "Pipeline step complete");
    }

    await db
      .update(jobsTable)
      .set({ status: "complete", ...(finalVideoUrl ? { videoUrl: finalVideoUrl } : {}) })
      .where(eq(jobsTable.id, jobId));

    logger.info({ jobId, hasVideo: !!finalVideoUrl }, "Pipeline complete");
  } catch (err) {
    logger.error({ err, jobId }, "Pipeline failed");
    await db
      .update(jobsTable)
      .set({ status: "failed" })
      .where(eq(jobsTable.id, jobId));
  } finally {
    activeSimulations.delete(jobId);
  }
}

router.get("/jobs", async (req, res): Promise<void> => {
  const userId = req.isAuthenticated() ? req.user.id : null;
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(userId ? eq(jobsTable.userId, userId) : eq(jobsTable.userId, "__none__"))
    .orderBy(desc(jobsTable.createdAt));
  res.json(jobs);
});

router.post("/jobs", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const inputMode = parsed.data.inputMode === "photos" ? "photos" : "url";

  if (inputMode === "url" && !parsed.data.listingUrl?.trim()) {
    res.status(400).json({ error: "A listing URL is required for URL mode" });
    return;
  }
  if (inputMode === "photos" && (parsed.data.propertyImages ?? []).length === 0) {
    res.status(400).json({ error: "At least one property photo is required for photo mode" });
    return;
  }

  const id = randomUUID();
  const [job] = await db
    .insert(jobsTable)
    .values({
      id,
      userId: req.user.id,
      listingUrl: parsed.data.listingUrl ?? "",
      voiceId: parsed.data.voiceId ?? null,
      voiceName: parsed.data.voiceName ?? null,
      propertyImages: parsed.data.propertyImages ?? [],
      inputMode,
      propertyAddress: parsed.data.propertyAddress ?? null,
      status: "queued",
    })
    .returning();

  const pipelineSteps = inputMode === "photos" ? PIPELINE_STEPS_PHOTOS : PIPELINE_STEPS_URL;
  const stepRows = pipelineSteps.map((step) => ({
    id: randomUUID(),
    jobId: id,
    name: step.name,
    label: step.label,
    status: "pending",
    order: step.order,
  }));
  await db.insert(pipelineStepsTable).values(stepRows);

  res.status(201).json(job);
});

// Generate an AI listing script up front (for the teleprompter) without
// persisting a job or running the pipeline.
router.post("/jobs/generate-script", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = GenerateScriptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const inputMode = parsed.data.inputMode === "photos" ? "photos" : "url";
  const listingUrl = parsed.data.listingUrl?.trim() ?? "";
  const propertyImages = parsed.data.propertyImages ?? [];
  const propertyAddress = parsed.data.propertyAddress?.trim() || null;

  if (inputMode === "url" && !listingUrl) {
    res.status(400).json({ error: "A listing URL is required for URL mode" });
    return;
  }
  if (inputMode === "photos" && propertyImages.length === 0) {
    res.status(400).json({ error: "At least one property photo is required for photo mode" });
    return;
  }

  const listingContext: ListingContext = parseListingUrl(listingUrl);
  listingContext.inputMode = inputMode;
  if (propertyAddress) listingContext.address = propertyAddress;

  if (inputMode === "photos") {
    try {
      const analysis = await analysePropertyPhotos(propertyImages, propertyAddress);
      Object.assign(listingContext, {
        summary: analysis.summary || listingContext.summary,
        propertyType: analysis.propertyType ?? listingContext.propertyType,
        bedrooms: analysis.bedrooms ?? listingContext.bedrooms,
        bathrooms: analysis.bathrooms ?? listingContext.bathrooms,
        features: analysis.features,
      });
    } catch (err) {
      req.log.warn({ err }, "Photo analysis failed during generate-script — using URL context only");
    }
  }

  const result = await generateListingScript(listingUrl, listingContext);
  res.json({ script: result.script, title: result.title });
});

// Save an agent's self-recorded video as a completed job. No pipeline runs —
// the recording is already finished, so we store it directly and attach a
// single script step so the job detail screen can show the read-along script.
router.post("/jobs/self-recorded", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateSelfRecordedJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const videoUrl = parsed.data.videoUrl?.trim();
  const script = parsed.data.script?.trim();
  if (!videoUrl || !script) {
    res.status(400).json({ error: "A recorded videoUrl and script are required" });
    return;
  }

  // The video must be one we issued an upload URL for — reject arbitrary/external
  // URLs so callers can't persist links to anything other than our storage.
  let parsedVideoUrl: URL;
  try {
    parsedVideoUrl = new URL(videoUrl);
  } catch {
    res.status(400).json({ error: "videoUrl must be a valid URL" });
    return;
  }
  if (!parsedVideoUrl.pathname.includes("/api/storage/")) {
    res.status(400).json({ error: "videoUrl must reference an uploaded recording" });
    return;
  }

  const listingUrl = parsed.data.listingUrl?.trim() ?? "";
  const propertyAddress = parsed.data.propertyAddress?.trim() || null;
  const title =
    parsed.data.title?.trim() || propertyAddress || "Self-recorded listing video";

  const id = randomUUID();
  const [job] = await db
    .insert(jobsTable)
    .values({
      id,
      userId: req.user.id,
      listingUrl,
      listingTitle: title,
      videoUrl,
      propertyImages: parsed.data.propertyImages ?? [],
      inputMode: "selfie",
      propertyAddress,
      status: "complete",
    })
    .returning();

  const now = new Date();
  await db.insert(pipelineStepsTable).values({
    id: randomUUID(),
    jobId: id,
    name: "generate_script",
    label: "Your Script",
    status: "complete",
    order: 1,
    startedAt: now,
    completedAt: now,
    outputData: script,
  });

  res.status(201).json(job);
});

router.get("/jobs/stats", async (req, res): Promise<void> => {
  const userId = req.isAuthenticated() ? req.user.id : null;
  const whereClause = userId ? eq(jobsTable.userId, userId) : eq(jobsTable.userId, "__none__");

  const statsRows = await db
    .select({
      status: jobsTable.status,
      count: count(),
    })
    .from(jobsTable)
    .where(whereClause)
    .groupBy(jobsTable.status);

  const stats = { total: 0, queued: 0, processing: 0, complete: 0, failed: 0 };
  for (const row of statsRows) {
    const n = Number(row.count);
    stats.total += n;
    if (row.status === "queued") stats.queued = n;
    else if (row.status === "processing") stats.processing = n;
    else if (row.status === "complete") stats.complete = n;
    else if (row.status === "failed") stats.failed = n;
  }

  const recentJobs = await db
    .select()
    .from(jobsTable)
    .where(whereClause)
    .orderBy(desc(jobsTable.createdAt))
    .limit(5);

  // Count completed script generation steps (= scripts generated)
  const scriptRows = await db
    .select({ count: count() })
    .from(pipelineStepsTable)
    .innerJoin(jobsTable, eq(pipelineStepsTable.jobId, jobsTable.id))
    .where(
      and(
        eq(pipelineStepsTable.name, "generate_script"),
        eq(pipelineStepsTable.status, "complete"),
        userId ? eq(jobsTable.userId, userId) : eq(jobsTable.userId, "__none__"),
      )
    );
  const scriptsGenerated = Number(scriptRows[0]?.count ?? 0);

  // Estimate time saved: each complete video saves ~4 hours vs manual filming/editing
  const timeSavedHours = stats.complete * 4;

  res.json({ ...stats, recentJobs, scriptsGenerated, timeSavedHours });
});

router.post("/jobs/:id/simulate", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.id, raw), eq(jobsTable.userId, req.user.id)));

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  if (activeSimulations.has(raw)) {
    res.status(400).json({ error: "Simulation already in progress for this job" });
    return;
  }

  if (job.status === "processing") {
    res.status(400).json({ error: "Job is already processing" });
    return;
  }

  if (job.status === "complete" || job.status === "failed") {
    await db
      .update(pipelineStepsTable)
      .set({ status: "pending", startedAt: null, completedAt: null, errorMessage: null, outputUrl: null })
      .where(eq(pipelineStepsTable.jobId, raw));
    await db
      .update(jobsTable)
      .set({ status: "queued", enhancedImages: [] })
      .where(eq(jobsTable.id, raw));
  }

  activeSimulations.add(raw);
  runSimulation(raw);
  res.json({ message: "Simulation started", jobId: raw });
});

router.post("/jobs/:id/send-to-crm", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const bodyParsed = SendJobToCrmBody.safeParse(req.body ?? {});
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.id, raw), eq(jobsTable.userId, req.user.id)));

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  if (job.status !== "complete") {
    res.status(400).json({ error: "Job must be complete before sending to CRM" });
    return;
  }

  const videoUrl = job.videoUrl ?? "";
  const title = job.listingTitle || job.propertyAddress || job.listingUrl || "Property listing";
  const email = bodyParsed.data.email || req.user.email || null;

  const noteBody = [
    `🎬 LensFlow AI video ready: ${title}`,
    videoUrl ? `Video: ${videoUrl}` : "Video link unavailable",
    job.listingUrl ? `Listing: ${job.listingUrl}` : null,
    job.propertyAddress ? `Address: ${job.propertyAddress}` : null,
  ].filter(Boolean).join("\n");

  try {
    let contactId: string | null = null;
    if (email) {
      const searchRes = await connectors.proxy("hubspot", "/crm/v3/objects/contacts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
        }),
      });
      if (searchRes.ok) {
        const searchData = (await searchRes.json()) as { results?: Array<{ id: string }> };
        contactId = searchData.results?.[0]?.id ?? null;
      } else {
        logger.warn(
          { jobId: raw, status: searchRes.status },
          "HubSpot contact search failed — will attempt to create contact",
        );
      }

      if (!contactId) {
        const createRes = await connectors.proxy("hubspot", "/crm/v3/objects/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            properties: { email, lifecyclestage: "lead", lead_source: "LensFlow Pipeline" },
          }),
        });
        if (createRes.ok) {
          const created = (await createRes.json()) as { id?: string };
          contactId = created.id ?? null;
        } else {
          logger.warn(
            { jobId: raw, status: createRes.status },
            "HubSpot contact create failed — note will be logged without association",
          );
        }
      }
    }

    const noteRes = await connectors.proxy("hubspot", "/crm/v3/objects/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        properties: {
          hs_note_body: noteBody,
          hs_timestamp: Date.now(),
        },
        ...(contactId
          ? {
              associations: [
                {
                  to: { id: contactId },
                  types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
                },
              ],
            }
          : {}),
      }),
    });

    if (!noteRes.ok) {
      const errText = await noteRes.text();
      throw new Error(`HubSpot note creation failed: ${noteRes.status} ${errText}`);
    }

    logger.info({ jobId: raw, contactId, hasEmail: !!email }, "Job video sent to HubSpot CRM");
    res.json({
      success: true,
      message: contactId
        ? `Video sent to HubSpot and linked to ${email}.`
        : "Video logged in HubSpot as a note.",
    });
  } catch (err) {
    logger.error({ err, jobId: raw }, "Failed to send job to HubSpot CRM");
    res.status(502).json({ success: false, message: "Could not reach HubSpot. Please try again." });
  }
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.id, raw), eq(jobsTable.userId, req.user.id)));

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const steps = await db
    .select()
    .from(pipelineStepsTable)
    .where(eq(pipelineStepsTable.jobId, raw))
    .orderBy(pipelineStepsTable.order);

  res.json({ ...job, steps });
});

router.delete("/jobs/:id", async (req, res): Promise<void> => {
  const params = DeleteJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [job] = await db
    .delete(jobsTable)
    .where(and(eq(jobsTable.id, raw), eq(jobsTable.userId, req.user.id)))
    .returning();

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
