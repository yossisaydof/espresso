import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./styles.css";

// Find the root DOM element in index.html
const rootElement = document.getElementById("root");

// Create a React root and render the App component inside it
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
