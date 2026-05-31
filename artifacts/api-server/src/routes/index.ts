import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import webhooksRouter from "./webhooks";
import leadsRouter from "./leads";
import anthropicRouter from "./anthropic";
import elevenlabsRouter from "./elevenlabs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(webhooksRouter);
router.use(leadsRouter);
router.use(anthropicRouter);
router.use(elevenlabsRouter);

export default router;
