import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import { CaptureLeadBody } from "@workspace/api-zod";
import { randomUUID } from "crypto";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const BASE_COUNT_OFFSET = 47;

router.post("/leads", async (req, res) => {
  const parsed = CaptureLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { email, name, source } = parsed.data;

  try {
    const existing = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      res.status(201).json({ success: true, message: "You're already on the list!" });
      return;
    }

    await db.insert(leadsTable).values({
      id: randomUUID(),
      email,
      name: name ?? null,
      source: source ?? "website",
    });

    req.log.info({ email, source }, "New lead captured");
    res.status(201).json({ success: true, message: "You're on the list! We'll be in touch." });
  } catch (err) {
    logger.error({ err }, "Failed to capture lead");
    res.status(500).json({ error: "Failed to save your email. Please try again." });
  }
});

router.get("/leads/count", async (_req, res) => {
  try {
    const result = await db.select({ value: count() }).from(leadsTable);
    const realCount = result[0]?.value ?? 0;
    const displayCount = realCount + BASE_COUNT_OFFSET;
    res.json({ count: realCount, displayCount });
  } catch (err) {
    logger.error({ err }, "Failed to get lead count");
    res.json({ count: 0, displayCount: BASE_COUNT_OFFSET });
  }
});

export default router;
