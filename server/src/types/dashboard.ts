
// statusCounts represents the count of issues by their status
export interface StatusCounts {
    open: number;
    in_progress: number;
    resolved: number;
}

// severityCounts represents the count of issues by their severity
export interface SeverityCounts {
    minor: number;
    major: number;
    critical: number;
}

// DashboardSummary aggregates issue counts by status and severity
export interface DashboardSummary {
    statusCounts: StatusCounts;
    severityCounts: SeverityCounts;
}
