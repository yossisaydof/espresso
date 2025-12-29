import { apiRequest } from "./client.js";

/**
 * Fetch a list of issues from the backend with optional filters.
 */
export async function getIssues({ search, status, severity } = {}) {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (severity) params.set("severity", severity);

    const qs = params.toString() ? `?${params.toString()}` : "";

    return apiRequest(`/issues${qs}`, {
        method: "GET"
    });
}

/**
 * Fetch dashboard summary data (counts by status and severity).
 */
export async function getDashboardSummary() {
    return apiRequest(`/issues/dashboard`, {
        method: "GET"
    });
}

/**
 * Create a new issue.
 */
export async function createIssue(issuePayload) {
    return apiRequest(`/issues`, {
        method: "POST",
        body: JSON.stringify(issuePayload)
    });
}

/**
 * Update an existing issue by id.
 */
export async function updateIssue(id, issuePayload) {
    return apiRequest(`/issues/${id}`, {
        method: "PUT",
        body: JSON.stringify(issuePayload)
    });
}

/**
 * Delete an issue by id.
 */
export async function deleteIssue(id) {
    return apiRequest(`/issues/${id}`, {
        method: "DELETE"
    });
}

/**
 * Mark an issue as resolved.
 */
export async function resolveIssue(id) {
    return apiRequest(`/issues/${id}/resolve`, {
        method: "PATCH"
    });
}

/**
 * Import issues from a CSV file using multipart/form-data.
 */
export async function importIssuesFromCsv(file) {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return apiRequest(`/issues/import-csv`, {
        method: "POST",
        body: formData
    });
}