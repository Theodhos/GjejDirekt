"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Listings that are close to what the filter asked for, without repeating the results. */
function buildSuggestions(pool: any[], results: any[], params: URLSearchParams) {
  const resultIds = new Set(results.map((listing) => String(listing._id)));
  const category = (params.get("category") || "").toLowerCase();
  const subcategory = (params.get("subcategory") || "").toLowerCase();
  const location = (params.get("location") || "").toLowerCase();

  const score = (listing: any) => {
    let value = 0;
    if (category && String(listing.category || "").toLowerCase() === category) value += 3;
    if (subcategory && String(listing.subcategory || "").toLowerCase() === subcategory) value += 2;
    if (location && String(listing.location || "").toLowerCase().includes(location)) value += 2;
    if (listing.featured) value += 1;
    return value;
  };

  return pool
    .filter((listing) => !resultIds.has(String(listing._id)))
    .map((listing) => ({ listing, score: score(listing) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((entry) => entry.listing);
}

export function useServicesData() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [suggestedListings, setSuggestedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams?.toString());
        const hasFilters = Array.from(query.keys()).length > 0;

        // The unfiltered call only runs when a filter is active — without one the
        // results already contain everything, so there is nothing left to suggest.
        const [filteredRes, poolRes] = await Promise.all([
          fetch(`/api/listings?${query.toString()}`),
          hasFilters ? fetch("/api/listings") : Promise.resolve(null)
        ]);

        const data = await filteredRes.json();
        const results = data.listings || [];
        if (cancelled) return;

        setListings(results);
        setFeaturedListings(results.filter((listing: any) => listing.featured).slice(0, 8));

        if (poolRes) {
          const poolData = await poolRes.json();
          if (cancelled) return;
          setSuggestedListings(buildSuggestions(poolData.listings || [], results, query));
        } else {
          setSuggestedListings([]);
        }
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return { listings, featuredListings, suggestedListings, loading };
}
