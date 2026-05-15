"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, Menu, X, PlusCircle } from "lucide-react";
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
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const loadMe = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => setMe(data.user ?? null))
        .catch(() => setMe(null));
    };

    loadMe();

    const handleAuthChange = () => {
      loadMe();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setMobileOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  }

  const navLinkClass =
    "text-sm font-semibold text-slate-700 transition hover:text-brand-700";
  const buttonLinkClass = navLinkClass;

  const publicLinks = [
    { href: "/", label: t.nav.home },
    { href: "/packet", label: language === 'en' ? 'Packet' : 'Paketat' },
    { href: "/blog", label: t.nav.blog },
    { href: "/listings/add", label: t.nav.addListing }
  ];

  const authenticatedLinks: NavItem[] = me
    ? me.role === "admin"
      ? [
          { href: "/admin", label: "Dashboard Admin" },
          { href: "/admin#statistics", label: "Statistics" },
          { label: "Logout", onClick: logout }
        ]
      : [
          { href: "/dashboard", label: "My Dashboard" },
          { label: "Logout", onClick: logout }
        ]
    : [];

  
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/5 bg-white/80 backdrop-blur-2xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
            <Compass className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-slate-950">Trip Shqip</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Discover more</span>
          </span>
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <nav className="flex items-center gap-4">
            {publicLinks.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher />

          <div className="flex items-center gap-3">
            {me ? (
              <>
                {authenticatedLinks.map((item) =>
                  "href" in item ? (
                    <Link key={item.href} href={item.href} className={navLinkClass}>
                      {item.label}
                    </Link>
                  ) : (
                    <button key={item.label} type="button" onClick={item.onClick} className={buttonLinkClass}>
                      {item.label}
                    </button>
                  )
                )}
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost">
                  {t.nav.login}
                </Button>
                <Button href="/register">{t.nav.register}</Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {me ? (
            <span className="hidden text-sm text-slate-600 md:inline">Hi, {me.name}</span>
          ) : null}
          {/* Add Listing button — visible on mobile next to hamburger */}
          <Link
            href="/listings/add"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:bg-brand-700 transition-all active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">{t.nav.addListing}</span>
            <span className="xs:hidden">+</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="page-shell space-y-4 py-4">
            <div className="grid gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
              {publicLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
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
                      className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.onClick}
                      className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-white"
                    >
                      {item.label}
                    </button>
                  )
                )}
            </div>

            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>

            {!me ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button href="/login" variant="ghost" onClick={() => setMobileOpen(false)}>
                  {t.nav.login}
                </Button>
                <Button href="/register" onClick={() => setMobileOpen(false)}>
                  {t.nav.register}
                </Button>
              </div>
            ) : null}

            {me ? (
              <p className="text-sm font-semibold text-slate-600">
                Hi, {me.name}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
