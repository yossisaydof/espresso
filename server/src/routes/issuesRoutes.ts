import { Router } from "express";
import multer from "multer";
import {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
    resolveIssue,
    getDashboard,
    importCsv
} from "../controllers/issuesController";

/**
 * Issues routes
 *
 * Base path: `/api/issues`
 *
 * Exposes CRUD endpoints, a dashboard summary, and a multipart CSV import.
 */
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// /api/issues
router.get("/", getIssues);
router.get("/dashboard", getDashboard);
router.get("/:id", getIssueById);
router.post("/", createIssue);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);
router.patch("/:id/resolve", resolveIssue);
router.post("/import-csv", upload.single("file"), importCsv);

export default router;
