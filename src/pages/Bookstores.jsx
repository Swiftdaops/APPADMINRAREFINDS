// src/pages/Bookstores.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Bookstores() {
  const [stores, setStores] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const loadStores = async (status = "all") => {
    setLoading(true);
    try {
      // If status is "all", call without filter, backend should return all owners
      const res =
        status === "all"
          ? await adminApi.listOwners()
          : await adminApi.listOwners(status);

      const owners = Array.isArray(res.data) ? res.data : [];
      setStores(owners);
    } catch (err) {
      console.error("Failed to load bookstores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores(statusFilter);
  }, [statusFilter]);

  const filteredLabel =
    statusFilter === "all" ? (
      <span className="text-stone-950">All bookstores</span>
    ) : statusFilter === "pending" ? (
      <span className="text-stone-950">Pending stores</span>
    ) : statusFilter === "approved" ? (
      <span className="text-stone-950">Approved stores</span>
    ) : (
      <span className="text-stone-950">Rejected stores</span>
    );

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Bookstores & Authors
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Full directory of every store that has registered on JOHNBOOKS.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-2xl border border-input px-2 text-[11px] text-stone-950"
          >
            <option value="all" className="text-stone-800">All statuses</option>
            <option value="pending" className="text-stone-800">Pending</option>
            <option value="approved" className="text-stone-800">Approved</option>
            <option value="rejected" className="text-stone-800">Rejected</option>
          </select>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-2xl text-[11px]"
            onClick={() => loadStores(statusFilter)}
          >
            Refresh
          </Button>
        </div>
      </header>

      <section className="rounded-3xl border border-border  text-card-foreground p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">{filteredLabel}</p>
          <p className="text-[10px] text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">
              {stores.length}
            </span>
          </p>
        </div>

        {loading ? (
          <div className="flex h-24 items-center justify-center text-[11px] text-muted-foreground">
            Loading bookstores…
          </div>
        ) : stores.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-[11px] text-muted-foreground">
            No bookstores found for this status.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stores.map((store) => (
              <div
                key={store._id}
                className="flex flex-col gap-2 rounded-3xl border border-border card dark:bg-stone-950 p-3 text-xs shadow-sm"
              >
                {/* Header: Store name + status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {store.storeName || "Unnamed store"}
                    </p>
                    <p className="text-[11px] text-muted-foreground text-stone-950">
                      Owner: {store.name || "Unknown owner"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {store.email}
                    </p>
                  </div>
                  <Badge
                    className={
                      store.status === "approved"
                        ? "bg-emerald-600/80 text-[10px] text-stone-950"
                        : store.status === "rejected"
                        ? "bg-rose-600/80 text-[10px] text-stone-950"
                        : "bg-amber-500/80 text-[10px] text-stone-950"
                    }
                  >
                    {store.status}
                  </Badge>
                </div>

                {/* Bio / description */}
                {store.bio && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {store.bio}
                  </p>
                )}

                {/* Contact + meta */}
                <div className="mt-1 space-y-1 text-[10px] text-muted-foreground">
                  {store.whatsappNumber && (
                    <p>
                      WhatsApp: {" "}
                      <span className="text-foreground">
                        {store.whatsappNumber}
                      </span>
                    </p>
                  )}
                  {store.createdAt && (
                    <p>
                      Joined: {" "}
                      <span className="text-foreground">
                        {new Date(store.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {store.approvedAt && store.status === "approved" && (
                    <p>
                      Approved: {" "}
                      <span className="text-foreground">
                        {new Date(store.approvedAt).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
