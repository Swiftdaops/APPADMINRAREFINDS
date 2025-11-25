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
    baseClasses += 'bg-transparent border hover:bg-white/5 text-stone-800 dark:text-white border-stone-200 dark:border-stone-700 hover:border-stone-400';
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
      <div className="mb-6 flex items-center gap-2 px-2 card">
        <div className="h-8 w-8 rounded-2xl shadow-lg px-3 py-4" />
        <div>
          <p className="text-xs font-semibold tracking-tight">RAREFINDS WEB APP ADMIN</p>
          <p className="text-[10px]">Super admin: {displayName}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 text-xs">
        <NavLink
          to="/"
          end
          onClick={() => setMobileOpen(false)}
          className="block rounded-2xl px-3 py-2 transition-colors duration-150"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/owners"
          onClick={() => setMobileOpen(false)}
          className="block rounded-2xl px-3 py-2 transition-colors duration-150"
        >
          Owners & Authors
        </NavLink>
        <NavLink
          to="/books"
          onClick={() => setMobileOpen(false)}
          className="block rounded-2xl px-3 py-2 transition-colors duration-150"
        >
          All Ebooks
        </NavLink>
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className="block rounded-2xl px-3 py-2 transition-colors duration-150"
        >
          Settings
        </NavLink>
      </nav>

      <div className="mt-4 space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 rounded-2xl text-[11px] w-full"
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
          className="h-8 rounded-2xl text-[11px] w-full"
        >
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen app-theme">
      {/* Desktop sidebar (hidden on small screens) */}
      <aside className="hidden w-56 flex-col border-r px-3 py-4 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative left-0 top-0 h-full w-64 overflow-auto p-4 bg-white/30 dark:bg-black/40 backdrop-blur-md">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (for mobile + info) */}
        <header className="sticky top-0 z-10 border-b backdrop-blur-sm px-4 py-3 md:hidden card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <p className="text-sm font-semibold">RAREFINDS Admin</p>
                <p className="text-[10px]">Hi, {displayName}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-2xl text-[11px]"
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
