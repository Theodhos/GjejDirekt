import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getListingPageData } from "@/lib/listing-page-data";
import ListingReservationModal from "@/components/listings/ListingReservationModal";
import ListingCart from "@/components/listings/ListingCart";
import ListingCatalogPage from "@/components/listings/ListingCatalogPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug, status: "approved" }).lean<any>();
  if (!listing) return {};
  return { title: `Katalogu | ${listing.title} | GjejDirekt` };
}

/**
 * The business's own catalog, on its own page: search + section pills + a card
 * grid of everything it sells or books (components/listings/ListingCatalogPage) —
 * one design for every category, reached from the business page's "Katalogu" tab.
 * Same basket/reservation wiring as the business page itself (lib/listing-page-data).
 */
export default async function ListingCatalogRoute({
  params,
  searchParams
}: {
  params: { slug: string };
  /** `?q=` opens the catalog searched for one item — how a search result lands on what it found. */
  searchParams?: { q?: string };
}) {
  const { listing, products, phone, phoneDigits, hasReservation, hasCatalog, basketIsReservation, orderHistoryListing } = await getListingPageData(
    params.slug
  );

  return (
    <main style={{ background: "var(--surface-subtle)" }}>
      <ListingCatalogPage
        listing={listing}
        products={products}
        phone={phone}
        phoneDigits={phoneDigits}
        initialQuery={String(searchParams?.q || "").trim()}
      />

      {hasCatalog && (
        <ListingCart
          variant="bar"
          listingSlug={listing.slug}
          listingId={listing._id.toString()}
          businessName={listing.title}
          phoneDigits={phoneDigits}
          isReservation={basketIsReservation}
          listing={orderHistoryListing}
        />
      )}

      {hasReservation && !hasCatalog && (
        <ListingReservationModal
          listingId={listing._id.toString()}
          businessName={listing.title}
          phoneDigits={phoneDigits}
          listing={orderHistoryListing}
        />
      )}
    </main>
  );
}
