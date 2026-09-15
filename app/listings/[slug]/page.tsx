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
  Eye,
  ArrowRight,
  Instagram,
  Facebook,
  Map as MapIcon,
  Music,
  Navigation,
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
import Product from "@/models/Product";
import ListingCard from "@/components/ListingCard";
import { buildWhatsappActions, getListingHasCatalog, getListingActions, getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { safeJson } from "@/lib/utils";
import { startingPrice } from "@/lib/pricing";
import ReportListing from "@/components/ReportListing";
import ListingPriceTile from "@/components/listings/ListingPriceTile";
import ListingStickyBottom from "@/components/listings/ListingStickyBottom";
import ListingContactButtons from "@/components/listings/ListingContactButtons";
import ListingProducts from "@/components/listings/ListingProducts";
import ListingCart from "@/components/listings/ListingCart";
import ListingMobileHeader from "@/components/listings/ListingMobileHeader";
import ListingUniversalNav from "@/components/listings/ListingUniversalNav";

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

  // Three independent round-trips — running them together instead of one after
  // another is the difference between one DB latency hop and three on every load.
  const [relatedListingsRaw, productsRaw] = await Promise.all([
    Listing.find({
      category: listing.category,
      _id: { $ne: listing._id },
      status: "approved"
    }).limit(4).lean<any>(),
    Product.find({ listing: listing._id, available: true }).sort({ order: 1, createdAt: 1 }).lean<any>(),
    Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } })
  ]);
  const relatedListings = safeJson(relatedListingsRaw);
  const products = safeJson(productsRaw);

  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  const isHotel = categoryLabel === "Hotele & Akomodim";
  const isShopping = categoryLabel === "Shopping";

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
  // One link per action the business takes — a restaurant gets both "porosit" and
  // "rezervo", a hotel only "rezervo". Each carries its own opening message.
  const whatsappActions = buildWhatsappActions(listing, phoneDigits);
  const whatsappHref = whatsappActions[0]?.href || "";

  // Listings advertise a single starting price in lek.
  const priceValue = startingPrice(listing);

  const tags = [...(listing.tags || []), ...(listing.amenities || [])].filter((v, i, self) => self.indexOf(v) === i);

  const hasStickyBar = Boolean(phone || whatsappHref);
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
      style={{ background: "var(--surface-page)", minHeight: "100vh" }}
      // The mobile contact bar is fixed to the bottom, so the page needs room
      // underneath it or the last section sits behind the buttons.
      className={hasStickyBar ? "pb-28 md:pb-8" : "pb-8"}
    >
      {/* ── HEADER (Mobile-first app style) ── */}
      <ListingMobileHeader listing={listing} />

      {getCategoryLabel(listing.category) === "Ushqim & Pije" && (
        <nav className="hidden sticky top-[56px] z-20 border-y bg-white/95 backdrop-blur-md" style={{ borderColor: "var(--border-soft)" }} aria-label="Navigimi i biznesit">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-3 sm:px-6 lg:px-8">
            {["Përmbledhje", "Menu", "Vlerësime", "Foto", "Informacion"].map((item, index) => (
              <a key={item} href={["#overview", "#menu", "#details", "#gallery", "#details"][index]} className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold ${index === 1 ? "text-[var(--brand-accent)]" : "text-[var(--text-tertiary)]"}`}>
                <span className="text-[16px]">{["▣", "♧", "☆", "▧", "ⓘ"][index]}</span>
                {item}
                {index === 1 && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--brand-accent)]" />}
              </a>
            ))}
          </div>
        </nav>
      )}

      <ListingUniversalNav isHotel={isHotel} hasCatalog={hasCatalog} hasReservation={hasReservation} externalMapUrl={externalMapUrl} />

      {isHotel && (
        <nav className="hidden sticky top-[56px] z-20 border-y bg-white/95 backdrop-blur-md" style={{ borderColor: "var(--border-soft)" }} aria-label="Navigimi i akomodimit">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-3 sm:px-6 lg:px-8">
            {["Përmbledhje", "Dhoma & Çmime", "Pajisjet", "Galeria", "Vlerësime", "Harta"].map((item, index) => (
              <a key={item} href={index === 5 ? externalMapUrl : ["#overview", "#rooms", "#amenities", "#gallery", "#details"][index]} target={index === 5 ? "_blank" : undefined} rel={index === 5 ? "noreferrer" : undefined} className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold ${index === 1 ? "text-[var(--brand-accent)]" : "text-[var(--text-tertiary)]"}`}>
                <span className="text-[15px]">{["▣", "▤", "♧", "▧", "☆", "⌖"][index]}</span>
                <span className="truncate">{item}</span>
                {index === 1 && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--brand-accent)]" />}
              </a>
            ))}
          </div>
        </nav>
      )}

      {isShopping && (
        <nav className="hidden sticky top-[56px] z-20 border-y bg-white/95 backdrop-blur-md" style={{ borderColor: "var(--border-soft)" }} aria-label="Navigimi i dyqanit">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-3 sm:px-6 lg:px-8">
            {["Përmbledhje", "Produktet", "Kategoritë", "Vlerësime", "Informacion"].map((item, index) => (
              <a key={item} href={["#overview", "#products", "#products", "#details", "#details"][index]} className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold ${index === 1 ? "text-[var(--brand-accent)]" : "text-[var(--text-tertiary)]"}`}>
                <span className="text-[15px]">{["▣", "▦", "♧", "☆", "ⓘ"][index]}</span>
                <span className="truncate">{item}</span>
                {index === 1 && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--brand-accent)]" />}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* ── MAIN CONTENT ── */}
      <section className="page-shell mt-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* ════ LEFT COLUMN ════ */}
          <div id="overview" className="min-w-0 space-y-6">
            <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6" style={{ borderColor: "var(--border-soft)" }}>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-lg" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>⌂</span>
                <div><p className="eyebrow">Rreth biznesit</p><h2 className="mt-1 text-xl font-bold" style={{ color: "var(--text-primary)" }}>{listing.title}</h2></div>
              </div>
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{listing.description}</p>
              {tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{tags.slice(0, 6).map((tag: string) => <span key={tag} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>{tag}</span>)}</div>}
            </section>

            {/* ── Menu / Products — a food business's page leads with what it sells, ── */}
            {/* not its photos, so this renders first, right under the title.      ── */}
            {/* Gated by the category taxonomy: reservation-only categories (a lawyer, a  */}
            {/* salon) never get an order cart, even if stray Product rows exist for them. */}
            {getListingHasCatalog(listing) && (
              <div id="primary">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="eyebrow mb-1">{isHotel ? "Qëndrimi yt" : isShopping ? "Koleksioni" : "Menuja"}</p>
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{isHotel ? "Dhoma & Çmime" : isShopping ? "Produktet" : "Menuja e biznesit"}</h2>
                  </div>
                  {isHotel && <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Rezervo direkt</span>}
                </div>
                <ListingProducts listingSlug={listing.slug} products={products} isShopping={categoryLabel === "Shopping"} />
              </div>
            )}

            {/* ── About this service ── */}
            <div id="legacy-description" className="hidden" style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
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
              <div id="business-details" style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
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

                  {priceValue !== null && <ListingPriceTile price={priceValue} />}

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
              <div id="amenities" style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  What&apos;s included
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



            {/* ── Social links (phones only — the sidebar card is desktop-only) ── */}
            {(listing.socialLinks?.instagram || listing.socialLinks?.facebook || listing.socialLinks?.tiktok) && (
              <div className="lg:hidden" style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Social
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { href: listing.socialLinks?.instagram, label: "Instagram", Icon: Instagram },
                    { href: listing.socialLinks?.facebook, label: "Facebook", Icon: Facebook },
                    { href: listing.socialLinks?.tiktok, label: "TikTok", Icon: Music }
                  ]
                    .filter((item) => Boolean(item.href))
                    .map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 min-w-[7.5rem] flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors hover:bg-neutral-100"
                        style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </a>
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
          <aside id="contact" className="lg:sticky lg:top-24 h-fit space-y-4">

            {isHotel && (
              <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm lg:block" style={{ borderColor: "var(--border-soft)" }}>
                <div className="border-b px-5 py-4" style={{ borderColor: "var(--border-soft)" }}>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Bëj rezervimin tënd</h3>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>Zgjidh një dhomë dhe dërgo kërkesën</p>
                </div>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>Check-in<input type="date" className="mt-1 w-full rounded-lg border px-2 py-2 text-xs" style={{ borderColor: "var(--border-medium)" }} /></label>
                    <label className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>Check-out<input type="date" className="mt-1 w-full rounded-lg border px-2 py-2 text-xs" style={{ borderColor: "var(--border-medium)" }} /></label>
                  </div>
                  <label className="block text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>Të ftuar<select className="mt-1 w-full rounded-lg border px-2 py-2 text-xs" style={{ borderColor: "var(--border-medium)" }} defaultValue="2"><option value="1">1 i rritur</option><option value="2">2 të rritur</option><option value="3">3 të rritur</option><option value="4">4 të rritur</option></select></label>
                  <a href="#rooms" className="flex w-full items-center justify-center rounded-lg py-2.5 text-xs font-bold text-white" style={{ background: "var(--brand-accent)" }}>Kontrollo disponueshmërinë</a>
                  <p className="text-center text-[10px]" style={{ color: "var(--text-tertiary)" }}>Konfirmimi bëhet nga biznesi përmes WhatsApp</p>
                </div>
              </div>
            )}

            {/* Contact / CTA Card — order straight from the business, no middleman */}
            <div
              className="hidden"
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
                  Kontakto direkt me biznesin
                </p>
              </div>

              <div className="p-6 space-y-3">
                {/* Phone + WhatsApp — clicks counted for ranking */}
                <ListingContactButtons
                  phone={phone}
                  whatsappActions={whatsappActions}
                  listingId={listing._id.toString()}
                  listing={orderHistoryListing}
                />

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
                {(listing.socialLinks?.instagram || listing.socialLinks?.facebook || listing.socialLinks?.tiktok) && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
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
        <section className="page-shell mt-8 lg:mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
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
    </main>
  );
}
