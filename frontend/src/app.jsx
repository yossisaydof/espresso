// This is the root component of the app.
// It defines the basic layout and renders the main page.

import IssuesPage from "./pages/IssuesPage.jsx";

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Issues Manager</h1>
                <p className="app-subtitle">
                    Simple app to manage clinical trial issues
                </p>
            </header>

            <main className="app-main">
                {/* Render the main page that handles issues */}
                <IssuesPage />
            </main>
        </div>
    );
}

export default App;
