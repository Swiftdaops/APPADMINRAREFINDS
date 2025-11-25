// src/api/httpClient.js
import axios from "axios";

// Default to the admin-only backend. Support both VITE_API_BASE_URL and legacy VITE_API_URL.
const rawEnvBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
let baseURL = rawEnvBase || "http://localhost:5000";
// Normalize localhost to http to avoid SSL protocol errors when someone sets
// `https://localhost:5000` by mistake (local dev usually doesn't have TLS).
if (rawEnvBase && rawEnvBase.includes("localhost")) {
  baseURL = rawEnvBase.replace(/^https:\/\//i, "http://");
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

if (import.meta.env.DEV) {
  console.log("httpClient: using baseURL=", baseURL);
}
