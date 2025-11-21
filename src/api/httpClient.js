// src/api/httpClient.js
import axios from "axios";

// Default to the deployed backend. Override with `VITE_API_BASE_URL` in your
// environment for local development (e.g. VITE_API_BASE_URL=http://localhost:5000).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://rarefinds-1.onrender.com",
  withCredentials: true,
});
