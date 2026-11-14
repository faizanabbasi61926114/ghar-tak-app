import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// A query stuck for this long is cancelled rather than holding one of the pool's connections,
// and a request waits at most this long for a free connection, so a burst of slow requests
// fails with an error instead of queueing for ever.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  statement_timeout: 15_000,
  connectionTimeoutMillis: 10_000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
