// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { Toaster } from "sonner";
import { useAdminAppStore } from "@/store/adminAppStore";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import AdminShell from "@/components/layout/AdminShell";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import OwnersApproval from "@/pages/OwnersApproval";
import Books from "@/pages/Books";
import Settings from "@/pages/Settings";
import PageTransitionWrapper from "@/components/layout/PageTransitionWrapper";
import Bookstores from "@/pages/Bookstores";
import { ThemeProvider } from "@/components/theme-provider";

function AppThemeListener() {
  const fetchTheme = useAdminSettingsStore((s) => s.fetchTheme);
  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);
  return null;
}

function RequireAdminWrapper({ children }) {
  const navigate = useNavigate();
  const { admin, authLoading, checkSession } = useAdminAppStore();

  useEffect(() => {
    if (!admin) {
      (async () => {
        const me = await checkSession();
        if (!me) {
          navigate("/login", {
            replace: true,
            state: { message: "Please log in as app admin." },
          });
        }
      })();
    }
  }, [admin, checkSession, navigate]);

  if (authLoading && !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!admin) return null;
  return children;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppThemeListener />
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <PageTransitionWrapper>
          <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <RequireAdminWrapper>
                <AdminShell />
              </RequireAdminWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="owners" element={<OwnersApproval />} />
            <Route path="bookstores" element={<Bookstores />} />
            <Route path="books" element={<Books />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransitionWrapper>
      </BrowserRouter>
    </ThemeProvider>
  );
}
