import { Request, Response, NextFunction } from "express";
import * as issuesService from "../services/issuesService";
import {
  validateCreateIssuePayload,
  validateUpdateIssuePayload
} from "../utils/validation";

/**
 * GET /api/issues
 * List issues with optional query filters: `search`, `status`, `severity`.
 * - 200: JSON array of issues
 * - 500: Internal error
 */
export async function getIssues(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, status, severity } = req.query;

    const filters = {
      search: typeof search === "string" ? search : undefined,
      status: typeof status === "string" ? (status as any) : undefined,
      severity: typeof severity === "string" ? (severity as any) : undefined
    };

    const issues = await issuesService.listIssues(filters);
    res.json(issues);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/issues/:id
 * Fetch a single issue by numeric id.
 * - 200: Issue JSON
 * - 400: id is not a number
 * - 404: not found
 */
export async function getIssueById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be a number" });
      return;
    }

    const issue = await issuesService.getIssue(id);
    if (!issue) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }

    res.json(issue);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/issues
 * Create a new issue.
 * - 201: Created issue JSON
 * - 400: validation error
 */
export async function createIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const error = validateCreateIssuePayload(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const issue = await issuesService.createIssue(req.body);
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/issues/:id
 * Update selected fields of an issue.
 * - 200: Updated issue JSON
 * - 400: invalid id or payload
 * - 404: not found
 */
export async function updateIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be a number" });
      return;
    }

    const error = validateUpdateIssuePayload(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const updated = await issuesService.updateIssue(id, req.body);
    if (!updated) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/issues/:id
 * Delete an issue by id.
 * - 204: deleted
 * - 400: invalid id
 * - 404: not found
 */
export async function deleteIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be a number" });
      return;
    }

    const deleted = await issuesService.deleteIssue(id);
    if (!deleted) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// PATCH /api/issues/:id/resolve
export async function resolveIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be a number" });
      return;
    }

    const resolved = await issuesService.resolveIssue(id);
    if (!resolved) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }

    res.json(resolved);
  } catch (err) {
    next(err);
  }
}

// GET /api/issues/dashboard
export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await issuesService.getDashboardSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

// POST /api/issues/import (multipart/form-data)
export async function importCsv(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // multer provides `req.file` when using upload.single("file")
    const file: any = (req as any).file;

    if (!file || !file.buffer) {
      res.status(400).json({ error: "file is required" });
      return;
    }

    // Optional: basic mimetype check
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/csv",
      "text/plain"
    ];
    if (file.mimetype && !allowedTypes.includes(file.mimetype)) {
      console.warn(`Unexpected CSV mimetype: ${file.mimetype}`);
    }

    const result = await issuesService.importIssuesFromCsvBuffer(file.buffer);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Import issues from a CSV text payload.
 * Expects { csvText: string } in the request body.
 */
export async function importFromCsv(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { csvText } = req.body;

    if (!csvText || typeof csvText !== "string") {
      return res
        .status(400)
        .json({ error: "csvText is required and must be a string" });
    }

    const importedIssues = await issuesService.importIssuesFromCsv(csvText);

    return res.status(201).json({
      importedCount: importedIssues.length,
      issues: importedIssues
    });
  } catch (error) {
    next(error);
  }
}