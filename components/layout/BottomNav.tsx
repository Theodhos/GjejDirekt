"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleUser, Heart, Home, LayoutGrid, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Kreu · Katalogu · Porositë · Të preferuarat · Profili. Each tab also owns the pages
 * that belong under it (a business page is still the catalog, the sign-in pages are
 * still the profile), so the bar always says where you are.
 */
const TABS = [
  { href: "/", icon: Home, al: "Kreu", en: "Home", also: [] },
  { href: "/listings", icon: LayoutGrid, al: "Katalogu", en: "Catalog", also: ["/categories", "/services", "/city", "/cities"] },
  { href: "/porosite", icon: ShoppingCart, al: "Porositë", en: "Orders", also: [] },
  { href: "/te-preferuara", icon: Heart, al: "Të preferuarat", en: "Saved", also: [] },
  { href: "/me-shume", icon: CircleUser, al: "Profili", en: "Profile", also: ["/dashboard", "/login", "/register"] }
] as const;

/**
 * The tab bar. It is the primary navigation on a phone and stays fixed at the bottom of the
 * screen on every page and every screen size (desktop included, under the footer);
 * `--bottom-nav-height` reserves the space it covers.
 */
export default function BottomNav() {
  const pathname = usePathname() || "/";
  const { language } = useLanguage();
  const [hidden, setHidden] = useState(false);

  // The mobile search overlay takes over the whole screen — the bar would float on top of it.
  useEffect(() => {
    const onOverlay = (event: Event) => {
      const custom = event as CustomEvent<{ open?: boolean }>;
      setHidden(Boolean(custom.detail?.open));
    };
    window.addEventListener("mobile-search-overlay", onOverlay as EventListener);
    return () => window.removeEventListener("mobile-search-overlay", onOverlay as EventListener);
  }, []);

  // Admin runs its own chrome and never needs the consumer tab bar.
  const hideBar = pathname.startsWith("/admin") || hidden;

  // Without the bar there is nothing to make room for.
  useEffect(() => {
    const root = document.documentElement;
    if (hideBar) root.dataset.noBottomNav = "1";
    else delete root.dataset.noBottomNav;
    return () => {
      delete root.dataset.noBottomNav;
    };
  }, [hideBar]);

  if (hideBar) return null;

  const isActive = (tab: (typeof TABS)[number]) =>
    tab.href === "/" ? pathname === "/" : [tab.href, ...tab.also].some((prefix) => pathname.startsWith(prefix));

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        height: "var(--bottom-nav-height)",
        background: "var(--surface-white)",
        borderTop: "1px solid var(--border-soft)",
        boxShadow: "0 -1px 12px rgba(15,20,25,0.06)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
      aria-label={language === "en" ? "Main navigation" : "Navigimi kryesor"}
    >
      <ul className="mx-auto flex h-full max-w-lg items-stretch lg:max-w-xl">
        {TABS.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="relative flex-1">
              {/* Active indicator line at the top */}
              {active && (
                <span
                  className="absolute inset-x-0 top-0 mx-auto h-[2.5px] w-6 rounded-b-full"
                  style={{ background: "var(--brand-accent)" }}
                />
              )}
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center gap-1 px-0.5 transition-colors"
                style={{ color: active ? "var(--brand-accent)" : "var(--text-tertiary)" }}
              >
                <Icon
                  className="h-[21px] w-[21px] transition-transform"
                  strokeWidth={active ? 2.4 : 1.9}
                  style={{ transform: active ? "scale(1.05)" : "scale(1)" }}
                />
                <span
                  className="max-w-full truncate text-[10px] leading-none max-[359px]:text-[9px]"
                  style={{ fontWeight: active ? 700 : 500 }}
                >
                  {language === "en" ? tab.en : tab.al}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
