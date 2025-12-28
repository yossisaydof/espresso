import { useEffect, useState } from "react";

const EMPTY_FORM = {
    title: "",
    description: "",
    site: "",
    severity: "minor",
    status: "open"
};

function IssueForm({ mode, initialIssue, onSubmit, onCancel, isSubmitting }) {
    // Local state for the form values
    const [formValues, setFormValues] = useState(EMPTY_FORM);

    // When mode or initialIssue changes, update the form values
    useEffect(() => {
        if (mode === "edit" && initialIssue) {
            setFormValues({
                title: initialIssue.title || "",
                description: initialIssue.description || "",
                site: initialIssue.site || "",
                severity: initialIssue.severity || "minor",
                status: initialIssue.status || "open"
            });
        } else if (mode === "create") {
            setFormValues(EMPTY_FORM);
        }
    }, [mode, initialIssue]);

    // Handle changes of a single form field
    function handleChange(event) {
        const { name, value } = event.target;
        setFormValues((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    // Handle form submit
    async function handleSubmit(event) {
        event.preventDefault();
        // Let the parent handle the actual create/update logic
        await onSubmit(formValues);
    }

    const titleText = mode === "edit" ? "Edit Issue" : "Create New Issue";

    return (
        <div className="section">
            <h2 className="section-title">{titleText}</h2>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="column">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            value={formValues.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="column">
                        <label htmlFor="site">Site</label>
                        <input
                            id="site"
                            name="site"
                            type="text"
                            value={formValues.site}
                            onChange={handleChange}
                        />
                        <p className="helper-text">
                            Optional: site name or code where the issue was found.
                        </p>
                    </div>
                </div>

                <div className="section">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        value={formValues.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="column">
                        <label htmlFor="severity">Severity *</label>
                        <select
                            id="severity"
                            name="severity"
                            value={formValues.severity}
                            onChange={handleChange}
                        >
                            <option value="minor">Minor</option>
                            <option value="major">Major</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div className="column">
                        <label htmlFor="status">Status *</label>
                        <select
                            id="status"
                            name="status"
                            value={formValues.status}
                            onChange={handleChange}
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                    <button type="submit" disabled={isSubmitting}>
                        {mode === "edit" ? "Save changes" : "Create issue"}
                    </button>

                    {mode === "edit" && (
                        <button
                            type="button"
                            className="secondary"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default IssueForm;
