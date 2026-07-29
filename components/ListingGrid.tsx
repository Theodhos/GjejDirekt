"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Inbox, ChevronDown, ArrowDownWideNarrow } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { useLanguage } from "@/context/LanguageContext";

/** How many cards are visible before the first "show more" click. */
const INITIAL_VISIBLE = 8;
const LOAD_STEP = 8;

const copy = {
  al: {
    loading: "Duke kerkuar sherbime...",
    noResultsTitle: "Nuk u gjet asnje rezultat",
    noResultsDescription:
      "Nuk gjetem sherbime qe perputhen me filtrat tuaj. Provoni te ndryshoni kriteret e kerkimit.",
    sortBy: "Rendit sipas:",
    sortLatest: "Më të rejat",
    sortPopular: "Më të shikuarat",
    sortName: "Emrit",
    showMore: "Shfaq më shumë listime",
    results: (shown: number, total: number) => `${shown} nga ${total} listime`
  },
  en: {
    loading: "Finding services...",
    noResultsTitle: "No results found",
    noResultsDescription:
      "We couldn't find any services matching your filters. Try adjusting your search criteria.",
    sortBy: "Sort by:",
    sortLatest: "Newest",
    sortPopular: "Most viewed",
    sortName: "Name",
    showMore: "Show more listings",
    results: (shown: number, total: number) => `${shown} of ${total} listings`
  }
};

export default function ListingGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const text = copy[language];
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const sort = searchParams?.get("sort") || "latest";

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const query = searchParams?.toString() || "";
        const res = await fetch(`/api/listings?${query}`);
        const data = await res.json();

        // Keep the server's package-tier ranking intact (no shuffling).
        setListings(data.listings || []);
        setVisible(INITIAL_VISIBLE);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  const changeSort = useCallback(
    (value: string) => {
      const query = new URLSearchParams(searchParams?.toString());
      if (value && value !== "latest") query.set("sort", value);
      else query.delete("sort");
      router.push(`/services?${query.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const sortBar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
        {listings.length > 0 ? text.results(Math.min(visible, listings.length), listings.length) : ""}
      </p>
      <label className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
          <ArrowDownWideNarrow className="h-3.5 w-3.5" style={{ color: "var(--brand-accent)" }} />
          {text.sortBy}
        </span>
        <span className="relative">
          <select
            value={sort}
            onChange={(event) => changeSort(event.target.value)}
            className="h-10 cursor-pointer appearance-none rounded-xl border bg-white pl-3 pr-9 text-sm font-semibold outline-none transition-colors"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)" }}
          >
            <option value="latest">{text.sortLatest}</option>
            <option value="popular">{text.sortPopular}</option>
            <option value="name">{text.sortName}</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--text-tertiary)" }}
          />
        </span>
      </label>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{text.loading}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="space-y-5">
        {sortBar}
        <div className="flex flex-col items-center justify-center px-4 py-28 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="mb-4 text-3xl font-black text-slate-950">{text.noResultsTitle}</h3>
          <p className="mx-auto max-w-sm font-medium text-slate-500">{text.noResultsDescription}</p>
        </div>
      </div>
    );
  }

  const shown = listings.slice(0, visible);
  const remaining = listings.length - shown.length;

  return (
    <div className="space-y-5">
      {sortBar}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {shown.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setVisible((current) => current + LOAD_STEP)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-bold transition-colors hover:bg-[var(--brand-light)]"
            style={{ borderColor: "var(--brand-border)", color: "var(--brand-accent)" }}
          >
            {text.showMore}
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              (+{Math.min(LOAD_STEP, remaining)})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
