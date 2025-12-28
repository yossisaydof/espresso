import dotenv from "dotenv";
import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

dotenv.config();

// Read connection string from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL is not set. Please define it in your .env file."
    );
}

// Single shared connection pool for the whole app
export const pool = new Pool({
    connectionString
});

// Generic helper for running queries with the pool
export function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
}

// Initialize database schema. Create issues table if it does not exist
export async function initDb(): Promise<void> {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      site TEXT,
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
