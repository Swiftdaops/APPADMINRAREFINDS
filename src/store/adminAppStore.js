// src/store/adminAppStore.js
import { create } from "zustand";
import { adminApi } from "@/api/adminApi";
import { toast } from "sonner";

export const useAdminAppStore = create((set, get) => ({
  admin: null,
  authLoading: false,

  owners: [],
  ownersLoading: false,

  ebooks: [],
  ebooksLoading: false,

  async checkSession() {
    set({ authLoading: true });
    try {
      const res = await adminApi.me();
      const admin = res.data?.admin || res.data;
      set({ admin, authLoading: false });
      return admin;
    } catch (err) {
      set({ admin: null, authLoading: false });
      return null;
    }
  },

  async login(username, password) {
    set({ authLoading: true });
    try {
      await adminApi.login({ username, password });
      const me = await get().checkSession();
      if (me) {
        toast.success(`Welcome back, ${me.username || "Admin"}.`);
      }
      return me;
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed.";
      toast.error(msg);
      set({ authLoading: false });
      throw err;
    }
  },

  async logout() {
    try {
      await adminApi.logout();
    } catch {}
    set({ admin: null });
    toast.success("Logged out.");
  },

  async loadOwners(status = "pending") {
    set({ ownersLoading: true });
    try {
      const res = await adminApi.listOwners(status);
      set({ owners: res.data || [], ownersLoading: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load owners.");
      set({ ownersLoading: false });
    }
  },

  async loadEbooks() {
    set({ ebooksLoading: true });
    try {
      const res = await adminApi.listEbooks();
      const ebooks = Array.isArray(res.data) ? res.data : res.data?.ebooks || [];
      set({ ebooks, ebooksLoading: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ebooks.");
      set({ ebooksLoading: false });
    }
  },
}));
