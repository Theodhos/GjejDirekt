"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Home, MessageCircle, MoreHorizontal, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TABS = [
  { href: "/", icon: Home, al: "Kreu", en: "Home" },
  { href: "/listings", icon: Search, al: "Kërko", en: "Search" },
  { href: "/te-preferuara", icon: Heart, al: "Të preferuara", en: "Saved" },
  { href: "/porosite", icon: MessageCircle, al: "Porositë", en: "Orders" },
  { href: "/me-shume", icon: MoreHorizontal, al: "Më shumë", en: "More" }
] as const;

/**
 * Phone-only tab bar. It is the primary navigation on mobile, so it stays fixed
 * over the page; `--bottom-nav-height` reserves the space it covers and collapses
 * to 0 from `lg` up, where the header carries navigation instead.
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
  if (pathname.startsWith("/admin") || hidden) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{
        height: "var(--bottom-nav-height)",
        background: "var(--surface-white)",
        borderTop: "1px solid var(--border-soft)",
        boxShadow: "0 -1px 12px rgba(15,20,25,0.06)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
      aria-label={language === "en" ? "Main navigation" : "Navigimi kryesor"}
    >
      <ul className="mx-auto flex h-full max-w-lg items-stretch">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
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
                className="flex h-full flex-col items-center justify-center gap-1 px-1 transition-colors"
                style={{ color: active ? "var(--brand-accent)" : "var(--text-tertiary)" }}
              >
                <Icon
                  className="h-[21px] w-[21px] transition-transform"
                  strokeWidth={active ? 2.4 : 1.9}
                  style={{ transform: active ? "scale(1.05)" : "scale(1)" }}
                />
                <span
                  className="max-w-full truncate text-[10px] leading-none"
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
