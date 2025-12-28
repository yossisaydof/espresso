import { useState } from "react";

function ImportCsvSection({ onImport, isImporting }) {
  // Local state for the selected file and messages
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle file selection from the input
  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setError("");
    setSuccessMessage("");
  }

  // Read the file as text and pass it to the parent
  async function handleImportClick() {
    if (!file) {
      setError("Please choose a CSV file first.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const text = await readFileAsText(file);
      await onImport(text);
      setSuccessMessage("Import completed successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to import CSV file.");
    }
  }

  // Helper: read a File object as text
  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("Unexpected file reader result"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }

  return (
    <div className="section">
      <h2 className="section-title">Import Issues from CSV</h2>

      <div className="row">
        <div className="column">
          <label htmlFor="csv-file">Choose CSV file</label>
          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
          />
          <p className="helper-text">
            The CSV file should include at least: title, description, severity.
          </p>
        </div>

        <div className="column" style={{ alignSelf: "flex-end" }}>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
          >
            {isImporting ? "Importing..." : "Import CSV"}
          </button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default ImportCsvSection;
