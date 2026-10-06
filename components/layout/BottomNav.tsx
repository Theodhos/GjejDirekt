"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Plus, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Me = { role: "user" | "admin"; accountType?: "biznes" | "klient" } | null;

/**
 * The bar pinned to the bottom of every page: Të preferuarat, Shto biznes, Porositë.
 * A "klient" account only browses and orders, so it never sees "Shto biznes"; every
 * other level (guest, business, admin) gets all three.
 *
 * Its height is `--bottom-nav-height` in globals.css — the page and the other sticky
 * bars (basket, chat toggle) offset themselves by that value.
 */
export default function BottomNav() {
  const { language } = useLanguage();
  const en = language === "en";
  const pathname = usePathname() || "";
  const [me, setMe] = useState<Me>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const loadMe = () => {
      fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => setMe(data.user ?? null))
        .catch(() => setMe(null));
    };

    loadMe();
    window.addEventListener("auth-changed", loadMe);
    return () => window.removeEventListener("auth-changed", loadMe);
  }, []);

  // The full-screen phone search covers the whole page, this bar included.
  useEffect(() => {
    const handleSearchOverlay = (event: Event) => {
      setHidden(Boolean((event as CustomEvent<{ open?: boolean }>).detail?.open));
    };
    window.addEventListener("mobile-search-overlay", handleSearchOverlay);
    return () => window.removeEventListener("mobile-search-overlay", handleSearchOverlay);
  }, []);

  const isClientAccount = me?.accountType === "klient" && me.role !== "admin";

  const items = [
    {
      href: "/te-preferuara",
      label: en ? "Favorites" : "Të preferuarat",
      icon: Heart,
      active: pathname.startsWith("/te-preferuara"),
      primary: false
    },
    ...(isClientAccount
      ? []
      : [
          {
            href: "/create-listing",
            label: en ? "Add business" : "Shto biznes",
            icon: Plus,
            active: pathname.startsWith("/create-listing") || pathname.startsWith("/listings/add"),
            primary: true
          }
        ]),
    {
      href: "/porosite",
      label: en ? "Orders" : "Porositë",
      icon: ShoppingBag,
      active: pathname.startsWith("/porosite"),
      primary: false
    }
  ];

  if (hidden) return null;

  return (
    <nav
      aria-label={en ? "Quick links" : "Lidhje të shpejta"}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-white"
      style={{
        height: "var(--bottom-nav-height)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        borderColor: "var(--border-soft)",
        boxShadow: "0 -4px 20px rgba(15,20,25,0.06)"
      }}
    >
      <ul className="mx-auto flex h-full max-w-[560px] items-stretch">
        {items.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className="flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors"
              style={{ color: item.active || item.primary ? "var(--brand-accent)" : "var(--text-secondary)" }}
            >
              {item.primary ? (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--brand-accent)" }}
                >
                  <item.icon className="h-4 w-4" strokeWidth={2.4} />
                </span>
              ) : (
                <item.icon
                  className="h-[22px] w-[22px]"
                  fill={item.active && item.icon === Heart ? "var(--brand-accent)" : "none"}
                />
              )}
              <span className="leading-none">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
