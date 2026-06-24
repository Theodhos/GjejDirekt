import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarDays,
  Clock3,
  Globe,
  MessageCircle,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Eye,
  ArrowRight,
  Instagram,
  Facebook,
  Map as MapIcon,
  Navigation,
  Euro,
  Tag,
  Clock,
  Wifi,
  Car,
  Utensils,
  TreePine,
  Waves,
  CheckCircle
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import ListingCard from "@/components/ListingCard";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import ReportListing from "@/components/ReportListing";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingStickyBottom from "@/components/listings/ListingStickyBottom";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug, status: "approved" }).lean<any>();
  if (!listing) return {};
  return {
    title: `${listing.title} | Tourism Platform`,
    description: listing.description.slice(0, 160)
  };
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug }).populate("owner", "name email role").lean<any>();
  if (!listing) notFound();

  const viewer = await getAuthUser();
  const canEdit = Boolean(viewer && (viewer.role === "admin" || viewer.id === listing.owner?._id?.toString()));
  const isPublic = listing.status === "approved";
  if (!isPublic && !canEdit) notFound();

  await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });

  const relatedListings = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
    status: "approved"
  }).limit(4).lean<any>();

  const allImages = listing.images || [];
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);

  const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;
  const mapAddress = [listing.address, listing.location, listing.country].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(
    listing.coordinates?.lat && listing.coordinates?.lng
      ? `${listing.coordinates.lat},${listing.coordinates.lng}`
      : mapAddress || listing.title
  );
  const mapSrc = googleMapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${mapQuery}`
    : `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const phone = listing.contactInfo?.phone?.trim() || listing.contactPhone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappHref = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello, I'm interested in ${listing.title} from Tourism Platform.`)}`
    : "";

  const currencySymbol = listing.currency === "ALL" || listing.currency === "LEK" ? "L" : (listing.currency || "€");
  const priceDisplay = (() => {
    if (listing.priceFrom && listing.price && listing.priceFrom !== listing.price)
      return `${currencySymbol}${listing.priceFrom} – ${currencySymbol}${listing.price}`;
    if (listing.priceFrom) return `${currencySymbol}${listing.priceFrom}`;
    if (listing.price) return `${currencySymbol}${listing.price}`;
    return null;
  })();

  const tags = [...(listing.tags || []), ...(listing.amenities || [])].filter((v, i, self) => self.indexOf(v) === i);

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh", paddingBottom: "7rem" }}>

      {/* ── GALLERY ── */}
      <section className="page-shell pt-6 pb-0">
        <ListingGallery images={allImages} listing={listing} />
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="page-shell mt-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* ════ LEFT COLUMN ════ */}
          <div className="min-w-0 space-y-6">

            {/* Title Block — exactly like Stay Directory */}
            <div>
              {/* Category pill */}
              <div className="mb-3">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid var(--brand-border)" }}
                >
                  {categoryLabel}
                </span>
                {listing.featured && (
                  <span
                    className="ml-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#b45309" }}
                  >
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="font-bold tracking-tight mb-3 leading-tight"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)", color: "var(--text-primary)" }}
              >
                {listing.title}
              </h1>

              {/* Location + meta */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                  {[listing.location, listing.country].filter(Boolean).join(", ")}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {Number(listing.ratingAverage || 0).toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  <Eye className="w-3.5 h-3.5" />
                  {listing.views || 0} views
                </span>
              </div>
            </div>

            {/* ── About this service ── */}
            <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                About this service
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
                {listing.description}
              </p>
            </div>

            {/* ── Details / Info ── */}
            {(listing.businessHours || listing.priceFrom || listing.price ||
              listing.website || listing.checkIn || listing.menuLink ||
              listing.eventDate || listing.bookingLink || listing.transportType) && (
              <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  Details
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {listing.businessHours && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Business Hours</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{listing.businessHours}</p>
                      </div>
                    </div>
                  )}

                  {priceDisplay && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Euro className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Price</p>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{priceDisplay}</p>
                      </div>
                    </div>
                  )}

                  {listing.website && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Globe className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Website</p>
                        <a
                          href={listing.website.startsWith("http") ? listing.website : `https://${listing.website}`}
                          target="_blank" rel="noreferrer"
                          className="text-sm font-medium truncate block hover:underline"
                          style={{ color: "var(--brand-accent)" }}
                        >
                          {listing.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {(listing.checkIn || listing.checkOut) && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Clock3 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Check-In / Check-Out</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {listing.checkIn ? `In: ${listing.checkIn}` : ""}
                          {listing.checkOut ? `  ·  Out: ${listing.checkOut}` : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {listing.menuLink && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Utensils className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Menu</p>
                        <a href={listing.menuLink} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline" style={{ color: "var(--brand-accent)" }}>
                          View Menu →
                        </a>
                      </div>
                    </div>
                  )}

                  {(listing.eventDate || listing.eventTime) && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <CalendarDays className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Event Date & Time</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {listing.eventDate || ""}
                          {listing.eventTime ? `  at  ${listing.eventTime}` : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {listing.bookingLink && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Sparkles className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Booking</p>
                        <a href={listing.bookingLink} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline" style={{ color: "var(--brand-accent)" }}>
                          Book Now →
                        </a>
                      </div>
                    </div>
                  )}

                  {listing.transportType && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Car className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Transport Type</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{listing.transportType}</p>
                      </div>
                    </div>
                  )}

                  {listing.googleMapsLink && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                    >
                      <Navigation className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <div>
                        <p className="eyebrow mb-0.5">Google Maps</p>
                        <a href={listing.googleMapsLink} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline" style={{ color: "var(--brand-accent)" }}>
                          Open in Maps →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips */}
                {listing.tips && (
                  <div
                    className="mt-3 rounded-xl p-4"
                    style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                  >
                    <p className="eyebrow mb-2">Tips & Information</p>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{listing.tips}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── What's Included (Amenities / Tags) ── */}
            {tags.length > 0 && (
              <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  What's included
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tags.map((tag: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                      style={{
                        background: "var(--surface-white)",
                        border: "1px solid var(--border-soft)"
                      }}
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--brand-accent)" }} />
                      <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* ── Edit (if allowed) ── */}
            {canEdit && (
              <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
                <Link
                  href={`/listings/${listing.slug}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-900 hover:text-white"
                  style={{
                    background: "var(--surface-white)",
                    border: "1px solid var(--border-medium)",
                    color: "var(--text-primary)"
                  }}
                >
                  <PencilLine className="w-4 h-4" /> Edit Service
                </Link>
              </div>
            )}

            {/* ── Report ── */}
            <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
              <ReportListing listingId={listing._id.toString()} />
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">

            {/* Contact / CTA Card — "Book directly with the host" style */}
            <div
              className="overflow-hidden"
              style={{
                background: "var(--surface-white)",
                border: "1px solid var(--border-soft)",
                borderRadius: "16px",
                boxShadow: "var(--shadow-panel)"
              }}
            >
              {/* Top label */}
              <div
                className="px-6 py-4"
                style={{
                  borderBottom: "1px solid var(--border-soft)",
                  background: "var(--surface-cream)"
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-center" style={{ color: "var(--text-secondary)" }}>
                  Contact directly with the host
                </p>
              </div>

              <div className="p-6 space-y-3">
                {/* Phone */}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center justify-center gap-2.5 w-full rounded-full py-3 font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-95"
                    style={{ background: "var(--brand-accent)", boxShadow: "0 2px 8px rgba(34,153,120,0.22)" }}
                  >
                    <Phone className="w-4 h-4" />
                    Call Directly
                  </a>
                )}

                {/* WhatsApp */}
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full rounded-full py-3 font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-95"
                    style={{ background: "#25D366", boxShadow: "0 2px 8px rgba(37,211,102,0.18)" }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}

                {!phone && (
                  <p className="text-center text-sm py-2" style={{ color: "var(--text-tertiary)" }}>
                    Contact info private
                  </p>
                )}



                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--brand-accent)" }} />
                    Free to see
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--brand-accent)" }} />
                    No booking fees
                  </span>
                </div>

                {/* Social links */}
                {(listing.socialLinks?.instagram || listing.socialLinks?.facebook) && (
                  <div className="flex gap-2.5 pt-1">
                    {listing.socialLinks?.instagram && (
                      <a
                        href={listing.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-colors hover:bg-neutral-100"
                        style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                    {listing.socialLinks?.facebook && (
                      <a
                        href={listing.socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-colors hover:bg-neutral-100"
                        style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Verified badge card */}
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-2xl"
              style={{
                background: "var(--surface-cream)",
                border: "1px solid var(--border-soft)"
              }}
            >
              <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: "var(--brand-accent)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Verified listing</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Reviewed by our team</p>
              </div>
            </div>
          </aside>

        </div>
      </section>

      {/* ── RELATED LISTINGS ── */}
      {relatedListings.length > 0 && (
        <section className="page-shell mt-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow mb-2">More like this</p>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Similar {categoryLabel} listings
              </h2>
            </div>
            <Link
              href={`/services?category=${listing.category}`}
              className="text-sm font-medium transition-colors hover:text-brand-600"
              style={{ color: "var(--brand-accent)" }}
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedListings.map((rel: any) => (
              <ListingCard key={rel._id.toString()} listing={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Bar (mobile) */}
      <ListingStickyBottom
        phone={phone}
        whatsappHref={whatsappHref}
        priceFrom={listing.priceFrom}
        currency={listing.currency}
        categoryLabel={categoryLabel}
      />
    </main>
  );
}
