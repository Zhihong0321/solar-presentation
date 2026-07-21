// Server-only Postgres access via a direct connection (Railway DATABASE_URL).
import "server-only";
import { Pool } from "pg";

// Cache the pool across dev hot-reloads to avoid exhausting connections.
const globalForPg = globalThis as unknown as { _pgPool?: Pool };

function getPool(): Pool {
  if (globalForPg._pgPool) return globalForPg._pgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL env var");
  }

  // Internal Railway / local connections don't use TLS; public endpoints do.
  const isInternal = /railway\.internal|localhost|127\.0\.0\.1/.test(
    connectionString,
  );
  const sslDisabled = process.env.PGSSL === "false";

  const pool = new Pool({
    connectionString,
    ssl: isInternal || sslDisabled ? false : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });

  globalForPg._pgPool = pool;
  return pool;
}

// Optional: route queries through a REST SQL proxy instead of a direct
// Postgres connection. Used for local dev when only a proxy (not a direct
// DATABASE_URL) can reach the production database. All values come from env.
async function sqlViaProxy<T>(
  query: string,
  params: unknown[],
): Promise<T[]> {
  const url = process.env.PG_PROXY_URL!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PG_PROXY_TOKEN}`,
    },
    body: JSON.stringify({
      db_name: process.env.PG_PROXY_DB,
      sql: query,
      params,
    }),
  });
  if (!res.ok) {
    throw new Error(`PG proxy error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { rows: T[] };
  return data.rows;
}

export async function sql<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (process.env.PG_PROXY_URL) {
    return sqlViaProxy<T>(query, params);
  }
  const res = await getPool().query(query, params);
  return res.rows as T[];
}
