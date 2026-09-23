import { Suspense } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import ListingsBrowser from "@/components/listings/ListingsBrowser";
import { rankListings } from "@/lib/ranking";
import { withMenuTerms } from "@/lib/food-server";

// The full approved-listing set changes a handful of times a day — cache the
// page and refresh it in the background instead of hitting Mongo on every request.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kërko biznese",
  description:
    "Kërko dhe filtro të gjitha bizneset e regjistruara në GjejDirekt sipas kategorisë dhe qytetit, dhe kontakto direkt."
};

export default async function ListingsPage() {
  await connectDB();
  const found = await Listing.find({ status: "approved" }).sort({ createdAt: -1 }).lean<any>();
  // Food businesses carry their menu item names too, so searching "burger" finds the places serving one.
  const listings = JSON.parse(JSON.stringify(await withMenuTerms(rankListings(found))));

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <Suspense fallback={<div className="page-shell py-10 text-center text-sm">Duke u ngarkuar...</div>}>
        <ListingsBrowser listings={listings} />
      </Suspense>
    </div>
  );
}
