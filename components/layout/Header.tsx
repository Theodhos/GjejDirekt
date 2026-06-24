"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, PlusCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Me = { name: string; role: "user" | "admin" } | null;
type NavItem =
  | { href: string; label: string }
  | { label: string; onClick: () => void };

export default function Header() {
  const [me, setMe] = useState<Me>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideForSearchOverlay, setHideForSearchOverlay] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
    const onScroll = () => setScrolled(window.scrollY > 10);
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
    { href: "/packet", label: t.nav.packet || (language === "en" ? "Packets" : "Paketat") },
    { href: "/blog", label: t.nav.blog },
    { href: "/create-listing", label: t.nav.addListing }
  ];

  const authenticatedLinks: NavItem[] = me
    ? me.role === "admin"
      ? [
          { href: "/admin", label: t.admin.navAdminLabel || "Admin" },
          { label: "Dil", onClick: logout }
        ]
      : [
          { label: "Dil", onClick: logout }
        ]
    : [];

  const [adminStats, setAdminStats] = useState<{ users?: number; pendingListings?: number; totalListings?: number; reports?: number } | null>(null);

  useEffect(() => {
    if (me?.role === 'admin') {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((data) => setAdminStats(data))
        .catch(() => null);
    }
  }, [me]);

  if (hideForSearchOverlay) return null;

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled
          ? "rgba(253, 252, 250, 0.92)"
          : "rgba(253, 252, 250, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled
          ? "1px solid rgba(15,20,25,0.10)"
          : "1px solid rgba(15,20,25,0.07)",
        boxShadow: scrolled ? "0 1px 0 rgba(15,20,25,0.06)" : "none"
      }}
    >
      {/* Desktop Header */}
      <div className="page-shell flex items-center justify-between gap-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/uploads/Logo-black.png"
            alt="TripShqip Logo"
            width={140}
            height={40}
            className="h-9 md:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <nav className="flex items-center gap-1">
            {publicLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />

          {me ? (
            <>
              {authenticatedLinks.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </button>
                )
              )}
              {/* Admin stat chips removed from header per request */}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all active:scale-95"
                style={{ background: "var(--brand-accent)", boxShadow: "0 2px 8px rgba(34,153,120,0.22)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {me ? (
            <span className="hidden text-sm font-medium text-warm-700 md:inline" style={{ color: "var(--text-secondary)" }}>
              {language === "en" ? `Hi, ${me.name}` : `Përshëndetje, ${me.name}`}
            </span>
          ) : null}

          <Link
            href="/create-listing"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold text-white transition-all active:scale-95"
            style={{ background: "var(--brand-accent)" }}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{t.nav.addListing}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors lg:hidden"
            style={{
              borderColor: "var(--border-soft)",
              background: mobileOpen ? "var(--surface-subtle)" : "transparent",
              color: "var(--text-secondary)"
            }}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="border-t lg:hidden"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--surface-page)"
          }}
        >
          <div className="page-shell py-4 space-y-1">
            {/* Nav Links */}
            <div
              className="rounded-xl border p-2 space-y-0.5"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--surface-cream)"
              }}
            >
              {publicLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.background = "var(--surface-white)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
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
                      className="block rounded-lg px-4 py-2.5 text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.onClick}
                      className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.label}
                    </button>
                  )
                )}
            </div>

            {/* Language */}
            <div className="flex justify-center py-2">
              <LanguageSwitcher />
            </div>

            {/* Auth */}
            {!me && (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl border py-2.5 text-sm font-semibold transition-colors"
                  style={{
                    borderColor: "var(--border-medium)",
                    color: "var(--text-primary)",
                    background: "var(--surface-white)"
                  }}
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
                  style={{ background: "var(--brand-accent)" }}
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            {me && (
              <p className="px-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {language === "en" ? `Hi, ${me.name}` : `Përshëndetje, ${me.name}`}
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
