export type Severity = "minor" | "major" | "critical";

export type Status = "open" | "in_progress" | "resolved";

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

export interface CreateIssuePayload {
    title: string;
    description: string;
    site: string;
    severity: Severity;
    status: Status;
    createdAt?: string;
}

export interface UpdateIssuePayload {
    title?: string;
    description?: string;
    site?: string;
    severity?: Severity;
    status?: Status;
}

export interface IssueFilters {
    search?: string;
    status?: Status;
    severity?: Severity;
}
