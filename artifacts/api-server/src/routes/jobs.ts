import { Router, type IRouter } from "express";
import { eq, desc, count } from "drizzle-orm";
import { db, jobsTable, pipelineStepsTable } from "@workspace/db";
import {
  CreateJobBody,
  GetJobParams,
  DeleteJobParams,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger";
import { generateVoiceover } from "./elevenlabs";

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

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const baseDuration = STEP_DURATIONS[i] ?? 2500;

      await db
        .update(pipelineStepsTable)
        .set({ status: "running", startedAt: new Date() })
        .where(eq(pipelineStepsTable.id, step.id));

      let outputUrl: string | null = null;

      if (step.name === "create_voiceover" && job?.voiceId) {
        // Real ElevenLabs call
        try {
          logger.info({ jobId, voiceId: job.voiceId }, "Generating voiceover with ElevenLabs");
          const script = buildVoiceoverScript(job.listingUrl);
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
        .set({ status: "complete", completedAt: new Date(), ...(outputUrl ? { outputUrl } : {}) })
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

router.get("/jobs", async (_req, res): Promise<void> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .orderBy(desc(jobsTable.createdAt));
  res.json(jobs);
});

router.post("/jobs", async (req, res): Promise<void> => {
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

router.get("/jobs/stats", async (_req, res): Promise<void> => {
  const statsRows = await db
    .select({
      status: jobsTable.status,
      count: count(),
    })
    .from(jobsTable)
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
    .orderBy(desc(jobsTable.createdAt))
    .limit(5);

  res.json({ ...stats, recentJobs });
});

router.post("/jobs/:id/simulate", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, raw));

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

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, raw));

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

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [job] = await db
    .delete(jobsTable)
    .where(eq(jobsTable.id, raw))
    .returning();

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
