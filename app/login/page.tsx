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
      className="page-shell flex items-center justify-center h-[calc(100vh-5rem)] py-4"
      style={{ background: "var(--surface-page)", minHeight: "600px" }}
    >
      <div
        className="w-full max-w-5xl overflow-hidden h-full max-h-[650px]"
        style={{
          borderRadius: "1.5rem",
          border: "1px solid var(--border-soft)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)",
          display: "grid",
        }}
      >
        <div className="grid lg:grid-cols-2">

          {/* Left — Simplified Image Panel */}
          <div className="relative hidden lg:block overflow-hidden min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80"
              alt="Travel inspiration"
              fill
              className="object-cover"
            />
            {/* Very subtle, smooth gradient */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h1
                className="text-3xl font-bold text-white mb-3 leading-snug"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              >
                {t.login.signInTitle}
              </h1>
              <p
                className="text-base text-white/80"
              >
                {language === "en" ? "Discover the hidden gems of Albania." : "Zbuloni perlat e fshehura të Shqipërisë."}
              </p>
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
                  className="text-3xl font-black tracking-tight mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.nav.login}
                </h2>
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {language === "en"
                    ? "Enter your credentials to continue your journey."
                    : "Vendosni kredencialet tuaja për të vazhduar udhëtimin."}
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
                className="mt-8 text-center text-sm font-medium"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.login.newToPlatform}{" "}
                <Link
                  href="/register"
                  className="font-bold transition-all hover:underline"
                  style={{ color: "var(--brand-accent)" }}
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
