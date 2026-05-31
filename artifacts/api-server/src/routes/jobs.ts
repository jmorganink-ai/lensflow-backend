import { Router, type IRouter } from "express";
import { eq, desc, count, sql } from "drizzle-orm";
import { db, jobsTable, pipelineStepsTable } from "@workspace/db";
import {
  CreateJobBody,
  GetJobParams,
  DeleteJobParams,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const PIPELINE_STEPS = [
  { name: "scrape_listing", label: "Scrape Listing", order: 1 },
  { name: "generate_script", label: "Generate Script", order: 2 },
  { name: "create_voiceover", label: "Create Voiceover", order: 3 },
  { name: "presenter_video", label: "Presenter Video", order: 4 },
  { name: "compose_video", label: "Compose Video", order: 5 },
];

router.get("/jobs", async (req, res): Promise<void> => {
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
