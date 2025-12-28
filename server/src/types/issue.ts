export type Severity = "minor" | "major" | "critical";

export type Status = "open" | "in_progress" | "resolved";

// Core Issue type as stored in DB
export interface Issue {
    id: number;
    title: string;
    description: string;
    site: string;
    severity: Severity;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}

// Payload for creating a new Issue
export interface CreateIssuePayload {
    title: string;
    description: string;
    site: string;
    severity: Severity;
    status: Status;
    createdAt?: string;
}

// Payload for updating an existing Issue
export interface UpdateIssuePayload {
    title?: string;
    description?: string;
    site?: string;
    severity?: Severity;
    status?: Status;
}

// Filters for listing issues
export interface IssueFilters {
    search?: string;
    status?: Status;
    severity?: Severity;
}
