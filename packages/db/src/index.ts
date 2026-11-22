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
// statement_timeout travels as a connection option. A PgBouncer-style pooler refuses options
// it doesn't know, so a pooled DATABASE_URL needs `ignore_startup_parameters` to include it.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  statement_timeout: 15_000,
  connectionTimeoutMillis: 10_000,
});

// A connection the database drops while idle (a restart, a failover) is reported here. With
// no listener Node treats it as an unhandled error and the whole API exits; the pool simply
// opens a new connection for the next query.
pool.on("error", (err) => {
  console.error(`Postgres: an idle connection was lost: ${err.message}`);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
