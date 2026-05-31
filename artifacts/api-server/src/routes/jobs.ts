import { Router, type IRouter } from "express";
import { eq, desc, count, and } from "drizzle-orm";
import { db, jobsTable, pipelineStepsTable } from "@workspace/db";
import {
  CreateJobBody,
  GetJobParams,
  DeleteJobParams,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger";
import { generateVoiceover } from "./elevenlabs";
import { generateListingScript } from "../lib/generate-script";
import { parseListingUrl } from "../lib/parse-listing-url";

const router: IRouter = Router();

const PIPELINE_STEPS = [
  { name: "scrape_listing", label: "Scrape Listing", order: 1 },
  { name: "generate_script", label: "Generate Script", order: 2 },
  { name: "create_voiceover", label: "Create Voiceover", order: 3 },
  { name: "presenter_video", label: "Presenter Video", order: 4 },
  { name: "compose_video", label: "Compose Video", order: 5 },
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
    const listingContext = parseListingUrl(job.listingUrl);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const baseDuration = STEP_DURATIONS[i] ?? 2500;

      await db
        .update(pipelineStepsTable)
        .set({ status: "running", startedAt: new Date() })
        .where(eq(pipelineStepsTable.id, step.id));

      let outputUrl: string | null = null;
      let outputData: string | null = null;

      if (step.name === "scrape_listing") {
        // Parse URL metadata — lightweight, no external request needed
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
      } else {
        // Simulated step
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
      .set({ status: "complete" })
      .where(eq(jobsTable.id, jobId));

    logger.info({ jobId }, "Pipeline complete");
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

  const id = randomUUID();
  const [job] = await db
    .insert(jobsTable)
    .values({
      id,
      userId: req.user.id,
      listingUrl: parsed.data.listingUrl,
      voiceId: parsed.data.voiceId ?? null,
      voiceName: parsed.data.voiceName ?? null,
      status: "queued",
    })
    .returning();

  const stepRows = PIPELINE_STEPS.map((step) => ({
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
      .set({ status: "queued" })
      .where(eq(jobsTable.id, raw));
  }

  activeSimulations.add(raw);
  runSimulation(raw);
  res.json({ message: "Simulation started", jobId: raw });
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
