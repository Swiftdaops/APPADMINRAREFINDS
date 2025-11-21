// src/api/adminApi.js
import { api } from "./httpClient";

export const adminApi = {
  // AppAdmin auth
  login: (data) => api.post("/api/appadmin/login", data),
  logout: () => api.post("/api/appadmin/logout"),
  me: () => api.get("/api/appadmin/me"),

  // Owners (bookstore owners)
  listOwners: (status) =>
    api.get("/api/appadmin/owners", {
      params: status ? { status } : {},
    }),
  approveOwner: (id) => api.put(`/api/appadmin/owners/${id}/approve`),
  rejectOwner: (id) => api.put(`/api/appadmin/owners/${id}/reject`),
  deleteOwner: (id) => api.delete(`/api/appadmin/owners/${id}`),

  // Ebooks
  listEbooks: () => api.get("/api/appadmin/ebooks"),

  // 🆕 THEME ENDPOINTS
  getTheme: () => api.get("/api/appadmin/settings/theme"),
  updateTheme: (themeMode) => api.post("/api/appadmin/settings/theme", { themeMode }),
};
