import { Router } from "express";
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
import { importIssuesFromCsv } from "../services/issuesService";

const router = Router();

// /api/issues
router.get("/", getIssues);
router.get("/dashboard", getDashboard);
router.get("/:id", getIssueById);
router.post("/", createIssue);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);
router.patch("/:id/resolve", resolveIssue);
router.post("/import-csv", importCsv);

export default router;
