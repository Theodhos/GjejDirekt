"use client";

import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import SocialLogin from "@/components/auth/SocialLogin";

export default function LoginPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section
      className="page-shell flex min-h-[80vh] items-center py-12 sm:py-20"
      style={{ background: "var(--surface-page)" }}
    >
      <div
        className="mx-auto w-full max-w-5xl overflow-hidden"
        style={{
          borderRadius: "20px",
          border: "1px solid var(--border-soft)",
          boxShadow: "var(--shadow-panel)",
          display: "grid",
        }}
      >
        {/* Layout wrapper */}
        <div className="grid lg:grid-cols-2">

          {/* Left — Image Panel */}
          <div
            className="relative overflow-hidden min-h-[320px] lg:min-h-full"
            style={{ borderRadius: "20px 0 0 20px" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80"
              alt="Travel inspiration"
              fill
              className="object-cover"
            />
            {/* Refined warm overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(10,12,16,0.88) 0%, rgba(10,12,16,0.35) 55%, rgba(10,12,16,0.1) 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
              <p className="eyebrow mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t.login.welcome}
              </p>
              <h1
                className="display-font font-bold text-white mb-4 leading-tight"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
              >
                {t.login.signInTitle}
              </h1>
              <p
                className="text-sm leading-relaxed mb-8 max-w-xs"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {t.login.description}
              </p>

              {/* Feature badges */}
              <div className="grid grid-cols-2 gap-2.5">
                {t.login.features.map((item: string) => (
                  <div
                    key={item}
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(8px)"
                    }}
                  >
                    <p
                      className="text-[9px] font-semibold uppercase tracking-[0.18em] mb-1"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {t.login.featureLabel}
                    </p>
                    <p className="text-xs font-semibold text-white leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div
            className="flex flex-col justify-center p-8 sm:p-12"
            style={{ background: "var(--surface-white)" }}
          >
            <div className="max-w-sm mx-auto w-full">
              {/* Heading */}
              <div className="mb-8">
                <h2
                  className="font-bold mb-2"
                  style={{ fontSize: "1.625rem", color: "var(--text-primary)" }}
                >
                  {t.nav.login}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {language === "en"
                    ? "Enter your credentials to continue your journey."
                    : "Vendosni kredencialet tuaja për të vazhduar udhëtimin tuaj."}
                </p>
              </div>

              {/* Auth Form */}
              <AuthForm mode="login" />

              {/* Social Login */}
              <div className="mt-6">
                <SocialLogin />
              </div>

              {/* Register Link */}
              <p
                className="mt-7 text-center text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.login.newToPlatform}{" "}
                <Link
                  href="/register"
                  className="font-semibold transition-colors"
                  style={{ color: "var(--brand-accent)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-hover)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-accent)")}
                >
                  {t.nav.register}
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
