import { Pool } from "@neondatabase/serverless";
import { neonConfig } from "@neondatabase/serverless";
import type { QueryResultRow } from "@neondatabase/serverless";

// Enable connection caching in serverless environments
neonConfig.fetchConnectionCache = true;

if (!process.env.NEON_DATABASE_URL) {
  console.warn("⚠️ NEON_DATABASE_URL is not defined. The app will fail to query the database until it is set in .env.local.");
}

export const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL || "" });
export const db = pool;

/**
 * Reusable SQL template literal helper for running queries against Neon.
 */
export async function sql<T extends QueryResultRow = any>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  const query = String.raw(strings, ...values);
  const result = await pool.query<T>(query);
  return result.rows;
}

export default pool;
