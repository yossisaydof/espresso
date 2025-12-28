import { Issue } from "../types/issue";

// Shape of the result after importing CSV
export interface CsvImportResult {
    importedCount: number;
    errors: string[];
}

// Parse the CSV file and return Issue-like objects (before DB insert)
export async function parseIssuesCsv(filePath: string): Promise<Issue[]> {
    // TODO: read and parse CSV rows
    throw new Error("Not implemented");
}
