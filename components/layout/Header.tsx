"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Menu, PlusCircle, User, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/layout/Logo";

type Me = { name: string; role: "user" | "admin" } | null;
type NavItem =
  | { href: string; label: string }
  | { label: string; onClick: () => void };

export default function Header() {
  const [me, setMe] = useState<Me>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideForSearchOverlay, setHideForSearchOverlay] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadMe = () => {
      fetch(`/api/auth/me?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => setMe(data.user ?? null))
        .catch(() => setMe(null));
    };

    loadMe();

    const handleAuthChange = () => { loadMe(); };
    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleSearchOverlay = (event: Event) => {
      const custom = event as CustomEvent<{ open?: boolean }>;
      setHideForSearchOverlay(Boolean(custom.detail?.open));
      if (custom.detail?.open) setMobileOpen(false);
    };

    window.addEventListener("mobile-search-overlay", handleSearchOverlay as EventListener);
    return () => window.removeEventListener("mobile-search-overlay", handleSearchOverlay as EventListener);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setMobileOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  }

  const publicLinks = [
    { href: "/", label: t.nav.home },
    { href: "/listings", label: language === "en" ? "Businesses" : "Bizneset" },
    { href: "/packet", label: t.nav.packet || (language === "en" ? "Boost Bookings" : "Rrit Porositë") },
    { href: "/blog", label: t.nav.blog },
    { href: "/create-listing", label: t.nav.addListing }
  ];

  const authenticatedLinks: NavItem[] = me
    ? me.role === "admin"
      ? [
          { href: "/admin", label: t.admin.navAdminLabel || "Admin" },
          { label: t.nav.logout, onClick: logout }
        ]
      : [
          { href: "/dashboard", label: language === "en" ? "My Dashboard" : "Paneli im" },
          { label: t.nav.logout, onClick: logout }
        ]
    : [];

  /** Where the avatar button sends people depends on whether they are signed in. */
  const accountHref = me ? (me.role === "admin" ? "/admin" : "/dashboard") : "/login";

  if (hideForSearchOverlay) return null;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full transition-shadow duration-200"
      style={{
        background: "var(--surface-white)",
        boxShadow: scrolled ? "0 1px 10px rgba(15,20,25,0.07)" : "none"
      }}
    >
      {/* Below `lg`: a true 3-column bar (equal-width outer tracks) so the logo
          sits dead-center between the menu button and the icons, regardless of
          their different widths — not left-anchored with the extra space
          trailing on the right, like a plain flex row would leave it.
          At `lg` and up this switches back to the original flex nav bar. */}
      <div className="page-shell grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 sm:gap-4 lg:flex">
        {/* Menu — the drawer is the only way to reach secondary links on phones */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="-ml-1 inline-flex h-9 w-9 shrink-0 items-center justify-self-start rounded-xl transition-colors lg:hidden"
          style={{ color: "var(--text-primary)", background: mobileOpen ? "var(--surface-subtle)" : "transparent" }}
          aria-label={language === "en" ? "Toggle navigation" : "Hap menunë"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-[22px] w-[22px]" /> : <Menu className="h-[22px] w-[22px]" />}
        </button>

        {/* Logo — centered in its own column on mobile, left-anchored again on desktop */}
        <Link href="/" onClick={() => setMobileOpen(false)} className="shrink-0 justify-self-center lg:justify-self-auto">
          <Logo className="text-[19px] sm:text-[21px]" />
        </Link>

        {/* Everything else collapses into one grid column on mobile (so the logo
            column above stays perfectly centered) and unwraps back into normal
            flex siblings at `lg` via `contents` — desktop layout/order is
            byte-for-byte the same as before. */}
        <div className="flex items-center justify-self-end gap-0.5 lg:contents">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:ml-4 lg:flex">
            {publicLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 lg:block" />

          {/* Desktop right */}
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {me ? (
              authenticatedLinks.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {item.label}
                  </button>
                )
              )
            ) : (
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                {t.nav.login}
              </Link>
            )}
            <Link href="/create-listing" className="btn-primary">
              <PlusCircle className="h-4 w-4" />
              {t.nav.addListing}
            </Link>
          </div>

          {/* Mobile right — notifications and account, exactly the two icons in the mock */}
          <div className="flex items-center gap-0.5 lg:hidden">
            <Link
              href={me ? "/dashboard" : "/login"}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{ color: "var(--text-primary)" }}
              aria-label={language === "en" ? "Notifications" : "Njoftimet"}
            >
              <Bell className="h-[21px] w-[21px]" strokeWidth={1.9} />
            </Link>
            <Link
              href={accountHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{ color: "var(--text-primary)" }}
              aria-label={me ? me.name : t.nav.login}
            >
              <User className="h-[21px] w-[21px]" strokeWidth={1.9} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="border-t lg:hidden"
          style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}
        >
          <div className="page-shell space-y-3 py-4">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-soft)" }}>
              {publicLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3.5 text-[15px] font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-subtle)]"
                  style={{ borderTop: index ? "1px solid var(--border-soft)" : "none" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {me &&
                authenticatedLinks.map((item) =>
                  "href" in item ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3.5 text-[15px] font-semibold text-[var(--text-primary)]"
                      style={{ borderTop: "1px solid var(--border-soft)" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.onClick}
                      className="block w-full px-4 py-3.5 text-left text-[15px] font-semibold"
                      style={{ borderTop: "1px solid var(--border-soft)", color: "var(--brand-accent)" }}
                    >
                      {item.label}
                    </button>
                  )
                )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <LanguageSwitcher />
              {me ? (
                <span className="truncate text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {language === "en" ? `Hi, ${me.name}` : `Përshëndetje, ${me.name}`}
                </span>
              ) : null}
            </div>

            {!me && (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full"
                >
                  {t.nav.login}
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
