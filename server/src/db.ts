import dotenv from "dotenv";
import { Pool, QueryResult, QueryResultRow } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Please define it in your .env file."
  );
}

export const pool = new Pool({
  connectionString
});

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function initDb(): Promise<void> {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      site TEXT NOT NULL,
      severity TEXT NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
      status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_issues_status
      ON issues (status);

    CREATE INDEX IF NOT EXISTS idx_issues_severity
      ON issues (severity);

    CREATE INDEX IF NOT EXISTS idx_issues_created_at
      ON issues (created_at DESC);
  `;

  await query(createTableSql);
}
