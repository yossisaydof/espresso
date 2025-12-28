export interface StatusCounts {
    open: number;
    in_progress: number;
    resolved: number;
}

export interface SeverityCounts {
    minor: number;
    major: number;
    critical: number;
}

export interface DashboardSummary {
    statusCounts: StatusCounts;
    severityCounts: SeverityCounts;
}
