import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/settings/avatar", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db
    .select({
      heygenAvatarId: usersTable.heygenAvatarId,
      heygenAvatarName: usersTable.heygenAvatarName,
      heygenVoiceId: usersTable.heygenVoiceId,
    })
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id));

  res.json({
    heygenAvatarId: user?.heygenAvatarId ?? null,
    heygenAvatarName: user?.heygenAvatarName ?? null,
    heygenVoiceId: user?.heygenVoiceId ?? null,
  });
});

router.put("/settings/avatar", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { heygenAvatarId, heygenAvatarName, heygenVoiceId } = req.body as {
    heygenAvatarId?: string | null;
    heygenAvatarName?: string | null;
    heygenVoiceId?: string | null;
  };

  await db
    .update(usersTable)
    .set({
      heygenAvatarId: heygenAvatarId ?? null,
      heygenAvatarName: heygenAvatarName ?? null,
      heygenVoiceId: heygenVoiceId ?? null,
    })
    .where(eq(usersTable.id, req.user.id));

  logger.info({ userId: req.user.id, heygenAvatarName }, "Avatar settings updated");

  res.json({
    heygenAvatarId: heygenAvatarId ?? null,
    heygenAvatarName: heygenAvatarName ?? null,
    heygenVoiceId: heygenVoiceId ?? null,
  });
});

export default router;
