import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, webhooksTable } from "@workspace/db";
import {
  CreateWebhookBody,
  DeleteWebhookParams,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.get("/webhooks", async (req, res): Promise<void> => {
  const webhooks = await db
    .select()
    .from(webhooksTable)
    .orderBy(desc(webhooksTable.createdAt));
  res.json(webhooks);
});

router.post("/webhooks", async (req, res): Promise<void> => {
  const parsed = CreateWebhookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [webhook] = await db
    .insert(webhooksTable)
    .values({
      id: randomUUID(),
      url: parsed.data.url,
      events: parsed.data.events,
      isActive: true,
      secret: parsed.data.secret ?? null,
    })
    .returning();

  res.status(201).json(webhook);
});

router.delete("/webhooks/:id", async (req, res): Promise<void> => {
  const params = DeleteWebhookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [webhook] = await db
    .delete(webhooksTable)
    .where(eq(webhooksTable.id, raw))
    .returning();

  if (!webhook) {
    res.status(404).json({ error: "Webhook not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
