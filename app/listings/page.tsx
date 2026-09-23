import { Suspense } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import ListingsBrowser from "@/components/listings/ListingsBrowser";
import { rankListings } from "@/lib/ranking";

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
  const listings = JSON.parse(JSON.stringify(rankListings(found)));
  const cities = Array.from(
    new Map(
      listings
        .map((listing: any) => String(listing.location || "").trim())
        .filter(Boolean)
        .map((label: string) => [label.toLowerCase(), { value: label, label }])
    ).values()
  ) as { value: string; label: string }[];

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <header className="border-b" style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}>
        <div className="page-shell py-4 sm:py-6">
          <h1 className="text-[22px] font-bold sm:text-3xl" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Kërko biznese
          </h1>
          <p className="mt-1 text-[13px] sm:text-[15px]" style={{ color: "var(--text-secondary)" }}>
            Gjej biznesin që të duhet dhe porosit ose rezervo direkt.
          </p>
        </div>
      </header>

      <Suspense fallback={<div className="page-shell py-10 text-center text-sm">Duke u ngarkuar...</div>}>
        <ListingsBrowser listings={listings} cities={cities} />
      </Suspense>
    </div>
  );
}
