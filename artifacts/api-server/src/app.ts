import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
