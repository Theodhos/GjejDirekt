"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function Footer() {
  const { language, t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-0"
      style={{
        borderTop: "1px solid var(--border-soft)",
        background: "var(--surface-cream)"
      }}
    >
      {/* CTA Banner */}
      <div className="page-shell pt-12 pb-4">
        <div
          className="rounded-2xl px-8 py-10 sm:px-12 sm:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{
            background: "var(--text-primary)",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {t.footer.platformName}
            </p>
            <h2 className="display-font text-2xl sm:text-3xl font-bold leading-tight text-white">
              {t.footer.tagline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t.footer.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: "var(--brand-accent)", boxShadow: "0 2px 12px rgba(34,153,120,0.3)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}
            >
              {t.footer.exploreServices}
            </Link>
            <Link
              href="/create-listing"
              className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              {t.footer.addListing}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="page-shell py-10">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1 md:pr-4">
            <p
              className="text-base font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Gjej Direkt
            </p>
            <p
              className="mt-2.5 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.footer.description}
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t.nav.explore || (language === "en" ? "Explore" : "Eksploro")}
            </p>
            {[
              { href: "/", label: t.nav.home },
              { href: "/services", label: t.nav.services },
              { href: "/blog", label: t.nav.blog },
              { href: "/about-us", label: t.nav.aboutUs || (language === "en" ? "About Us" : "Rreth Nesh") },
              { href: "/faq", label: t.nav.faq || (language === "en" ? "FAQ" : "Pyetje të Shpeshta") }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-accent)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Get Started */}
          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t.footer.getStarted}
            </p>
            {[
              { href: "/create-listing", label: t.nav.addListing },
              { href: "/register", label: t.nav.register },
              { href: "/login", label: t.nav.login }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-accent)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t.footer.contactTitle}
            </p>
            <a
              href="mailto:infoturizemalbania@gmail.com"
              className="inline-block text-sm font-medium whitespace-nowrap transition-colors"
              style={{ color: "var(--brand-accent)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-hover)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-accent)")}
            >
              infoturizemalbania@gmail.com
            </a>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {language === "en" ? "We respond within 24 hours" : "Përgjigjemi brenda 24 orëve"}
            </p>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t.footer.follow}
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: Facebook, href: "/" },
                { icon: Instagram, href: "/" },
                { icon: Linkedin, href: "/" },
                { icon: Youtube, href: "/" }
              ].map(({ icon: Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all"
                  style={{
                    borderColor: "var(--border-medium)",
                    background: "var(--surface-white)",
                    color: "var(--text-secondary)"
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--brand-accent)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-accent)";
                    (e.currentTarget as HTMLElement).style.background = "var(--brand-light)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
                    (e.currentTarget as HTMLElement).style.background = "var(--surface-white)";
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid var(--border-soft)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © {year} Gjej Direkt. {t.footer.rightsReserved}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms-and-conditions"
              className="text-xs transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              {t.nav.terms || (language === "en" ? "Terms and Conditions" : "Kushtet")}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              {t.nav.privacy || (language === "en" ? "Privacy Policy" : "Privatesia")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
