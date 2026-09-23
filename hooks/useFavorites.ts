"use client";

import useSWR from "swr";
import useAuth from "@/hooks/useAuth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Shared favorites cache — every BusinessCard on a page used to fire its own
 * /api/favorites request on mount, so a grid of 20+ cards meant 20+ duplicate
 * requests. SWR dedupes concurrent calls to the same key, so mounting this
 * hook from many cards still issues one request. The key is null while
 * signed out, so anonymous visitors (the majority of traffic) skip it
 * entirely instead of hitting the API just to get a 401.
 */
export default function useFavorites() {
  const { user } = useAuth();
  const { data, mutate } = useSWR(user ? "/api/favorites" : null, fetcher);
  const favorites: any[] = Array.isArray(data?.favorites) ? data.favorites : [];

  function isFavorited(listingId: string | undefined | null) {
    if (!listingId) return false;
    return favorites.some((item: any) => (item?._id ?? item) === listingId);
  }

  return { favorites, isFavorited, refresh: mutate };
}
