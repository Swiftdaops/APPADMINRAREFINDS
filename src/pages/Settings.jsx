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
    <div className="space-y-4 app-theme card">
      <header>
        <h1 className="text-base font-semibold">
          Settings
        </h1>
        <p className="text-[11px]">
          Manage your JOHNBOOKS admin profile and session.
        </p>
      </header>

      {/* Profile card */}
      <section className="rounded-3xl border p-4 shadow-md">
        <h2 className="text-sm font-semibold">
          Admin profile
        </h2>
        <p className="mt-1 text-[11px]">
          This dashboard is reserved for the main app administrator.
        </p>

        <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
          <div className="space-y-1">
            <p>Signed in as</p>
            <p className="text-sm font-semibold">
              {adminName}
            </p>
          </div>

          <div className="space-y-1">
            <p>Role</p>
            <p className="text-sm font-semibold">
              Super Admin
            </p>
          </div>
        </div>
      </section>

      {/* Global App Theme */}
      <section className="rounded-3xl border p-4 shadow-md">
        <h2 className="text-sm font-semibold">
          Global App Theme
        </h2>
        <p className="mt-1 text-[11px]">
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
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Session card */}
      <section className="rounded-3xl border p-4 shadow-md">
        <h2 className="text-sm font-semibold">
          Session & security
        </h2>
        <p className="mt-1 text-[11px]">
          For security, always log out when you are done using this
          dashboard, especially on shared devices.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <Button
            type="button"
            onClick={logout}
            className="h-8 rounded-2xl px-4 text-[11px] font-semibold shadow-md"
          >
            Log out of admin session
          </Button>
          <span className="text-[10px]">
            This will clear your admin cookie and require login next time.
          </span>
        </div>
      </section>
    </div>
  );
}
