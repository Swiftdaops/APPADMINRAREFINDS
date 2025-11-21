// src/pages/Books.jsx
import React, { useEffect, useState } from "react";
import { useAdminAppStore } from "@/store/adminAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Books() {
  const { ebooks, ebooksLoading, loadEbooks } = useAdminAppStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEbooks();
  }, [loadEbooks]);

  const filtered = ebooks.filter((book) => {
    const q = search.toLowerCase();
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    const ownerName =
      (book.owner?.storeName || book.storeOwner?.storeName || "").toLowerCase();
    return (
      title.includes(q) || author.includes(q) || ownerName.includes(q)
    );
  });

  function formatPrice(price) {
    if (price == null) return "₦4000";
    if (typeof price === "number") return `₦${price}`;
    if (typeof price === "string") return price;
    if (typeof price === "object") {
      const amount = price.amount ?? price.value ?? price.amount_in_minor ?? 0;
      const currency = price.currency ?? "₦";
      if (currency.length <= 2) return `${currency}${amount}`;
      return `${currency} ${amount}`;
    }
    return String(price);
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-slate-50">
            All ebooks
          </h1>
          <p className="text-[11px] text-slate-400">
            Browse everything currently listed by your approved stores.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <input
            type="text"
            placeholder="Search by title, author, store…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 text-[11px] text-slate-50 placeholder:text-slate-500"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-2xl border-slate-700 text-[11px]"
            onClick={() => loadEbooks()}
          >
            Refresh
          </Button>
        </div>
      </header>

      {/* Table / list */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3 shadow-md shadow-slate-900/80">
        {ebooksLoading ? (
          <div className="flex h-24 items-center justify-center text-[11px] text-slate-400">
            Loading ebooks…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-[11px] text-slate-400">
            No ebooks match this search.
          </div>
        ) : (
          <div className="hidden text-xs text-slate-200 md:block">
            <div className="grid grid-cols-[2fr,1.2fr,1.2fr,0.8fr] gap-3 border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <div>Title</div>
              <div>Author</div>
              <div>Store</div>
              <div className="text-right">Price</div>
            </div>
            <div className="mt-2 space-y-1.5">
              {filtered.map((book) => {
                const owner = book.owner || book.storeOwner || {};
                return (
                  <div
                    key={book._id}
                    className="grid grid-cols-[2fr,1.2fr,1.2fr,0.8fr] items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/70 px-3 py-2"
                  >
                    <div>
                      <p className="text-[12px] font-medium text-slate-50 line-clamp-2">
                        {book.title}
                      </p>
                      {book.description && (
                        <p className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">
                          {book.description}
                        </p>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {book.author || "Unknown"}
                    </div>
                    <div className="flex flex-col gap-1">
                      {owner.storeName ? (
                        <Badge className="w-fit bg-slate-800 text-[9px] text-slate-100">
                          {owner.storeName}
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          No owner linked
                        </span>
                      )}
                      {owner.whatsappNumber && (
                        <span className="text-[10px] text-slate-500">
                          WhatsApp: {owner.whatsappNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-[11px] font-semibold text-emerald-400">
                      {formatPrice(book.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile list */}
        {!ebooksLoading && filtered.length > 0 && (
          <div className="space-y-2 text-xs text-slate-200 md:hidden">
            {filtered.map((book) => {
              const owner = book.owner || book.storeOwner || {};
              return (
                <div
                  key={book._id}
                  className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-50">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {book.author || "Unknown"}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {formatPrice(book.price)}
                    </span>
                  </div>
                  {book.description && (
                    <p className="mt-1 text-[10px] text-slate-500 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {owner.storeName && (
                      <Badge className="bg-slate-800 text-[9px] text-slate-100">
                        {owner.storeName}
                      </Badge>
                    )}
                    {owner.whatsappNumber && (
                      <span className="text-[10px] text-slate-500">
                        WhatsApp: {owner.whatsappNumber}
                      </span>
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
