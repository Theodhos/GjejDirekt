import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getListingPageData } from "@/lib/listing-page-data";
import ListingReservationModal from "@/components/listings/ListingReservationModal";
import ListingCart from "@/components/listings/ListingCart";
import BusinessPage from "@/components/listings/BusinessPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug, status: "approved" }).lean<any>();
  if (!listing) return {};
  return {
    title: `${listing.title} | GjejDirekt`,
    description: listing.description.slice(0, 160)
  };
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const { listing, products, phone, phoneDigits, hasReservation, hasCatalog, basketIsReservation, orderHistoryListing, canEdit } = await getListingPageData(
    params.slug,
    { countView: true }
  );

  // Every business, whatever its category, gets the one page (cover, quick actions, tabs,
  // the offer with "+ Shto" and the basket bar) — see BusinessPage for what changes per
  // category. Food is always ordered from the basket (a table is booked through the
  // "Rezervo tavolinë" link, not through the hotel-style booking form); a catalog business
  // that also takes reservations (a hotel picking a room) books through the same basket in
  // its booking mode.
  return (
    <main style={{ background: "var(--surface-subtle)" }}>
      <BusinessPage listing={listing} products={products} phone={phone} phoneDigits={phoneDigits} hasCatalog={hasCatalog} canEdit={canEdit} />

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

      {/* Floating "Rezervo" CTA — for reservation businesses with no catalog to add-to-cart
          from first (a hairdresser, a dentist, a mechanic...). */}
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
