import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Express = express();

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
const backgroundsDir = path.join(process.cwd(), "artifacts/api-server/public/backgrounds");
app.use("/api/backgrounds", express.static(backgroundsDir, { maxAge: "7d" }));

app.use("/api", router);

export default app;
