"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Inbox, Sparkles } from "lucide-react";
import ListingCard from "@/components/ListingCard";

export default function ListingGrid() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const query = searchParams?.toString() || "";
        const res = await fetch(`/api/listings?${query}`);
        const data = await res.json();
        
        let results = data.listings || [];
        
        // If no search query, shuffle results for "Random" effect
        if (!query) {
          results = [...results].sort(() => Math.random() - 0.5);
        }

        setListings(results);
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
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Finding services...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-8">
            <Inbox className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-950 mb-4">No results found</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          We couldn't find any services matching your filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
        {!searchParams?.toString() && (
            <div className="flex items-center gap-4 p-8 rounded-[2.5rem] bg-brand-50 border border-brand-100 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-600 shadow-sm shrink-0">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-lg font-black text-slate-950">Featured & Recommended</h4>
                    <p className="text-sm text-slate-500 font-medium">Explore a random selection of the best services across Albania.</p>
                </div>
            </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2">
            {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
    </div>
  );
}
