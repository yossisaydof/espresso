-- Database schema for Espresso – Issues Management System

-- Main issues table
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    site TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

-- Helpful indexes for common filters
CREATE INDEX IF NOT EXISTS idx_issues_status
    ON issues (status);

CREATE INDEX IF NOT EXISTS idx_issues_severity
    ON issues (severity);

CREATE INDEX IF NOT EXISTS idx_issues_site
    ON issues (site);

CREATE INDEX IF NOT EXISTS idx_issues_created_at
    ON issues (created_at);
