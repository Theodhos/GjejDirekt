import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import Product from "@/models/Product";
import { getListingHasCatalog, getListingActions } from "@/lib/constants";
import { safeJson } from "@/lib/utils";

/**
 * Shared data for every page built around one listing (the business page itself and
 * its Katalogu page): the listing, its catalog, and the basket/reservation wiring
 * that decides what renders at the bottom of the page. Kept in one place so the two
 * pages can never disagree about what counts as "has a catalog" or "books instead
 * of orders".
 */
export async function getListingPageData(slug: string, opts: { countView?: boolean } = {}) {
  await connectDB();
  const rawListing = await Listing.findOne({ slug }).populate("owner", "name email role").lean<any>();
  if (!rawListing) notFound();
  // Several children below are Client Components; mongoose hands back ObjectId and
  // Date instances, which React refuses to serialize across that boundary.
  const listing = safeJson(rawListing);

  const viewer = await getAuthUser();
  const canEdit = Boolean(viewer && (viewer.role === "admin" || viewer.id === listing.owner?._id?.toString()));
  const isPublic = listing.status === "approved";
  if (!isPublic && !canEdit) notFound();

  const productsRaw = await Product.find({ listing: listing._id, available: true }).sort({ order: 1, createdAt: 1 }).lean<any>();
  if (opts.countView) await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });
  const products = safeJson(productsRaw);

  const phone = listing.contactInfo?.phone?.trim() || listing.contactPhone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");

  const actions = getListingActions(listing);
  const hasReservation = actions.includes("rezervim");
  // A category that sells from a catalog by default has one; any other business (a salon,
  // a dentist, a mechanic...) has one as soon as its owner has listed services or products.
  const hasCatalog = getListingHasCatalog(listing) || products.length > 0;
  // A business that takes orders (food, a shop, a pet shop) is ordered from even if it also
  // takes bookings — a table or an appointment is booked through the WhatsApp button. Only a
  // booking-only business (hotel, salon, dentist...) turns the basket into a reservation.
  const basketIsReservation = hasReservation && !actions.includes("porosi");

  // Only the fields the local "Porositë" list needs — the full document must not be
  // handed to a client component.
  const orderHistoryListing = {
    slug: String(listing.slug),
    title: String(listing.title),
    images: (listing.images || listing.photos || []).slice(0, 1).map(String),
    location: listing.location ? String(listing.location) : undefined,
    category: listing.category ? String(listing.category) : undefined
  };

  return { listing, products, phone, phoneDigits, hasReservation, hasCatalog, basketIsReservation, orderHistoryListing, canEdit };
}
