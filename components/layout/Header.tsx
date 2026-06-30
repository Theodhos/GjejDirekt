"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, PlusCircle } from "lucide-react";
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
          { label: t.nav.logout, onClick: logout }
        ]
      : [
          { href: "/dashboard", label: language === "en" ? "My Dashboard" : "Paneli im" },
          { label: t.nav.logout, onClick: logout }
        ]
    : [];

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
      <div className="page-shell flex items-center justify-between gap-3 py-3.5 sm:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/uploads/trip-shqip-logo.jpeg"
            alt="TripShqip Logo"
            width={140}
            height={40}
            className="h-7 w-auto object-contain min-[360px]:h-8 sm:h-9 md:h-10"
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
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="btn-primary"
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex min-w-0 items-center gap-2 lg:hidden sm:gap-2.5">
          {me ? (
            <span className="hidden text-sm font-medium text-warm-700 md:inline" style={{ color: "var(--text-secondary)" }}>
              {language === "en" ? `Hi, ${me.name}` : `Përshëndetje, ${me.name}`}
            </span>
          ) : null}

          <Link
            href="/create-listing"
            className="btn-primary inline-flex items-center shrink-0 whitespace-nowrap transition-all duration-200 !gap-1 !px-2.5 !py-1.5 !text-[10px] !leading-none min-[360px]:!gap-1.5 min-[360px]:!px-3 min-[360px]:!py-2 min-[360px]:!text-[11px] sm:!gap-2 sm:!px-4 sm:!text-sm"
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle className="h-3 w-3 shrink-0 min-[360px]:h-3.5 min-[360px]:w-3.5 sm:h-4 sm:w-4" />
            <span className="font-semibold tracking-wide">{t.nav.addListing}</span>
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
                  className="block rounded-xl px-5 py-3.5 text-base font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-white)] hover:text-[var(--text-primary)] transition-colors"
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
                      className="block rounded-xl px-5 py-3.5 text-base font-semibold"
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
                      className="block w-full rounded-xl px-5 py-3.5 text-left text-base font-semibold"
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
                  className="btn-primary w-full"
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
