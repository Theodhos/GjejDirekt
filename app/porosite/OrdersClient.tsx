"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, MessageCircle, Trash2 } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { getCategoryLabel } from "@/lib/constants";
import { clearOrderHistory, readOrderHistory, type OrderHistoryEntry } from "@/lib/order-history";
import { formatPrice } from "@/lib/pricing";
import { useLanguage } from "@/context/LanguageContext";

/** An order as /api/orders?mine=1 returns it — saved on the account when it was sent. */
type MyOrder = {
  _id: string;
  listing?: { title?: string; slug?: string; images?: string[]; photos?: string[]; bannerImage?: string } | null;
  items: { name: string; price?: number; qty: number }[];
  total?: number;
  status: "new" | "confirmed" | "declined" | "cancelled";
  createdAt: string;
};

const STATUS_LABELS: Record<MyOrder["status"], { sq: string; en: string; color: string; background: string }> = {
  new: { sq: "Dërguar", en: "Sent", color: "#1D4ED8", background: "#DBEAFE" },
  confirmed: { sq: "Konfirmuar", en: "Confirmed", color: "#15803D", background: "#DCFCE7" },
  declined: { sq: "Refuzuar", en: "Declined", color: "#DC2626", background: "#FEE2E2" },
  cancelled: { sq: "Anuluar", en: "Cancelled", color: "#6B7280", background: "#F3F4F6" }
};

export default function OrdersClient() {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<OrderHistoryEntry[]>([]);
  const [ready, setReady] = useState(false);
  // Every order this account has sent; stays empty for a guest (the API answers 401).
  const [myOrders, setMyOrders] = useState<MyOrder[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/orders?mine=1", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.orders)) setMyOrders(data.orders);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const load = () => setEntries(readOrderHistory());
    load();
    setReady(true);
    window.addEventListener("order-history-changed", load);
    return () => window.removeEventListener("order-history-changed", load);
  }, []);

  const formatDate = (at: number) =>
    new Date(at).toLocaleDateString(language === "en" ? "en-GB" : "sq-AL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <PageHeader
        title={language === "en" ? "Orders" : "Porositë"}
        description={
          language === "en"
            ? "The businesses you contacted to order or book."
            : "Bizneset që ke kontaktuar për të porositur ose rezervuar."
        }
        action={
          entries.length > 0 ? (
            <button
              type="button"
              onClick={clearOrderHistory}
              className="btn-secondary !px-3 !py-2 !text-[13px]"
            >
              <Trash2 className="h-4 w-4" />
              {language === "en" ? "Clear" : "Pastro"}
            </button>
          ) : undefined
        }
      />

      <div className="page-shell space-y-4 py-4 sm:py-6">
        {/* Orders are placed inside WhatsApp, so it has to be said plainly that the
            platform is not holding an order status anywhere. */}
        <div
          className="flex gap-2.5 rounded-xl border p-3"
          style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--brand-accent)" }} />
          <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {language === "en"
              ? "Orders on GjejDirekt happen directly in WhatsApp with the business — there is no commission and no middleman. This list is kept on your device so you can find a business again."
              : "Porositë në GjejDirekt bëhen direkt në WhatsApp me biznesin — pa komision dhe pa ndërmjetës. Kjo listë ruhet në pajisjen tënde që ta gjesh sërish biznesin."}
          </p>
        </div>

        {myOrders.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="!text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
              {language === "en" ? "My orders" : "Porositë e mia"}
            </h2>
            <ul className="space-y-2.5">
              {myOrders.map((order) => {
                const status = STATUS_LABELS[order.status] || STATUS_LABELS.new;
                const image = order.listing?.images?.[0] || order.listing?.photos?.[0] || order.listing?.bannerImage;
                const card = (
                  <>
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: "var(--surface-cream)" }}>
                      {image && <SafeImage src={image} alt="" fill sizes="56px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {order.listing?.title || (language === "en" ? "Business" : "Biznes")}
                        </span>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ color: status.color, background: status.background }}
                        >
                          {language === "en" ? status.en : status.sq}
                        </span>
                      </span>
                      <span className="block truncate text-[12px]" style={{ color: "var(--text-secondary)" }}>
                        {order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
                      </span>
                      <span className="block text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {formatDate(new Date(order.createdAt).getTime())}
                      </span>
                    </span>
                    {typeof order.total === "number" && (
                      <span className="shrink-0 text-[13px] font-bold" style={{ color: "var(--brand-accent)" }}>
                        {formatPrice(order.total)}
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={order._id}>
                    {order.listing?.slug ? (
                      <Link href={`/listings/${order.listing.slug}`} className="gd-card flex items-center gap-3 p-2.5">
                        {card}
                      </Link>
                    ) : (
                      <div className="gd-card flex items-center gap-3 p-2.5">{card}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {myOrders.length > 0 && entries.length > 0 && (
          <h2 className="!text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            {language === "en" ? "Businesses you contacted" : "Bizneset që ke kontaktuar"}
          </h2>
        )}

        {ready &&
          (entries.length ? (
            <ul className="space-y-2.5">
              {entries.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/listings/${entry.slug}`}
                    className="gd-card flex items-center gap-3 p-2.5"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <SafeImage src={entry.image} alt={entry.title} fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                        {entry.title}
                      </span>
                      <span className="block truncate text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
                        {[getCategoryLabel(entry.category), entry.location].filter(Boolean).join(" · ")}
                      </span>
                      <span className="block text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {formatDate(entry.at)}
                      </span>
                    </span>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: "var(--whatsapp-green)" }}
                      aria-hidden
                    >
                      <MessageCircle className="h-[18px] w-[18px]" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : myOrders.length > 0 ? null : (
            <EmptyState
              icon={MessageCircle}
              title={language === "en" ? "No orders yet" : "Ende asnjë porosi"}
              description={
                language === "en"
                  ? "Tap WhatsApp on any business and it shows up here."
                  : "Shtyp WhatsApp te një biznes dhe do të shfaqet këtu."
              }
              action={
                <Link href="/listings" className="btn-primary">
                  {language === "en" ? "Find a business" : "Gjej një biznes"}
                </Link>
              }
            />
          ))}
      </div>
    </div>
  );
}
