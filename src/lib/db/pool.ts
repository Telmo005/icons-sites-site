import "server-only";
import { Pool } from "pg";

let pool: Pool | undefined;

/** Shared Postgres pool (Supabase, via the pgbouncer transaction pooler). Server-only. */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL não está definido.");
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}
