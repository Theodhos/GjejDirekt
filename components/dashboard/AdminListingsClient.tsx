"use client";

import React from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { ArrowLeft, Search } from "lucide-react";
import AdminListingActions from "@/components/admin/AdminListingActions";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminListingsClient({ groupedListings, categories, categoryFilter }: { groupedListings: Record<string, any[]>; categories: any[]; categoryFilter?: string }) {
  const { t } = useLanguage();

  return (
    <section className="page-shell py-6 sm:py-8">
      <div className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white flex flex-col">
        <div className="p-6 sm:p-8 border-b border-slate-100 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
                  <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Link>
                  <div>
                      <h1 className="text-3xl font-black text-slate-950">{t.admin.listings}</h1>
                      <p className="text-sm text-slate-500 mt-1">{t.admin.viewListings}</p>
                  </div>
              </div>
            <div className="flex flex-wrap gap-2">
                <Link href="/listings/add" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-brand-600 transition shadow-lg">
                    {t.common.explore}
                </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/admin/listings"
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${!categoryFilter ? 'bg-slate-950 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          {t.common.viewAll}
        </Link>
        {categories.map(c => (
          <Link
            key={c.value}
            href={`/admin/listings?category=${c.value}`}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${categoryFilter === c.value ? 'bg-slate-950 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {c.label}
          </Link>
        ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh] no-scrollbar">
          <div className="grid gap-10">
        {Object.entries(groupedListings).length ? (
          Object.entries(groupedListings).map(([category, catListings]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-black text-slate-950 capitalize">{category}</h2>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{catListings.length}</span>
              </div>

              <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                <div className="no-scrollbar">
                  {catListings.map((listing: any, idx: number) => (
                    <div
                      key={listing._id}
                      className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors ${idx !== 0 ? 'border-t border-slate-50' : ''}`}
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <SafeImage src={listing.images?.[0]} alt={listing.title} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-950 truncate">{listing.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{listing.subcategory || t.common.category}</span>
                          <span className="text-[10px] text-slate-300">·</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">{listing.location}</span>
                        </div>
                      </div>

                      <span className={`hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${
                        listing.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : listing.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {listing.status}
                      </span>

                      <div className="flex-shrink-0">
                        <AdminListingActions id={listing._id} slug={listing.slug} title={listing.title} status={listing.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <Search className="w-8 h-8 text-slate-300 mb-4" />
            <h3 className="text-base font-black text-slate-950">{t.common.noResults}</h3>
            <p className="text-sm text-slate-500 mt-2">{t.common.tryAdjustSearch}</p>
            <Link href="/admin/listings" className="mt-6 text-sm font-black text-brand-600 hover:underline">{t.common.viewAll}</Link>
          </div>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}
