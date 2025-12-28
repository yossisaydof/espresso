const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

/**
 * Make a HTTP request to the backend API.
 * @param {string} path - API path, for example "/issues".
 * @param {RequestInit} options - fetch options (method, headers, body, etc.).
 * @returns {Promise<any>} - Parsed JSON response or null.
 */
export async function apiRequest(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        if (isJson) {
            try {
                const body = await response.json();
                if (body && body.error) {
                    message = body.error;
                }
            } catch {
            }
        }

        throw new Error(message);
    }

    if (!isJson) {
        return null;
    }

    return response.json();
}
