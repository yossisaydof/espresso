import { query } from "../db";
import {
    Issue,
    IssueFilters,
    CreateIssuePayload,
    UpdateIssuePayload,
    Severity,
    Status
} from "../types/issue";
import {
    DashboardSummary,
    StatusCounts,
    SeverityCounts
} from "../types/dashboard";
import { QueryResultRow } from "pg";

interface IssueRow extends QueryResultRow {
    id: number;
    title: string;
    description: string;
    site: string;
    severity: Severity;
    status: Status;
    created_at: string | Date;
    updated_at: string | Date;
}

function mapIssueRow(row: IssueRow): Issue {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        site: row.site,
        severity: row.severity,
        status: row.status,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
    };
}

function buildListWhereClause(filters: IssueFilters): {
    whereSql: string;
    params: unknown[];
} {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.search) {
        params.push(`%${filters.search}%`);
        conditions.push(`title ILIKE $${params.length}`);
    }

    if (filters.status) {
        params.push(filters.status);
        conditions.push(`status = $${params.length}`);
    }

    if (filters.severity) {
        params.push(filters.severity);
        conditions.push(`severity = $${params.length}`);
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return { whereSql, params };
}

export async function listIssues(filters: IssueFilters): Promise<Issue[]> {
    const { whereSql, params } = buildListWhereClause(filters);

    const sql = `
    SELECT
      id,
      title,
      description,
      site,
      severity,
      status,
      created_at,
      updated_at
    FROM issues
    ${whereSql}
    ORDER BY created_at DESC
  `;

    const result = await query<IssueRow>(sql, params);
    return result.rows.map(mapIssueRow);
}

export async function getIssue(id: number): Promise<Issue | null> {
    const sql = `
    SELECT
      id,
      title,
      description,
      site,
      severity,
      status,
      created_at,
      updated_at
    FROM issues
    WHERE id = $1
  `;

    const result = await query<IssueRow>(sql, [id]);
    const row = result.rows[0];
    return row ? mapIssueRow(row) : null;
}

export async function createIssue(payload: CreateIssuePayload) {
    const createdAt =
        payload.createdAt && !isNaN(new Date(payload.createdAt).getTime())
            ? new Date(payload.createdAt)
            : new Date();

    const result = await query<IssueRow>(
        `
      INSERT INTO issues (
        title,
        description,
        site,
        severity,
        status,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        title,
        description,
        site,
        severity,
        status,
        created_at,
        updated_at
    `,
        [
            payload.title,
            payload.description,
            payload.site,
            payload.severity,
            payload.status,
            createdAt
        ]
    );

    const row = result.rows[0];
    return row ? mapIssueRow(row) : null;
}

export async function updateIssue(
    id: number,
    payload: UpdateIssuePayload
): Promise<Issue | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (payload.title !== undefined) {
        params.push(payload.title);
        fields.push(`title = $${params.length}`);
    }
    if (payload.description !== undefined) {
        params.push(payload.description);
        fields.push(`description = $${params.length}`);
    }
    if (payload.site !== undefined) {
        params.push(payload.site);
        fields.push(`site = $${params.length}`);
    }
    if (payload.severity !== undefined) {
        params.push(payload.severity);
        fields.push(`severity = $${params.length}`);
    }
    if (payload.status !== undefined) {
        params.push(payload.status);
        fields.push(`status = $${params.length}`);
    }

    if (fields.length === 0) {
        return getIssue(id);
    }

    fields.push(`updated_at = NOW()`);

    params.push(id);
    const sql = `
    UPDATE issues
    SET ${fields.join(", ")}
    WHERE id = $${params.length}
    RETURNING
      id,
      title,
      description,
      site,
      severity,
      status,
      created_at,
      updated_at
  `;

    const result = await query<IssueRow>(sql, params);
    const row = result.rows[0];
    return row ? mapIssueRow(row) : null;
}

export async function deleteIssue(id: number): Promise<boolean> {
    const sql = `DELETE FROM issues WHERE id = $1`;
    const result = await query<IssueRow>(sql, [id]);
    return result.rowCount === 1;
}

