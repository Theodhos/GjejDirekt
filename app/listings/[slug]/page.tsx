import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import Product from "@/models/Product";
import { getListingHasCatalog, getListingActions } from "@/lib/constants";
import { safeJson } from "@/lib/utils";
import ListingReservationModal from "@/components/listings/ListingReservationModal";
import ListingCart from "@/components/listings/ListingCart";
import BusinessPage from "@/components/listings/BusinessPage";
import { isFoodListing } from "@/lib/food";

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
  await connectDB();
  const rawListing = await Listing.findOne({ slug: params.slug }).populate("owner", "name email role").lean<any>();
  if (!rawListing) notFound();
  // Several children below are Client Components; mongoose hands back ObjectId and
  // Date instances, which React refuses to serialize across that boundary.
  const listing = safeJson(rawListing);

  const viewer = await getAuthUser();
  const canEdit = Boolean(viewer && (viewer.role === "admin" || viewer.id === listing.owner?._id?.toString()));
  const isPublic = listing.status === "approved";
  if (!isPublic && !canEdit) notFound();

  const productsRaw = await Product.find({ listing: listing._id, available: true }).sort({ order: 1, createdAt: 1 }).lean<any>();
  await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });
  const products = safeJson(productsRaw);

  const phone = listing.contactInfo?.phone?.trim() || listing.contactPhone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");

  const hasCatalog = getListingHasCatalog(listing);
  const hasReservation = getListingActions(listing).includes("rezervim");

  // Only the fields the local "Porositë" list needs — the full document must not be
  // handed to a client component.
  const orderHistoryListing = {
    slug: String(listing.slug),
    title: String(listing.title),
    images: (listing.images || listing.photos || []).slice(0, 1).map(String),
    location: listing.location ? String(listing.location) : undefined,
    category: listing.category ? String(listing.category) : undefined
  };

  // Every business, whatever its category, gets the one page (cover, quick actions, tabs,
  // the offer with "+ Shto" and the basket bar) — see BusinessPage for what changes per
  // category. Food is always ordered from the basket (a table is booked through the
  // "Rezervo tavolinë" link, not through the hotel-style booking form); a catalog business
  // that also takes reservations (a hotel picking a room) books through the same basket in
  // its booking mode.
  return (
    <main style={{ background: "var(--surface-subtle)" }}>
      <BusinessPage listing={listing} products={products} phone={phone} phoneDigits={phoneDigits} hasCatalog={hasCatalog} />

      {hasCatalog && (
        <ListingCart
          variant="bar"
          listingSlug={listing.slug}
          listingId={listing._id.toString()}
          businessName={listing.title}
          phoneDigits={phoneDigits}
          phone={phone}
          isReservation={isFoodListing(listing) ? false : hasReservation}
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
          phone={phone}
          listing={orderHistoryListing}
        />
      )}
    </main>
  );
}
