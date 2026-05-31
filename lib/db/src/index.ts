import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// We control SSL explicitly via the `ssl` option below, so strip any `sslmode`
// query param from the connection string. Newer `pg` versions emit a noisy
// deprecation warning when `sslmode=prefer|require|verify-ca` is present.
function buildConnectionString(raw: string): string {
  try {
    const url = new URL(raw);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return raw;
  }
}

export const pool = new Pool({
  connectionString: buildConnectionString(process.env.DATABASE_URL),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
