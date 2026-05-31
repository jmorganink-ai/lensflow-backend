import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import webhooksRouter from "./webhooks";
import leadsRouter from "./leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(webhooksRouter);
router.use(leadsRouter);

export default router;
