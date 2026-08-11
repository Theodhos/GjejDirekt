"use client";

import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import SocialLogin from "@/components/auth/SocialLogin";
import { redirectQuery, useRedirectParam } from "@/lib/auth-redirect";

export default function LoginPage() {
  const { language } = useLanguage();
  const t = translations[language];
  // Carried over so "create an account" keeps the visitor inside the same flow.
  const redirect = useRedirectParam();

  return (
    /* min-height (not a fixed height) lets the card grow with its content, so the
       register block at the bottom is never clipped on short screens. */
    <section
      className="page-shell flex items-center justify-center min-h-[calc(100vh-var(--header-height))] py-8 sm:py-12"
      style={{ background: "var(--surface-page)" }}
    >
      <div className="surface w-full max-w-5xl overflow-hidden">
        <div className="grid lg:grid-cols-2">

          {/* Left — Image Panel */}
          <div className="relative hidden lg:block overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80"
              alt="Travel inspiration"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 0px"
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 45%, transparent 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-10 xl:p-12">
              <h1
                className="text-[1.75rem] xl:text-3xl font-bold text-white leading-snug"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              >
                {t.login.signInTitle}
              </h1>
              <p className="mt-3 text-sm xl:text-base text-white/80 leading-relaxed">
                {language === "en"
                  ? "Discover the hidden gems of Albania."
                  : "Zbuloni perlat e fshehura të Shqipërisë."}
              </p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div
            className="flex flex-col justify-center p-7 sm:p-10"
            style={{ background: "var(--surface-white)" }}
          >
            <div className="w-full max-w-sm mx-auto">
              {/* Heading */}
              <div className="mb-7">
                <h2
                  className="font-bold tracking-tight"
                  style={{ fontSize: "1.625rem", color: "var(--text-primary)" }}
                >
                  {t.nav.login}
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {t.login.signInSubtitle}
                </p>
              </div>

              {/* Auth Form */}
              <AuthForm mode="login" />

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1" style={{ background: "var(--border-soft)" }} />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {language === "en" ? "or" : "ose"}
                </span>
                <span className="h-px flex-1" style={{ background: "var(--border-soft)" }} />
              </div>

              {/* Social Login */}
              <SocialLogin />

              {/* Register — same plain, centred line used on the register page */}
              <p className="mt-7 text-center text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                {t.login.noAccount} {t.login.listFreePitch}{" "}
                <Link
                  href={`/register${redirectQuery(redirect)}`}
                  className="font-semibold transition-colors text-[var(--brand-accent)] hover:text-[var(--brand-hover)]"
                >
                  {t.nav.register}
                </Link>
              </p>

            </div>

            {/* Perks — one line from sm up (it sits outside the narrow form column
                so all three fit), wraps naturally on phones. */}
            <ul className="mt-3 mx-auto w-full max-w-md flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
              {t.login.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Check className="h-2.5 w-2.5 shrink-0" strokeWidth={3.5} style={{ color: "var(--brand-accent)" }} />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
