import { useEffect, useState } from "react";
import {
    getIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    resolveIssue,
    importIssuesFromCsv
} from "../api/issuesApi.js";

import IssueFilters from "../components/IssueFilters.jsx";
import IssueForm from "../components/IssueForm.jsx";
import IssuesTable from "../components/IssuesTable.jsx";
import DashboardSummary from "../components/DashboardSummary.jsx";
import ImportCsvSection from "../components/ImportCsvSection.jsx";

function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [severityFilter, setSeverityFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formMode, setFormMode] = useState("create");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState(null);

    useEffect(() => {
        async function fetchIssues() {
            try {
                setLoading(true);
                setError("");
                const data = await getIssues({
                    search: searchTerm,
                    status: statusFilter,
                    severity: severityFilter
                });
                setIssues(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load issues");
            } finally {
                setLoading(false);
            }
        }

        fetchIssues();
    }, [searchTerm, statusFilter, severityFilter]);

    function handleClearFilters() {
        setSearchTerm("");
        setStatusFilter("");
        setSeverityFilter("");
    }

    function handleEditIssue(issue) {
        setFormMode("edit");
        setSelectedIssue(issue);
    }

    function handleCancelEdit() {
        setFormMode("create");
        setSelectedIssue(null);
    }

    async function handleDeleteIssue(issue) {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete issue #${issue.id}?`
        );
        if (!confirmDelete) {
            return;
        }

        try {
            setIsSubmitting(true);
            await deleteIssue(issue.id);
            setIssues((previous) =>
                previous.filter((item) => item.id !== issue.id)
            );
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to delete issue");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleResolveIssue(issue) {
        try {
            setIsSubmitting(true);
            const updated = await resolveIssue(issue.id);
            setIssues((previous) =>
                previous.map((item) => (item.id === issue.id ? updated : item))
            );
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to resolve issue");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSubmitForm(formValues) {
        try {
            setIsSubmitting(true);

            if (formMode === "create") {
                const created = await createIssue(formValues);
                setIssues((previous) => [created, ...previous]);
            } else if (formMode === "edit" && selectedIssue) {
                const updated = await updateIssue(selectedIssue.id, formValues);
                setIssues((previous) =>
                    previous.map((item) =>
                        item.id === selectedIssue.id ? updated : item
                    )
                );
                setFormMode("create");
                setSelectedIssue(null);
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to save issue");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleImportCsv(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsImporting(true);
            setImportError(null);

            const importedIssues = await importIssuesFromCsv(file);
            console.log("Imported issues:", importedIssues);

            alert(`Imported ${importedIssues.length} issues successfully`);

            event.target.value = "";
        } catch (err) {
            console.error(err);
            setImportError(err.message || "Import failed");
        } finally {
            setIsImporting(false);
        }
    }


    return (
        <div>
            {/* Dashboard summary */}
            <DashboardSummary />

            {/* CSV import section */}
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Import issues from CSV:{" "}
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportCsv}
                        disabled={isImporting}
                    />
                </label>
                {isImporting && <p>Importing CSV...</p>}
                {importError && <p style={{ color: "red" }}>{importError}</p>}
            </div>

            {/* Filters section */}
            <IssueFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                severityFilter={severityFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onSeverityChange={setSeverityFilter}
                onClearFilters={handleClearFilters}
            />

            {/* Loading and error messages */}
            {loading && <p>Loading issues...</p>}
            {error && <p className="error-text">{error}</p>}

            {/* Form for create / edit */}
            <IssueForm
                mode={formMode}
                initialIssue={selectedIssue}
                onSubmit={handleSubmitForm}
                onCancel={handleCancelEdit}
                isSubmitting={isSubmitting}
            />

            {/* Table with issues */}
            <IssuesTable
                issues={issues}
                onEdit={handleEditIssue}
                onResolve={handleResolveIssue}
                onDelete={handleDeleteIssue}
            />
        </div>
    );
}

export default IssuesPage;
