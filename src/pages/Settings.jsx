// src/pages/Settings.jsx
import React, { useEffect } from "react";
import { useAdminAppStore } from "@/store/adminAppStore";
import { useAdminSettingsStore } from "@/store/adminSettingsStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  const admin = useAdminAppStore((s) => s.admin);
  const logout = useAdminAppStore((s) => s.logout);
  
  const { themeMode, fetchTheme, updateTheme, loadingTheme } = useAdminSettingsStore();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const adminName =
    admin?.username ||
    import.meta.env.VITE_APPADMIN_DISPLAY_NAME ||
    "Admin";

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-base font-semibold text-slate-50">
          Settings
        </h1>
        <p className="text-[11px] text-slate-400">
          Manage your JOHNBOOKS admin profile and session.
        </p>
      </header>

      {/* Profile card */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-md shadow-slate-900/80">
        <h2 className="text-sm font-semibold text-slate-50">
          Admin profile
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          This dashboard is reserved for the main app administrator.
        </p>

        <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-slate-50">
              {adminName}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400">Role</p>
            <p className="text-sm font-semibold text-emerald-400">
              Super Admin
            </p>
          </div>
        </div>
      </section>

      {/* Global App Theme */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-md shadow-slate-900/80">
        <h2 className="text-sm font-semibold text-slate-50">
          Global App Theme
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          Set the default theme for the entire platform (Public App, Admin, Owner Dashboard).
        </p>

        <div className="mt-4">
          <RadioGroup 
            value={themeMode} 
            onValueChange={updateTheme}
            disabled={loadingTheme}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" className="border-slate-500 text-emerald-500" />
              <Label htmlFor="light" className="text-slate-300">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" className="border-slate-500 text-emerald-500" />
              <Label htmlFor="dark" className="text-slate-300">Dark</Label>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Session card */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-md shadow-slate-900/80">
        <h2 className="text-sm font-semibold text-slate-50">
          Session & security
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          For security, always log out when you are done using this
          dashboard, especially on shared devices.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <Button
            type="button"
            onClick={logout}
            className="h-8 rounded-2xl bg-emerald-500 px-4 text-[11px] font-semibold text-slate-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-400"
          >
            Log out of admin session
          </Button>
          <span className="text-[10px] text-slate-500">
            This will clear your admin cookie and require login next time.
          </span>
        </div>
      </section>
    </div>
  );
}
