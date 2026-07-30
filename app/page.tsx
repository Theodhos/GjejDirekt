import { Suspense } from "react";
import HomePageClient from "./page.client";
import { loadRankedCities } from "@/lib/cities-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ranked on the server so the very first paint already lists the cities with
  // the most listings first.
  let initialCities: any[] = [];
  try {
    initialCities = JSON.parse(JSON.stringify(await loadRankedCities()));
  } catch {
    // The client falls back to the static catalogue if the database is down.
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Duke u ngarkuar...</div>}>
      <HomePageClient initialCities={initialCities} />
    </Suspense>
  );
}
