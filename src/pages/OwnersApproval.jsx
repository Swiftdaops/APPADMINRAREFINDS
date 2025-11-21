// src/pages/OwnersApproval.jsx
import React, { useEffect, useState } from "react";
import { useAdminAppStore } from "@/store/adminAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OwnersApproval() {
  const { owners, ownersLoading, loadOwners } = useAdminAppStore();
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    loadOwners(statusFilter);
  }, [statusFilter, loadOwners]);

  const handleRefresh = () => loadOwners(statusFilter);

  const store = useAdminAppStore.getState();

  const approve = async (id) => {
    try {
      await store.adminApi.approveOwner(id); // easier: just call adminApi directly
    } catch {}
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-50">
            Owners & Authors
          </h2>
          <p className="text-[11px] text-slate-400">
            Review signup requests from bookstores and authors.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-2xl border border-slate-700 bg-slate-950/80 px-2 text-[11px]"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-2xl border-slate-700 text-[11px]"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </header>

      <section>
        {ownersLoading ? (
          <div className="flex h-32 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300">
            Loading owners...
          </div>
        ) : owners.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 text-xs text-slate-400">
            No owners in this status.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {owners.map((owner) => (
              <div
                key={owner._id}
                className="flex flex-col gap-2 rounded-3xl border border-slate-800 bg-slate-900/70 p-3 text-xs shadow-md shadow-slate-900/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {owner.storeName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {owner.name} • {owner.email}
                    </p>
                  </div>
                  <Badge
                    className={
                      owner.status === "approved"
                        ? "bg-emerald-600/80 text-[10px]"
                        : owner.status === "rejected"
                        ? "bg-rose-600/80 text-[10px]"
                        : "bg-amber-500/80 text-[10px]"
                    }
                  >
                    {owner.status}
                  </Badge>
                </div>

                {owner.bio && (
                  <p className="text-[11px] text-slate-400">
                    {owner.bio}
                  </p>
                )}

                <p className="text-[11px] text-slate-500">
                  WhatsApp: {owner.whatsappNumber}
                </p>

                <div className="mt-2 flex gap-2">
                  {owner.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="h-8 flex-1 rounded-2xl bg-emerald-600 text-[11px] hover:bg-emerald-500"
                        onClick={async () => {
                          try {
                            await import("@/api/adminApi").then(({ adminApi }) =>
                              adminApi.approveOwner(owner._id)
                            );
                            await loadOwners(statusFilter);
                          } catch (err) {}
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 flex-1 rounded-2xl border-rose-600/70 text-[11px] text-rose-300 hover:bg-rose-600/20"
                        onClick={async () => {
                          try {
                            await import("@/api/adminApi").then(({ adminApi }) =>
                              adminApi.rejectOwner(owner._id)
                            );
                            await loadOwners(statusFilter);
                          } catch (err) {}
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {owner.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-2xl border-slate-700 text-[11px]"
                      onClick={handleRefresh}
                    >
                      Refresh status
                    </Button>
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
