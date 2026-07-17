// Server-only Postgres access via the pg-proxy HTTP endpoint.
// Swap the internals here for a direct `pg` Pool later without touching callers.
import "server-only";

type SqlResponse = { rows: unknown[]; rowCount: number };

export async function sql<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> {
  const base = process.env.PG_PROXY_URL;
  const token = process.env.PG_PROXY_TOKEN;
  const db = process.env.PG_DB_NAME || "prod_main";
  if (!base || !token) {
    throw new Error("Missing PG_PROXY_URL / PG_PROXY_TOKEN env vars");
  }

  const res = await fetch(new URL("/api/sql", base), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ db_name: db, sql: query, params }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DB query failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as SqlResponse;
  return json.rows as T[];
}
