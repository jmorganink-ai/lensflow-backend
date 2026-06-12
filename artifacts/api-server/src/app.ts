import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import fs from "fs";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";
import { WebhookHandlers } from "./webhookHandlers";

const app: Express = express();

function resolveWorkspaceRoot() {
  const candidates = [
    process.cwd(),
    path.resolve(process.cwd(), "..", ".."),
    path.resolve(process.cwd(), "lensflow"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "artifacts/lensflow-site/dist/public/index.html"))) {
      return candidate;
    }
  }

  return process.cwd();
}

const workspaceRoot = resolveWorkspaceRoot();
const marketingSiteDist = path.join(workspaceRoot, "artifacts/lensflow-site/dist/public");
const pipelineAppDist = path.join(workspaceRoot, "artifacts/lensflow/dist/public");

// Build CORS allowlist from environment + hardcoded custom domains.
// REPLIT_DOMAINS is a comma-separated list of all domains serving this repl
// (both the *.replit.dev preview and *.replit.app production domains).
const CUSTOM_DOMAINS = [
  "https://www.lensflow.com.au",
  "https://lensflow.com.au",
];

const replitDomains = (process.env["REPLIT_DOMAINS"] ?? "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean)
  .map((d) => `https://${d}`);

const ALLOWED_ORIGINS = new Set([...CUSTOM_DOMAINS, ...replitDomains]);

// CRITICAL: Stripe webhook route must be registered BEFORE express.json()
// Stripe signature verification requires the raw Buffer body.
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) { res.status(400).json({ error: 'Missing stripe-signature' }); return; }
    const sig = Array.isArray(signature) ? signature[0] : signature;
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (err: any) {
      logger.error({ err }, 'Stripe webhook error');
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests (no Origin header) and curl/healthz
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.has(origin)) return callback(null, true);
      callback(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Serve background images/clips used in selfie video composition.
// These are accessed by Shotstack via the public domain URL at render time.
const backgroundsDir = path.join(workspaceRoot, "artifacts/api-server/public/backgrounds");
app.use("/api/backgrounds", express.static(backgroundsDir, { maxAge: "7d" }));

app.use("/api", router);
app.use("/pipeline", express.static(pipelineAppDist, { index: false }));
app.get("/pipeline/*path", (_req, res) => {
  res.sendFile(path.join(pipelineAppDist, "index.html"));
});

app.use(express.static(marketingSiteDist, { index: false }));
app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/pipeline/")) {
    next();
    return;
  }
  res.sendFile(path.join(marketingSiteDist, "index.html"));
});

export default app;
