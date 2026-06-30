"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { useLanguage } from "@/context/LanguageContext";

const PAGE_SIZE = 8;

const copy = {
  al: {
    loading: "Duke kerkuar sherbime...",
    noResultsTitle: "Nuk u gjet asnje rezultat",
    noResultsDescription:
      "Nuk gjetem sherbime qe perputhen me filtrat tuaj. Provoni te ndryshoni kriteret e kerkimit.",
    prev: "Para",
    next: "Tjetra",
    pageOf: (a: number, b: number) => `Faqja ${a} nga ${b}`
  },
  en: {
    loading: "Finding services...",
    noResultsTitle: "No results found",
    noResultsDescription:
      "We couldn't find any services matching your filters. Try adjusting your search criteria.",
    prev: "Prev",
    next: "Next",
    pageOf: (a: number, b: number) => `Page ${a} of ${b}`
  }
};

export default function ListingGrid() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const text = copy[language];
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const query = searchParams?.toString() || "";
        const res = await fetch(`/api/listings?${query}`);
        const data = await res.json();

        // Keep the server's package-tier ranking intact (no shuffling).
        setListings(data.listings || []);
        setPage(1);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{text.loading}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-8">
            <Inbox className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-950 mb-4">{text.noResultsTitle}</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          {text.noResultsDescription}
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = listings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-10">
        <div className="grid gap-8 sm:grid-cols-2">
            {visible.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>

        {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {text.prev}
                </button>

                <span className="px-2 text-sm font-bold text-slate-600">{text.pageOf(currentPage, totalPages)}</span>

                <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700"
                >
                    {text.next}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        )}
    </div>
  );
}
