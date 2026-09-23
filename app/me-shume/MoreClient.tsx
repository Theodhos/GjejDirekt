"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Building2,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  type LucideIcon,
  Shield,
  Sparkles,
  User
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RegisterBusinessCTA from "@/components/home/RegisterBusinessCTA";
import { useLanguage } from "@/context/LanguageContext";

type Me = { name: string; role: "user" | "admin" } | null;
type Row = { href: string; icon: LucideIcon; label: string };

const SUPPORT_EMAIL = "infoturizemalbania@gmail.com";

/**
 * The "Më shumë" tab. Everything the tab bar cannot hold lives here, grouped so
 * the page works as the mobile site map.
 */
export default function MoreClient() {
  const { language } = useLanguage();
  const [me, setMe] = useState<Me>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setMe(data.user ?? null))
      .catch(() => setMe(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  }

  const en = language === "en";

  const accountRows: Row[] = me
    ? [
        {
          href: me.role === "admin" ? "/admin" : "/dashboard",
          icon: LayoutDashboard,
          label: me.role === "admin" ? "Admin" : en ? "My dashboard" : "Paneli im"
        },
        { href: "/create-listing", icon: Building2, label: en ? "Add a business" : "Shto biznes" }
      ]
    : [
        { href: "/login", icon: User, label: en ? "Sign in" : "Hyr" },
        { href: "/register", icon: BadgeCheck, label: en ? "Create an account" : "Krijo llogari" }
      ];

  const discoverRows: Row[] = [
    { href: "/categories/shopping", icon: Sparkles, label: en ? "Categories" : "Kategoritë" },
    { href: "/cities", icon: Building2, label: en ? "Cities" : "Qytetet" },
    { href: "/blog", icon: BookOpen, label: "Blog" },
    { href: "/packet", icon: BadgeCheck, label: en ? "Plans for businesses" : "Paketat për bizneset" }
  ];

  const aboutRows: Row[] = [
    { href: "/about-us", icon: HelpCircle, label: en ? "About us" : "Rreth nesh" },
    { href: "/faq", icon: HelpCircle, label: "FAQ" },
    { href: "/terms-and-conditions", icon: FileText, label: en ? "Terms" : "Kushtet e përdorimit" },
    { href: "/privacy-policy", icon: Shield, label: en ? "Privacy" : "Privatësia" }
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <PageHeader
        title={en ? "Profile" : "Profili"}
        description={me ? (en ? `Signed in as ${me.name}` : `I identifikuar si ${me.name}`) : undefined}
      />

      <div className="page-shell space-y-4 py-4 sm:py-6">
        <RegisterBusinessCTA />

        <LinkGroup title={en ? "Account" : "Llogaria"} rows={accountRows} />
        <LinkGroup title={en ? "Discover" : "Zbulo"} rows={discoverRows} />
        <LinkGroup title={en ? "About GjejDirekt" : "Rreth GjejDirekt"} rows={aboutRows} />

        <section className="gd-panel p-3.5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-tertiary)" }}>
            {en ? "Language" : "Gjuha"}
          </p>
          <LanguageSwitcher />
        </section>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="gd-card flex items-center gap-3 p-3.5"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
          >
            <Mail className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {en ? "Contact us" : "Na kontakto"}
            </span>
            <span className="block truncate text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              {SUPPORT_EMAIL}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
        </a>

        {me && (
          <button
            type="button"
            onClick={logout}
            className="gd-card flex w-full items-center gap-3 p-3.5 text-left"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
            >
              <LogOut className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1 text-[14px] font-semibold" style={{ color: "var(--brand-accent)" }}>
              {en ? "Sign out" : "Dil"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function LinkGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section>
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-tertiary)" }}>
        {title}
      </p>
      <ul className="gd-panel overflow-hidden">
        {rows.map((row, index) => (
          <li key={row.href} style={{ borderTop: index ? "1px solid var(--border-soft)" : "none" }}>
            <Link href={row.href} className="flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-[var(--surface-cream)]">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--surface-subtle)", color: "var(--text-secondary)" }}
              >
                <row.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {row.label}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
