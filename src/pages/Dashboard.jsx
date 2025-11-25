// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/api/adminApi";
import { useAdminAppStore } from "@/store/adminAppStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const admin = useAdminAppStore((s) => s.admin);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEbooks: 0,
    totalOwners: 0,
    pendingOwners: 0,
    approvedOwners: 0,
  });
  const [recentEbooks, setRecentEbooks] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Load ebooks
        const ebooksRes = await adminApi.listEbooks();
        const ebooks = Array.isArray(ebooksRes.data)
          ? ebooksRes.data
          : ebooksRes.data?.ebooks || [];

        // Load all owners (no status filter)
        const ownersRes = await adminApi.listOwners();
        const owners = Array.isArray(ownersRes.data) ? ownersRes.data : [];

        if (!mounted) return;

        const pendingOwners = owners.filter(
          (o) => o.status === "pending"
        ).length;
        const approvedOwners = owners.filter(
          (o) => o.status === "approved"
        ).length;

        setStats({
          totalEbooks: ebooks.length,
          totalOwners: owners.length,
          pendingOwners,
          approvedOwners,
        });

        // Take 5 most recent ebooks (assuming createdAt)
        const sorted = [...ebooks].sort((a, b) => {
          const da = new Date(a.createdAt || 0).getTime();
          const db = new Date(b.createdAt || 0).getTime();
          return db - da;
        });
        setRecentEbooks(sorted.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const adminName =
    admin?.username ||
    import.meta.env.VITE_APPADMIN_DISPLAY_NAME ||
    "Admin";

  function formatPrice(price) {
    if (price == null) return "₦4000";
    if (typeof price === "number") return `₦${price}`;
    if (typeof price === "string") return price;
    if (typeof price === "object") {
      // support shape: { amount, currency }
      const amount = price.amount ?? price.value ?? price.amount_in_minor ?? 0;
      const currency = price.currency ?? "₦";
      // If currency looks like a symbol, prefix; otherwise show currency code then amount
      if (currency.length <= 2) return `${currency}${amount}`;
      return `${currency} ${amount}`;
    }
    return String(price);
  }

  return (
    <div className="space-y-5 app-theme card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">
            Welcome back, {adminName}
          </h1>
          <p className="text-[11px]">
            High-level overview of JOHNBOOKS sellers and ebooks.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border p-3 card"
        >
          <p className="text-[11px]">Total ebooks</p>
          <p className="mt-1 text-xl font-semibold">
            {loading ? "…" : stats.totalEbooks}
          </p>
          <p className="mt-1 text-[10px]">
            All titles currently listed across all stores.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border p-3 card"
        >
          <p className="text-[11px]">Total stores</p>
          <p className="mt-1 text-xl font-semibold">
            {loading ? "…" : stats.totalOwners}
          </p>
          <p className="mt-1 text-[10px]">
            Approved + pending bookstore owners and authors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border p-3 card"
        >
          <p className="text-[11px]">Pending approvals</p>
          <p className="mt-1 text-xl font-semibold">
            {loading ? "…" : stats.pendingOwners}
          </p>
          <p className="mt-1 text-[10px]">
            Sellers waiting for review. Approve them from the{" "}
            <span>Owners</span> tab.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl border p-3 card"
        >
          <p className="text-[11px]">Approved stores</p>
          <p className="mt-1 text-xl font-semibold">
            {loading ? "…" : stats.approvedOwners}
          </p>
          <p className="mt-1 text-[10px]">
            Active sellers whose books appear in public search.
          </p>
        </motion.div>
      </div>

      {/* Recent ebooks */}
      <section className="rounded-3xl border p-4 card">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">
              Recent ebooks
            </h2>
            <p className="text-[11px]">
              Latest titles added by your sellers.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-2xl text-[11px]"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex h-24 items-center justify-center text-[11px]">
            Loading ebooks…
          </div>
        ) : recentEbooks.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-[11px]">
            No ebooks yet. Once sellers start uploading, you’ll see them here.
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {recentEbooks.map((book) => {
              const owner = book.owner || book.storeOwner || {};
              return (
                <div
                  key={book._id}
                  className="flex items-start justify-between gap-3 rounded-2xl border px-3 py-2 card"
                >
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">
                      {book.title}
                    </p>
                    <p className="text-[11px]">
                      {book.author || "Unknown author"}
                    </p>
                    <p className="mt-1 text-[10px] line-clamp-2">
                      {book.description || "No description"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-semibold">
                      {formatPrice(book.price)}
                    </span>
                    {owner.storeName && (
                      <Badge className="text-[9px]">
                        {owner.storeName}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
