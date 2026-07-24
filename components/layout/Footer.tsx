"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function Footer() {
  const { language, t } = useLanguage();
  const year = new Date().getFullYear();
  const pathname = usePathname();
  
  // Add extra padding on mobile for listing pages because of the sticky contact bar
  const isListingPage = pathname?.startsWith("/listings/");

  return (
    <footer
      className={`mt-0 ${isListingPage ? 'pb-20 sm:pb-0' : ''}`}
      style={{
        borderTop: "1px solid var(--border-soft)",
        background: "var(--surface-cream)"
      }}
    >
      {/* CTA Banner */}
      <div className="page-shell pt-8 pb-3">
        <div
          className="rounded-2xl px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
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
              className="btn-primary"
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
      <div className="page-shell py-8">
        <div className="grid gap-8 md:gap-6 md:grid-cols-5 text-left md:text-left">
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
          <div className="space-y-3 md:space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t.nav.explore || (language === "en" ? "Explore" : "Eksploro")}
            </p>
            {[
              { href: "/", label: t.nav.home },
              { href: "/services", label: t.footer.destinations },
              { href: "/blog", label: t.nav.blog },
              { href: "/about-us", label: t.nav.aboutUs || (language === "en" ? "About Us" : "Rreth Nesh") },
              { href: "/faq", label: t.footer.faqShort }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-[var(--text-secondary)] hover:text-[var(--brand-accent)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* For Businesses */}
          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t.footer.forBusinesses}
            </p>
            {[
              { href: "/create-listing", label: t.footer.listBusiness },
              { href: "/register", label: t.nav.register },
              { href: "/login", label: t.nav.login }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-[var(--text-secondary)] hover:text-[var(--brand-accent)] transition-colors"
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
              className="inline-block text-sm font-medium whitespace-nowrap text-[var(--brand-accent)] hover:text-[var(--brand-hover)] transition-colors"
            >
              infoturizemalbania@gmail.com
            </a>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {language === "en" ? "We respond within 24 hours" : "Përgjigjemi brenda 24 orëve"}
            </p>
          </div>

          {/* Social */}
          <div className="space-y-3 flex flex-col items-left md:items-start">
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-medium)] bg-[var(--surface-white)] text-[var(--text-secondary)] hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)] hover:bg-[var(--brand-light)] transition-all"
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left"
          style={{ borderTop: "1px solid var(--border-soft)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © {year} TripShqip.com – {t.footer.bottomTagline}
          </p>
          <div className="flex items-center justify-left gap-4">
            <Link
              href="/terms-and-conditions"
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {t.nav.terms || (language === "en" ? "Terms and Conditions" : "Kushtet")}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {t.nav.privacy || (language === "en" ? "Privacy Policy" : "Privatesia")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