export async function resolveIssue(id: number): Promise<Issue | null> {
    const sql = `
    UPDATE issues
    SET status = 'resolved', updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      title,
      description,
      site,
      severity,
      status,
      created_at,
      updated_at
  `;

    const result = await query<IssueRow>(sql, [id]);
    const row = result.rows[0];
    return row ? mapIssueRow(row) : null;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const statusCounts: StatusCounts = {
        open: 0,
        in_progress: 0,
        resolved: 0
    };

    const severityCounts: SeverityCounts = {
        minor: 0,
        major: 0,
        critical: 0
    };

    const statusSql = `
    SELECT status, COUNT(*)::int AS count
    FROM issues
    GROUP BY status
  `;
    const severitySql = `
    SELECT severity, COUNT(*)::int AS count
    FROM issues
    GROUP BY severity
  `;

    const [statusResult, severityResult] = await Promise.all([
        query<{ status: Status; count: number }>(statusSql),
        query<{ severity: Severity; count: number }>(severitySql)
    ]);

    for (const row of statusResult.rows) {
        statusCounts[row.status] = row.count;
    }

    for (const row of severityResult.rows) {
        severityCounts[row.severity] = row.count;
    }

    return {
        statusCounts,
        severityCounts
    };
}

export async function importIssuesFromCsv(csvText: string) {
    const rows = parseIssuesCsv(csvText);
    const importedIssues = [];

    for (const row of rows) {
        const created = await createIssue(row);
        importedIssues.push(created);
    }

    return importedIssues;
}

function parseIssuesCsv(csvText: string): CreateIssuePayload[] {
    const lines = csvText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length === 0) {
        throw new Error("CSV is empty");
    }

    // First line = header
    const headers = lines[0]
        .split(",")
        .map((h) => h.trim().toLowerCase());

    const titleIndex = headers.indexOf("title");
    const descriptionIndex = headers.indexOf("description");
    const siteIndex = headers.indexOf("site");
    const severityIndex = headers.indexOf("severity");
    const statusIndex = headers.indexOf("status");
    const createdAtIndex = headers.indexOf("createdat");

    if (
        titleIndex === -1 ||
        descriptionIndex === -1 ||
        siteIndex === -1 ||
        severityIndex === -1
    ) {
        console.warn("CSV is missing required columns");
    }

    const results: CreateIssuePayload[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const columns = line.split(",").map((c) => c.trim());

        const title = columns[titleIndex] || "";
        const description = columns[descriptionIndex] || "";
        const site = columns[siteIndex] || "";
        const severityRaw =
            severityIndex !== -1 ? columns[severityIndex].toLowerCase() : "minor";
        const statusRaw =
            statusIndex !== -1 ? columns[statusIndex].toLowerCase() : "open";
        const createdAtRaw =
            createdAtIndex !== -1 ? columns[createdAtIndex] : "";

        if (!title || !description || !site) {
            console.warn(`Skipping row ${i + 1} due to missing required fields`);
            continue;
        }

        let severity: CreateIssuePayload["severity"];
        if (severityRaw === "major" || severityRaw === "critical") {
            severity = severityRaw;
        } else {
            severity = "minor";
        }

        let status: CreateIssuePayload["status"];
        if (statusRaw === "in_progress" || statusRaw === "resolved") {
            status = statusRaw;
        } else {
            status = "open";
        }

        let createdAt: string;
        if (createdAtRaw) {
            const date = new Date(createdAtRaw);
            if (isNaN(date.getTime())) {
                console.warn(`Invalid createdAt date at line ${i + 1}, using current date instead`);
            }
            createdAt = date.toISOString();
        } else {
            createdAt = new Date().toISOString();
        }

        results.push({
            title,
            description,
            site,
            severity,
            status,
            createdAt
        });
    }

    if (results.length === 0) {
        console.warn("No valid rows found in CSV");
    }

    return results;
}
