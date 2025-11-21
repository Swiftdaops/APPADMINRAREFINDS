// src/api/adminApi.js
import { api } from "./httpClient";

export const adminApi = {
  login: (data) => api.post("/api/admin/login", data),
  logout: () => api.post("/api/admin/logout"),
  me: () => api.get("/api/admin/me"),

  // Owners (bookstore owners)
  listOwners: (status) =>
    api.get("/api/admin/owners", {
      params: status ? { status } : {},
    }),
  approveOwner: (id) => api.patch(`/api/admin/owners/${id}/approve`),
  rejectOwner: (id) => api.patch(`/api/admin/owners/${id}/reject`),

  // Ebooks
  listEbooks: () => api.get("/api/ebooks"),

  // 🆕 THEME ENDPOINTS
  getTheme: () => api.get("/api/app-settings/theme"),
  updateTheme: (themeMode) => api.put("/api/admin/app-settings/theme", { themeMode }),
};
