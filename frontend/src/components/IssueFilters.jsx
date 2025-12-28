// This component displays filters for searching issues by title,
// status and severity. It does not manage data itself,
// it only calls callback functions provided by the parent.

function IssueFilters({
    searchTerm,
    statusFilter,
    severityFilter,
    onSearchChange,
    onStatusChange,
    onSeverityChange,
    onClearFilters
}) {
    return (
        <div className="section">
            <h2 className="section-title">Filters</h2>

            <div className="row">
                <div className="column">
                    <label htmlFor="search">Search by title</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>

                <div className="column">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        <option value="">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                <div className="column">
                    <label htmlFor="severity">Severity</label>
                    <select
                        id="severity"
                        value={severityFilter}
                        onChange={(event) => onSeverityChange(event.target.value)}
                    >
                        <option value="">All</option>
                        <option value="minor">Minor</option>
                        <option value="major">Major</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            <div style={{ marginTop: "8px" }}>
                <button type="button" className="secondary" onClick={onClearFilters}>
                    Clear filters
                </button>
            </div>
        </div>
    );
}

export default IssueFilters;
