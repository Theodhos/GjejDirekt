"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { notificationIcon, timeAgo, type AppNotification } from "@/components/layout/NotificationBell";

/**
 * The business dashboard's "Njoftimet" card: every ping this account has received —
 * a new order, a new reservation, the business getting approved. Marks everything
 * read once it has been on screen for a moment, so the header badge clears itself.
 */
export default function NotificationsPanel({ initial }: { initial: AppNotification[] }) {
  const { language } = useLanguage();
  const en = language === "en";
  const [items, setItems] = useState<AppNotification[]>(initial);
  const unread = items.filter((item) => !item.read).length;

  // Keep in sync with the header bell (which polls) — whenever it refreshes, so do we.
  useEffect(() => {
    const refresh = () => {
      fetch(`/api/notifications?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.notifications)) setItems(data.notifications);
        })
        .catch(() => {});
    };
    window.addEventListener("notifications-changed", refresh);
    return () => window.removeEventListener("notifications-changed", refresh);
  }, []);

  // Seen on the dashboard counts as read — after a short beat so the unread rows are
  // visible first, and the header badge then clears on its own.
  useEffect(() => {
    if (!unread) return;
    const timer = window.setTimeout(() => {
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true })
      })
        .then(() => {
          setItems((prev) => prev.map((item) => ({ ...item, read: true })));
          window.dispatchEvent(new Event("notifications-changed"));
        })
        .catch(() => {});
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [unread]);

  return (
    <div
      id="njoftimet"
      className="rounded-2xl overflow-hidden scroll-mt-[calc(var(--header-height)+16px)]"
      style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <p className="eyebrow mb-1">{en ? "Updates" : "Të rejat"}</p>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {en ? "Notifications" : "Njoftimet"}
            </h2>
          </div>
        </div>
        {unread > 0 && (
          <span
            className="rounded-full px-3.5 py-1 text-xs font-semibold"
            style={{ background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid var(--brand-border)" }}
          >
            {unread} {en ? "new" : "të reja"}
          </span>
        )}
      </div>

      {items.length ? (
        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {items.map((item) => {
            const Icon = notificationIcon(item.type);
            const row = (
              <>
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--surface-cream)", color: "var(--brand-accent)" }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </span>
                    <span className="shrink-0 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {timeAgo(item.createdAt, en)}
                    </span>
                  </span>
                  {item.body && (
                    <span className="mt-1 block text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {item.body}
                    </span>
                  )}
                  {item.listingTitle && item.type !== "listing_approved" && (
                    <span className="mt-1 block text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                      {item.listingTitle}
                    </span>
                  )}
                </span>
                {!item.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--brand-accent)" }} />}
              </>
            );
            const className = "flex gap-3 px-6 py-4 transition-colors";
            const style = { background: item.read ? undefined : "var(--brand-light)" };
            return (
              <li key={item._id}>
                {item.type === "listing_approved" && item.href ? (
                  <Link href={item.href} className={`${className} hover:bg-[var(--surface-subtle)]`} style={style}>
                    {row}
                  </Link>
                ) : (
                  <div className={className} style={style}>
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--surface-subtle)" }}>
            <Bell className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
            {en
              ? "Nothing yet — you'll be notified here when an order comes in or your business is approved."
              : "Ende asgjë — këtu do të njoftoheni kur të vijë një porosi ose kur biznesi juaj të aprovohet."}
          </p>
        </div>
      )}
    </div>
  );
}
