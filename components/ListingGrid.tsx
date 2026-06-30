"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { useLanguage } from "@/context/LanguageContext";

const ITEMS_PER_VIEW = 4;

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

  const totalPages = Math.max(1, Math.ceil(listings.length / ITEMS_PER_VIEW));
  const currentPage = Math.min(page, totalPages);
  // Always show the navigation arrows, even when there is only a single card /
  // one page — the arrows for the boundary direction simply stay disabled.
  const hasArrows = true;

  // Group listings into slides of ITEMS_PER_VIEW so the track shifts one full
  // viewport per arrow click — the section height stays fixed at a single row.
  const slides: any[][] = [];
  for (let i = 0; i < listings.length; i += ITEMS_PER_VIEW) {
    slides.push(listings.slice(i, i + ITEMS_PER_VIEW));
  }

  const arrowClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700";

  return (
    <div className="space-y-5">
        {/* Mobile: every card stacked full-width, no carousel */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
            {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>

        {/* Tablet/Desktop: 2x2 carousel navigated with arrows */}
        <div className="hidden items-center gap-3 sm:flex sm:gap-4">
            {hasArrows && (
                <button
                    type="button"
                    aria-label={text.prev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={arrowClass}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}

            <div className="relative flex-1 overflow-hidden">
                <div
                    className="flex items-start transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
                >
                    {slides.map((group, idx) => (
                        <div key={idx} className="grid w-full shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                            {group.map((listing) => (
                                <ListingCard key={listing._id} listing={listing} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {hasArrows && (
                <button
                    type="button"
                    aria-label={text.next}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={arrowClass}
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            )}
        </div>

        {totalPages > 1 && (
            <p className="hidden text-center text-sm font-bold text-slate-600 sm:block">{text.pageOf(currentPage, totalPages)}</p>
        )}
    </div>
  );
}
