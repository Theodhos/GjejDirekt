"use client";

import Link from "next/link";
import { Clock3, ArrowUpRight, Heart, ShoppingBag, CalendarCheck, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import ProfilePanel from "@/components/dashboard/ProfilePanel";
import UserListingTable from "@/components/dashboard/UserListingTable";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import EmptyState from "@/components/ui/EmptyState";
import { getCategoryLabel } from "@/lib/constants";
import { formatPrice } from "@/lib/pricing";
import { useLanguage } from "@/context/LanguageContext";

type DashboardClientProps = {
  listings: any[];
  activities: any[];
  profileUser: {
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt?: string | Date;
  };
  isAdmin: boolean;
  paymentsCount: number;
  /** A "klient" account — browses, favorites, orders and reserves, never owns a listing. */
  isClient?: boolean;
  favorites?: any[];
  orders?: any[];
  reservations?: any[];
  /** Business accounts only — new orders/reservations and approvals, newest first. */
  notifications?: any[];
};

function listingCover(listing: any): string | undefined {
  return listing?.images?.[0] || listing?.photos?.[0] || listing?.bannerImage || undefined;
}

export default function DashboardClient({
  listings,
  activities,
  profileUser,
  isAdmin,
  paymentsCount,
  isClient = false,
  favorites = [],
  orders = [],
  reservations = [],
  notifications = []
}: DashboardClientProps) {
  const { language } = useLanguage();
  const en = language === "en";
  const approved = listings.filter((listing: any) => listing.status === "approved").length;
  const rejected = listings.filter((listing: any) => listing.status === "rejected").length;

  const stats = [
    { label: en ? "Total Listings" : "Totali i shërbimeve", value: String(listings.length), accent: false },
    { label: en ? "Payments" : "Pagesat", value: String(paymentsCount), accent: false, href: "/dashboard/payments" },
    { label: en ? "Approved" : "Të miratuara", value: String(approved), accent: true },
    { label: en ? "Rejected" : "Të refuzuara", value: String(rejected), accent: false }
  ];

  // Orders and reservations, merged into one chronological list — a reservation/order
  // only ever exists once its WhatsApp message has actually been sent.
  const bookings = isClient
    ? [
        ...orders.map((order: any) => ({ ...order, kind: "order" as const })),
        ...reservations.map((reservation: any) => ({ ...reservation, kind: "reservation" as const }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(en ? "en-GB" : "sq-AL", { day: "numeric", month: "short", year: "numeric" });

  return (
    <main style={{ background: "var(--surface-page)" }}>
      <div className="py-8 sm:py-20" style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-24">
            <div className="flex flex-col items-start text-left">
              <p className="eyebrow mb-4">{en ? "Your area" : "Zona juaj"}</p>
              <h1
                className="font-bold tracking-tight mb-5"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
              >
                {en ? "Personal Dashboard" : "Paneli Personal"}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8 text-balance" style={{ color: "var(--text-secondary)" }}>
                {isClient
                  ? en
                    ? "Your personal details, favorite businesses, and the orders and reservations you've sent — all in one place."
                    : "Të dhënat e tua personale, bizneset e preferuara, dhe porositë e rezervimet që ke dërguar — të gjitha në një vend."
                  : en
                    ? "Your listings, favorites, reviews, and platform activity all in one place. Everything you do on the platform is cleanly surfaced here."
                    : "Shërbimet, të preferuarat, vlerësimet dhe aktiviteti juaj në platformë janë të gjitha në një vend. Çdo veprim i juaji shfaqet qartë këtu."}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {!isClient && (
                  <>
                    <Button href="/create-listing">{en ? "Add Listing" : "Shto Shërbim"}</Button>
                    <Button href="/packet" variant="ghost" className="hidden sm:inline-flex">{en ? "Buy Package" : "Bli Paketë"}</Button>
                  </>
                )}
                <Button href="/services" variant="ghost">{en ? "Explore services" : "Shiko shërbimet"}</Button>
              </div>
            </div>

            <div className="w-full">
              <ProfilePanel user={profileUser} />
            </div>
          </div>
        </div>
      </div>

      {!isClient && (
      <div style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell py-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const inner = (
                <>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                    style={{ color: stat.accent ? "var(--brand-accent)" : "var(--text-tertiary)" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: stat.accent ? "var(--brand-accent)" : "var(--text-primary)" }}
                  >
                    {stat.value}
                  </p>
                  {stat.href && (
                    <span
                      className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all group-hover:gap-2.5"
                      style={{ background: "var(--brand-accent)" }}
                    >
                      {en ? "View payments" : "Shiko pagesat"}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  )}
                </>
              );
              const cardStyle = {
                background: stat.accent ? "var(--brand-light)" : "var(--surface-white)",
                border: `1px solid ${stat.accent ? "var(--brand-border)" : "var(--border-soft)"}`,
                boxShadow: "var(--shadow-card)"
              };
              return stat.href ? (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="group cursor-pointer rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--brand-border)]"
                  style={cardStyle}
                >
                  {inner}
                </Link>
              ) : (
                <div key={stat.label} className="rounded-2xl p-5 transition-all" style={cardStyle}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {isClient && (
        <ClientPanels favorites={favorites} bookings={bookings} language={language} formatDate={formatDate} />
      )}

      {!isClient && (
      <div className="page-shell py-8 space-y-6">
        <NotificationsPanel initial={notifications} />
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface-white)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div
              className="flex items-center justify-between gap-4 px-6 py-5"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <div>
                <p className="eyebrow mb-1">{en ? "Listings" : "Shërbimet"}</p>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {en ? "Your Services" : "Shërbimet e tua"}
                </h2>
              </div>
              <span
                className="rounded-full px-3.5 py-1 text-xs font-semibold"
                style={{
                  background: "var(--brand-light)",
                  color: "var(--brand-accent)",
                  border: "1px solid var(--brand-border)"
                }}
              >
                {listings.length} {en ? "total" : "gjithsej"}
              </span>
            </div>
            <div className="p-6">
              <UserListingTable listings={listings} isAdmin={isAdmin} />
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface-white)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div
              className="flex items-center gap-4 px-6 py-5"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
              >
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <p className="eyebrow mb-1">{en ? "Active Session" : "Sesioni aktiv"}</p>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {en ? "Last Activity" : "Aktiviteti i fundit"}
                </h2>
              </div>
            </div>

            <div className="p-6">
              {activities.length ? (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {activities[0].title}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {activities[0].description}
                  </p>
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid var(--border-soft)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "var(--brand-accent)" }}
                      />
                      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        {new Date(activities[0].createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--brand-accent)" }}
                    >
                      {new Date(activities[0].createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <Clock3 className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                    {en ? "No recent activity detected." : "Nuk ka aktivitet të fundit."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </main>
  );
}

/** A client account's two panels: the businesses it saved, and every order/reservation it has sent. */
function ClientPanels({
  favorites,
  bookings,
  language,
  formatDate
}: {
  favorites: any[];
  bookings: any[];
  language: string;
  formatDate: (value: string) => string;
}) {
  const en = language === "en";
  const FAVORITES_PREVIEW = 5;
  const favoritesPreview = favorites.slice(0, FAVORITES_PREVIEW);

  return (
    <div className="page-shell py-8">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <p className="eyebrow mb-1">{en ? "Saved" : "Të ruajtura"}</p>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {en ? "Favorite businesses" : "Bizneset e preferuara"}
                </h2>
              </div>
            </div>
            <span
              className="rounded-full px-3.5 py-1 text-xs font-semibold"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid var(--brand-border)" }}
            >
              {favorites.length} {en ? "total" : "gjithsej"}
            </span>
          </div>
          <div className="p-6">
            {favorites.length ? (
              <ul className="space-y-2.5">
                {favoritesPreview.map((listing: any) => (
                  <li key={listing._id}>
                    <Link href={`/listings/${listing.slug}`} className="gd-card flex items-center gap-3 p-2.5">
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <SafeImage src={listingCover(listing)} alt={listing.title} fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {listing.title}
                        </span>
                        <span className="block truncate text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
                          {[getCategoryLabel(listing.category), listing.location].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <Heart className="h-4 w-4 shrink-0" style={{ color: "var(--brand-accent)" }} fill="var(--brand-accent)" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Heart}
                title={en ? "No favorites yet" : "Ende pa të preferuara"}
                description={en ? "Tap the heart on any business to save it here." : "Shtyp zemrën te një biznes për ta ruajtur këtu."}
                action={
                  <Link href="/listings" className="btn-primary">
                    {en ? "Find a business" : "Gjej një biznes"}
                  </Link>
                }
              />
            )}
            {favorites.length > FAVORITES_PREVIEW && (
              <Link
                href="/te-preferuara"
                className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border text-[13.5px] font-semibold"
                style={{ borderColor: "var(--border-medium)", color: "var(--brand-accent)" }}
              >
                {en ? `See all ${favorites.length}` : `Shiko të gjitha (${favorites.length})`}
              </Link>
            )}
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="eyebrow mb-1">{en ? "History" : "Historiku"}</p>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {en ? "Your orders & reservations" : "Porositë & rezervimet e tua"}
                </h2>
              </div>
            </div>
            <span
              className="rounded-full px-3.5 py-1 text-xs font-semibold"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid var(--brand-border)" }}
            >
              {bookings.length} {en ? "total" : "gjithsej"}
            </span>
          </div>
          <div className="p-6">
            {bookings.length ? (
              <ul className="space-y-2.5">
                {bookings.map((item: any) => {
                  const listing = item.listing;
                  const isReservation = item.kind === "reservation";
                  const itemNames = isReservation
                    ? item.itemName
                    : (item.items || []).map((line: any) => line.name).join(", ");
                  return (
                    <li
                      key={item._id}
                      className="flex items-center gap-3 rounded-xl p-2.5"
                      style={{ border: "1px solid var(--border-soft)" }}
                    >
                      <Link href={listing?.slug ? `/listings/${listing.slug}` : "#"} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <SafeImage src={listingCover(listing)} alt={listing?.title || ""} fill sizes="56px" className="object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                            style={{
                              background: isReservation ? "#FFF7ED" : "var(--brand-light)",
                              color: isReservation ? "#C2410C" : "var(--brand-accent)"
                            }}
                          >
                            {isReservation ? (en ? "Reservation" : "Rezervim") : (en ? "Order" : "Porosi")}
                          </span>
                          <Link href={listing?.slug ? `/listings/${listing.slug}` : "#"} className="truncate text-[13.5px] font-bold" style={{ color: "var(--text-primary)" }}>
                            {listing?.title || "—"}
                          </Link>
                        </div>
                        {itemNames && (
                          <p className="truncate text-[12px]" style={{ color: "var(--text-secondary)" }}>
                            {itemNames}
                          </p>
                        )}
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          {formatDate(item.createdAt)}
                          {isReservation && item.date && (
                            <>
                              {" · "}
                              {formatDate(item.date)}
                              {item.endDate ? ` → ${formatDate(item.endDate)}` : ""}
                              {item.days > 1 ? ` (${item.days} ${en ? "days" : "ditë"})` : ""}
                            </>
                          )}
                          {typeof item.total === "number" && item.total > 0 ? ` · ${formatPrice(item.total)}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title={en ? "No orders or reservations yet" : "Ende asnjë porosi ose rezervim"}
                description={
                  en
                    ? "Order or book from any business and it shows up here once it's sent."
                    : "Porosit ose rezervo te një biznes dhe do të shfaqet këtu sapo të dërgohet."
                }
                action={
                  <Link href="/listings" className="btn-primary">
                    <MessageCircle className="h-4 w-4" />
                    {en ? "Find a business" : "Gjej një biznes"}
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
