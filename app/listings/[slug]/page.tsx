import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import Product from "@/models/Product";
import { getListingHasCatalog, getListingActions, getCategoryLabel } from "@/lib/constants";
import { safeJson } from "@/lib/utils";
import ListingReservationModal from "@/components/listings/ListingReservationModal";
import ListingProducts from "@/components/listings/ListingProducts";
import ListingCart from "@/components/listings/ListingCart";
import ListingMobileHeader from "@/components/listings/ListingMobileHeader";

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

  const categoryLabel = getCategoryLabel(listing.category);
  const isHotel = categoryLabel === "Hotele & Akomodim";
  const isShopping = categoryLabel === "Shopping";

  const phone = listing.contactInfo?.phone?.trim() || listing.contactPhone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");

  const hasStickyBar = Boolean(phone);
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

  return (
    <main
      style={{ background: "var(--surface-subtle)", minHeight: "100vh" }}
      // The mobile contact bar is fixed to the bottom, so the page needs room
      // underneath it or the last section sits behind the buttons.
      className={hasStickyBar ? "pb-28 md:pb-8" : "pb-8"}
    >
      {/* ── HEADER (Mobile-first app style) ── */}
      <ListingMobileHeader listing={listing} />

      {/* ── Menu / Products — the only content on this page. ── */}
      {getListingHasCatalog(listing) && (
        <section id="primary" className="page-shell mt-4">
          <div className="rounded-2xl bg-white p-5 sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow mb-1">{isHotel ? "Qëndrimi yt" : isShopping ? "Koleksioni" : "Menuja"}</p>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{isHotel ? "Dhoma & Çmime" : isShopping ? "Produktet" : "Menuja e biznesit"}</h2>
              </div>
              {isHotel && <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Rezervo direkt</span>}
            </div>
            <ListingProducts listingSlug={listing.slug} products={products} isShopping={categoryLabel === "Shopping"} />
          </div>
        </section>
      )}

      {/* Floating order basket — only renders once something is in the cart */}
      <ListingCart
        listingSlug={listing.slug}
        listingId={listing._id.toString()}
        businessName={listing.title}
        phoneDigits={phoneDigits}
        phone={phone}
        isReservation={hasReservation}
        listing={orderHistoryListing}
      />

      {/* Floating "Rezervo" CTA — for reservation businesses with no catalog to add-to-cart
          from first (a hairdresser, a dentist, a mechanic...). Catalog+reservation businesses
          (a hotel, a restaurant table) book through ListingCart's booking mode instead. */}
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
