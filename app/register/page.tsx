"use client";

import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import SocialLogin from "@/components/auth/SocialLogin";

export default function RegisterPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section
      className="page-shell flex items-center justify-center min-h-[calc(100vh-5rem)] py-10"
      style={{ background: "var(--surface-page)" }}
    >
      <div
        className="surface w-full max-w-5xl overflow-hidden grid"
      >
        <div className="grid lg:grid-cols-2">

          {/* Left — Simplified Image Panel */}
          <div className="relative hidden lg:block overflow-hidden min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
              alt="Travel registration"
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
                {t.register.joinTitle}
              </h1>
              <p
                className="text-base text-white/80"
              >
                {language === "en" ? "Create an account to start exploring." : "Krijoni një llogari për të filluar eksplorimin."}
              </p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div
            className="flex flex-col justify-center p-10 sm:p-14"
            style={{ background: "var(--surface-white)" }}
          >
            <div className="max-w-sm mx-auto w-full">
              <div className="mb-8">
                <h2
                  className="font-bold mb-2"
                  style={{ fontSize: "1.625rem", color: "var(--text-primary)" }}
                >
                  {t.nav.register}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {language === "en"
                    ? "Fill in the details to create your new account."
                    : "Plotësoni detajet për të krijuar llogarinë tuaj të re."}
                </p>
              </div>

              <AuthForm mode="register" />

              <div className="mt-6">
                <SocialLogin />
              </div>

              <p className="mt-7 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                {t.register.alreadyAccount}{" "}
                <Link
                  href="/login"
                  className="font-semibold transition-colors text-[var(--brand-accent)] hover:text-[var(--brand-hover)]"
                >
                  {t.nav.login}
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
