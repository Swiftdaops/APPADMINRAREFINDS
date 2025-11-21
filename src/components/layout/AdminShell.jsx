import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
// Use relative path for the new component
// Adjust store import path and usage
import { useAdminAppStore } from "@/store/adminAppStore";
import { useTheme } from "@/components/theme-provider";

// --- Placeholder Components matching shadcn/ui contract for stability ---
// Defined here temporarily until the user confirms their shadcn setup
const Button = ({ children, onClick, size, variant, className = '' }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ';
  
  if (variant === 'outline') {
    baseClasses += 'bg-transparent border hover:bg-slate-800 text-slate-50 border-slate-700 hover:border-slate-600';
  } else {
    baseClasses += 'bg-emerald-600 text-white hover:bg-emerald-700';
  }

  let sizeClasses = 'h-10 px-4 py-2';
  if (size === 'sm') {
    sizeClasses = 'h-8 px-3 py-1';
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${sizeClasses} ${className}`}>
      {children}
    </button>
  );
};
// ------------------------------------------------------------------------

/**
 * AdminShell: The main layout component for all protected routes, 
 * integrating the sidebar, mobile header, and page transition wrapper.
 */
export default function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const admin = useAdminAppStore((s) => s.admin);
  const logout = useAdminAppStore((s) => s.logout);
  const { theme, setTheme } = useTheme();
  const displayName =
    admin?.username || "Paul"; // Default to Paul if admin user is null

  const SidebarContent = () => (
    <>
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/40" />
        <div>
          <p className="text-xs font-semibold tracking-tight">JOHNBOOKS Admin</p>
          <p className="text-[10px] text-slate-400">Super admin: {displayName}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 text-xs">
        <NavLink
          to="/"
          end
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `block rounded-2xl px-3 py-2 transition-colors duration-150 ${
              isActive
                ? "bg-slate-800 text-emerald-300 border border-slate-700"
                : "text-slate-300 hover:bg-slate-900"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/owners"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `block rounded-2xl px-3 py-2 transition-colors duration-150 ${
              isActive
                ? "bg-slate-800 text-emerald-300 border border-slate-700"
                : "text-slate-300 hover:bg-slate-900"
            }`
          }
        >
          Owners & Authors
        </NavLink>
        <NavLink
          to="/books"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `block rounded-2xl px-3 py-2 transition-colors duration-150 ${
              isActive
                ? "bg-slate-800 text-emerald-300 border border-slate-700"
                : "text-slate-300 hover:bg-slate-900"
            }`
          }
        >
          All Ebooks
        </NavLink>
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `block rounded-2xl px-3 py-2 transition-colors duration-150 ${
              isActive
                ? "bg-slate-800 text-emerald-300 border border-slate-700"
                : "text-slate-300 hover:bg-slate-900"
            }`
          }
        >
          Settings
        </NavLink>
      </nav>

      <div className="mt-4 space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 rounded-2xl border-slate-700 text-[11px] w-full"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Switch to light" : "Switch to dark"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setMobileOpen(false);
            logout();
          }}
          className="h-8 rounded-2xl border-slate-700 text-[11px] w-full"
        >
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div
      className={`flex min-h-screen ${
        theme === "light" ? "card text-stone-950" : "bg-slate-950 text-slate-50"
      }`}
    >
      {/* Desktop sidebar (hidden on small screens) */}
      <aside className="hidden w-56 flex-col border-r border-slate-800 bg-slate-950/90 px-3 py-4 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative left-0 top-0 h-full w-64 overflow-auto border-r border-slate-800 bg-slate-950/95 p-4">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (for mobile + info) */}
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-transparent text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-50">JOHNBOOKS Admin</p>
                <p className="text-[10px] text-slate-400">Hi, {displayName}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-2xl border-slate-700 text-[11px]"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}