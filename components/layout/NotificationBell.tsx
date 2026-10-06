"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BadgeCheck, CalendarCheck, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

export type AppNotification = {
  _id: string;
  type: "order" | "reservation" | "listing_approved";
  title: string;
  body?: string;
  listingTitle?: string;
  href?: string;
  read: boolean;
  createdAt: string;
};

const POLL_MS = 30_000;

/** The icon for each notification kind, shared with the dashboard panel. */
export function notificationIcon(type: AppNotification["type"]) {
  if (type === "order") return ShoppingBag;
  if (type === "reservation") return CalendarCheck;
  return BadgeCheck;
}

/** "para 5 min" / "5 min ago" style relative time, short enough for a dropdown row. */
export function timeAgo(value: string, en: boolean) {
  const diff = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return en ? "just now" : "tani";
  if (minutes < 60) return en ? `${minutes} min ago` : `para ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return en ? `${hours} h ago` : `para ${hours} orësh`;
  const days = Math.floor(hours / 24);
  return en ? `${days} d ago` : `para ${days} ditësh`;
}

/**
 * The header bell for a business account. Polls /api/notifications while signed in,
 * shows the unread count as a badge, toasts when a new one lands, and opens a dropdown
 * with the latest rows. Each row links to its target and marks itself read on the way.
 */
export default function NotificationBell({ className }: { className?: string }) {
  const { language } = useLanguage();
  const en = language === "en";
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // The newest id we've already seen — anything newer than it is "new" and gets a toast.
  const latestSeen = useRef<string | null>(null);
  const primed = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const list: AppNotification[] = Array.isArray(data.notifications) ? data.notifications : [];
      setItems(list);
      setUnread(Number(data.unreadCount) || 0);

      const newest = list[0];
      if (primed.current && newest && newest._id !== latestSeen.current && !newest.read) {
        toast(newest.title, { icon: newest.type === "order" ? "🛍️" : newest.type === "reservation" ? "📅" : "✅", duration: 6000 });
      }
      if (newest) latestSeen.current = newest._id;
      primed.current = true;
    } catch {
      // Offline or signed out — try again on the next tick.
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, POLL_MS);
    const refresh = () => load();
    window.addEventListener("focus", refresh);
    window.addEventListener("notifications-changed", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("notifications-changed", refresh);
    };
  }, [load]);

  // Click outside / Escape closes the dropdown.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markRead = async (ids: string[] | "all") => {
    setItems((prev) => prev.map((item) => (ids === "all" || ids.includes(item._id) ? { ...item, read: true } : item)));
    setUnread((prev) => (ids === "all" ? 0 : Math.max(0, prev - ids.length)));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids === "all" ? { all: true } : { ids })
      });
      window.dispatchEvent(new Event("notifications-changed"));
    } catch {
      // The next poll will reconcile.
    }
  };

  const label = en ? "Notifications" : "Njoftimet";

  return (
    <div ref={wrapRef} className={`relative ${className || ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[var(--surface-subtle)]"
        style={{ color: "var(--text-primary)", background: open ? "var(--surface-subtle)" : "var(--surface-cream)" }}
        aria-label={unread ? `${label} (${unread})` : label}
        aria-expanded={open}
      >
        <Bell className="h-[19px] w-[19px]" strokeWidth={1.9} />
        {unread > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
            style={{ background: "var(--brand-accent)", boxShadow: "0 0 0 2px var(--surface-white)" }}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-x-3 top-[calc(var(--header-height)+4px)] z-50 overflow-hidden rounded-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+8px)] sm:w-[360px]"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "0 16px 40px rgba(15,20,25,0.14)" }}
          role="dialog"
          aria-label={label}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {label}
            </p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markRead("all")}
                className="text-xs font-semibold hover:underline"
                style={{ color: "var(--brand-accent)" }}
              >
                {en ? "Mark all read" : "Shëno të gjitha si të lexuara"}
              </button>
            )}
          </div>

          <div className="max-h-[min(60vh,420px)] overflow-y-auto">
            {items.length ? (
              items.slice(0, 12).map((item) => {
                const Icon = notificationIcon(item.type);
                return (
                  <Link
                    key={item._id}
                    href={item.href || "/dashboard#njoftimet"}
                    onClick={() => {
                      setOpen(false);
                      if (!item.read) markRead([item._id]);
                    }}
                    className="flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-subtle)]"
                    style={{ borderBottom: "1px solid var(--border-soft)", background: item.read ? undefined : "var(--brand-light)" }}
                  >
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "var(--surface-cream)", color: "var(--brand-accent)" }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                          {item.title}
                        </span>
                        <span className="shrink-0 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          {timeAgo(item.createdAt, en)}
                        </span>
                      </span>
                      {item.body && (
                        <span className="mt-0.5 block truncate text-xs" style={{ color: "var(--text-secondary)" }}>
                          {item.body}
                        </span>
                      )}
                      {item.listingTitle && item.type !== "listing_approved" && (
                        <span className="mt-0.5 block text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                          {item.listingTitle}
                        </span>
                      )}
                    </span>
                    {!item.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--brand-accent)" }} />}
                  </Link>
                );
              })
            ) : (
              <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                {en ? "No notifications yet." : "Ende asnjë njoftim."}
              </p>
            )}
          </div>

          <Link
            href="/dashboard#njoftimet"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-center text-xs font-semibold hover:underline"
            style={{ color: "var(--brand-accent)" }}
          >
            {en ? "See all in dashboard" : "Shiko të gjitha në panel"}
          </Link>
        </div>
      )}
    </div>
  );
}
