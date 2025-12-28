import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/issuesApi.js";

function DashboardSummary() {
    // Local state for summary data, loading and error
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load dashboard data once when the component mounts
    useEffect(() => {
        async function fetchSummary() {
            try {
                setLoading(true);
                setError("");
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, []);

    return (
        <div className="section">
            <h2 className="section-title">Dashboard</h2>

            {loading && <p>Loading dashboard...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && summary && (
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <div className="dashboard-card-title">Open</div>
                        <div className="dashboard-card-value">
                            {summary.statusCounts.open}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-title">In Progress</div>
                        <div className="dashboard-card-value">
                            {summary.statusCounts.in_progress}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-title">Resolved</div>
                        <div className="dashboard-card-value">
                            {summary.statusCounts.resolved}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-title">Minor</div>
                        <div className="dashboard-card-value">
                            {summary.severityCounts.minor}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-title">Major</div>
                        <div className="dashboard-card-value">
                            {summary.severityCounts.major}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-title">Critical</div>
                        <div className="dashboard-card-value">
                            {summary.severityCounts.critical}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardSummary;
