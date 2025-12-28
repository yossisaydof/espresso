// This component displays a table of issues and shows basic actions:
// edit, resolve and delete. It does not call the backend directly.
// Instead, it calls callback functions provided by the parent.

function IssuesTable({ issues, onEdit, onResolve, onDelete }) {
    return (
        <div className="section">
            <h2 className="section-title">Issues</h2>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Site</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {issues.length === 0 ? (
                            <tr>
                                <td colSpan="8">No issues found.</td>
                            </tr>
                        ) : (
                            issues.map((issue) => (
                                <tr key={issue.id}>
                                    <td>{issue.id}</td>
                                    <td>{issue.title}</td>
                                    <td>{issue.site || "-"}</td>
                                    <td>
                                        <span className={`badge severity-${issue.severity}`}>
                                            {issue.severity}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge status-${issue.status}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td>
                                        {issue.createdAt
                                            ? new Date(issue.createdAt).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td>
                                        {issue.updatedAt
                                            ? new Date(issue.updatedAt).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <button type="button" onClick={() => onEdit(issue)}>
                                                Edit
                                            </button>

                                            {issue.status !== "resolved" && (
                                                <button
                                                    type="button"
                                                    className="secondary"
                                                    onClick={() => onResolve(issue)}
                                                >
                                                    Resolve
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="secondary"
                                                onClick={() => onDelete(issue)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IssuesTable;
