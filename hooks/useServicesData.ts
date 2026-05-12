"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useServicesData() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams?.toString());
        const res = await fetch(`/api/listings?${query.toString()}`);
        const data = await res.json();
        setListings(data.listings || []);
        setFeaturedListings((data.listings || []).filter((l: any) => l.featured).slice(0, 8));
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  return { listings, featuredListings, loading };
}
