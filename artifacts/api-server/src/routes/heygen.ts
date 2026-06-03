import { Router } from "express";
import { listHeyGenAvatars, listHeyGenVoices, getPresenterAvatarMap } from "../lib/heygen";

const router = Router();

// GET /heygen/presenters — show which avatar/voice ID is mapped to each presenter
router.get("/heygen/presenters", (req, res): void => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  res.json(getPresenterAvatarMap());
});

// GET /heygen/avatars — list every avatar available in this HeyGen account
router.get("/heygen/avatars", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const data = await listHeyGenAvatars();
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to list HeyGen avatars");
    res.status(500).json({ error: String(err) });
  }
});

// GET /heygen/voices — list every voice available in this HeyGen account
router.get("/heygen/voices", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const data = await listHeyGenVoices();
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to list HeyGen voices");
    res.status(500).json({ error: String(err) });
  }
});

export default router;
