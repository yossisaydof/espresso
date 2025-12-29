import {
    Severity,
    Status
} from "../types/issue";

const VALID_SEVERITIES: Severity[] = ["minor", "major", "critical"];
const VALID_STATUSES: Status[] = ["open", "in_progress", "resolved"];

/**
 * Type guard that checks whether the provided value is a valid `Severity`.
 */
export function isValidSeverity(value: unknown): value is Severity {
    return typeof value === "string" && VALID_SEVERITIES.includes(value as Severity);
}

export function isValidStatus(value: unknown): value is Status {
    return typeof value === "string" && VALID_STATUSES.includes(value as Status);
}

export function validateCreateIssuePayload(
    payload: any
): string | undefined {
    if (!payload || typeof payload !== "object") {
        return "Body must be a JSON object";
    }

    if (!payload.title || typeof payload.title !== "string") {
        return "title is required and must be a string";
    }

    if (!payload.description || typeof payload.description !== "string") {
        return "description is required and must be a string";
    }

    if (!payload.severity || !isValidSeverity(payload.severity)) {
        return "severity is required and must be one of: minor | major | critical";
    }

    if (payload.status && !isValidStatus(payload.status)) {
        return "status must be one of: open | in_progress | resolved";
    }

    return undefined;
}

export function validateUpdateIssuePayload(
    payload: any
): string | undefined {
    if (!payload || typeof payload !== "object") {
        return "Body must be a JSON object";
    }

    if (payload.title !== undefined && typeof payload.title !== "string") {
        return "title must be a string";
    }

    if (
        payload.description !== undefined &&
        typeof payload.description !== "string"
    ) {
        return "description must be a string";
    }

    if (payload.site !== undefined && typeof payload.site !== "string") {
        return "site must be a string";
    }

    if (
        payload.severity !== undefined &&
        !isValidSeverity(payload.severity)
    ) {
        return "severity must be one of: minor | major | critical";
    }

    if (payload.status !== undefined && !isValidStatus(payload.status)) {
        return "status must be one of: open | in_progress | resolved";
    }

    return undefined;
}
