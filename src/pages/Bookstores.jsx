// src/pages/Bookstores.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Bookstores() {
  const [stores, setStores] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // 'approvedRejected' custom option
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadStores = async (status = "all") => {
    setLoading(true);
    try {
      // Fetch all if we need combined statuses
      let res;
      if (status === "all" || status === "approvedRejected") {
        res = await adminApi.listOwners();
      } else {
        res = await adminApi.listOwners(status);
      }
      let owners = Array.isArray(res.data) ? res.data : [];
      if (status === 'approvedRejected') {
        owners = owners.filter(o => o.status === 'approved' || o.status === 'rejected');
      }
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

  const filteredLabel = (() => {
    switch (statusFilter) {
      case 'all': return <span>All bookstores</span>;
      case 'pending': return <span>Pending stores</span>;
      case 'approved': return <span>Approved stores</span>;
      case 'rejected': return <span>Rejected stores</span>;
      case 'approvedRejected': return <span>Approved & Rejected stores</span>;
      default: return <span>Stores</span>;
    }
  })();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this owner permanently? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminApi.deleteOwner(id);
      setStores((prev) => prev.filter(o => o._id !== id));
    } catch (e) {
      console.error('Delete failed', e);
      alert(e?.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 app-theme card">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">
            Bookstores & Authors
          </h1>
          <p className="text-[11px]">
            Full directory of every store that has registered on JOHNBOOKS.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-2xl border px-2 text-[11px]"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved only</option>
            <option value="rejected">Rejected only</option>
            <option value="approvedRejected">Approved & Rejected</option>
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

      <section className="rounded-3xl border p-4 shadow-sm card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px]">{filteredLabel}</p>
          <p className="text-[10px]">
            Total:{" "}
            <span className="font-semibold">
              {stores.length}
            </span>
          </p>
        </div>

        {loading ? (
          <div className="flex h-24 items-center justify-center text-[11px]">
            Loading bookstores…
          </div>
        ) : stores.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-[11px]">
            No bookstores found for this status.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stores.map((store) => (
              <div
                key={store._id}
                className="flex flex-col gap-2 rounded-3xl border p-3 text-xs shadow-sm card"
              >
                {/* Header: Store name + status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {store.storeName || "Unnamed store"}
                    </p>
                    <p className="text-[11px]">
                      Owner: {store.name || "Unknown owner"}
                    </p>
                    <p className="text-[10px]">
                      {store.email}
                    </p>
                  </div>
                  <Badge
                    className="text-[10px]"
                  >
                    {store.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {store.status === 'pending' && (
                    <>
                      <Button size="xs" variant="outline" onClick={async () => { await adminApi.approveOwner(store._id); loadStores(statusFilter); }}>
                        Approve
                      </Button>
                      <Button size="xs" variant="destructive" onClick={async () => { await adminApi.rejectOwner(store._id); loadStores(statusFilter); }}>
                        Reject
                      </Button>
                    </>
                  )}
                  {(store.status === 'approved' || store.status === 'rejected') && (
                    <Button
                      size="xs"
                      variant="destructive"
                      disabled={deletingId === store._id}
                      onClick={() => handleDelete(store._id)}
                    >
                      {deletingId === store._id ? 'Deleting…' : 'Delete Owner'}
                    </Button>
                  )}
                </div>

                {/* Bio / description */}
                {store.bio && (
                  <p className="mt-1 text-[11px]">
                    {store.bio}
                  </p>
                )}

                {/* Contact + meta */}
                <div className="mt-1 space-y-1 text-[10px]">
                  {store.whatsappNumber && (
                    <p>
                      WhatsApp: {" "}
                      <span>
                        {store.whatsappNumber}
                      </span>
                    </p>
                  )}
                  {store.createdAt && (
                    <p>
                      Joined: {" "}
                      <span>
                        {new Date(store.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {store.approvedAt && store.status === "approved" && (
                    <p>
                      Approved: {" "}
                      <span>
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
