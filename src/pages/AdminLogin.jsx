// src/pages/AdminLogin.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAppStore } from "@/store/adminAppStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAdminAppStore((s) => s.login);

  const onSubmit = async (values) => {
    try {
      await login(values.username, values.password);
      navigate("/", { replace: true });
    } catch {
      // error handled by store toast
    }
  };

  const displayName =
    import.meta.env.VITE_APPADMIN_DISPLAY_NAME || "Admin";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 app-theme">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl backdrop-blur-xl card"
      >
        <div className="mb-5 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]">
            JOHNBOOKS Admin
          </p>
          <h1 className="mt-1 text-xl font-semibold">
            Sign in as {displayName}
          </h1>
          {location.state?.message && (
            <p className="mt-2 text-[11px]">
              {location.state.message}
            </p>
          )}
          <p className="mt-1 text-[11px]">
            This area is for the main app admin only.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              Username
            </label>
            <Input
              type="text"
              placeholder="Admin username"
              className="h-9 rounded-2xl px-3"
              {...register("username", { required: true })}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-9 rounded-2xl px-3"
              {...register("password", { required: true })}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-9 w-full rounded-2xl font-semibold shadow-lg hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
