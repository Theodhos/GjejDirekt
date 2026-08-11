"use client";

import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import SocialLogin from "@/components/auth/SocialLogin";
import { CREATE_LISTING_REDIRECT, redirectQuery, useRedirectParam } from "@/lib/auth-redirect";

export default function RegisterPage() {
  const { language } = useLanguage();
  const t = translations[language];
  // Set when the visitor tried to publish a service before having an account.
  const redirect = useRedirectParam();
  const fromListingFlow = redirect === CREATE_LISTING_REDIRECT;

  return (
    <section
      className="page-shell flex items-center justify-center min-h-[calc(100vh-var(--header-height))] py-8 sm:py-12"
      style={{ background: "var(--surface-page)" }}
    >
      <div
        className="surface w-full max-w-5xl overflow-hidden grid"
      >
        <div className="grid lg:grid-cols-2">

          {/* Left — Image Panel */}
          <div className="relative hidden lg:block overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
              alt="Travel registration"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 0px"
              priority
            />
            {/* Very subtle, smooth gradient */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 45%, transparent 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-10 xl:p-12">
              <h1
                className="text-[1.75rem] xl:text-3xl font-bold text-white leading-snug"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              >
                {t.register.joinTitle}
              </h1>
              <p className="mt-3 text-sm xl:text-base text-white/80 leading-relaxed">
                {language === "en" ? "Create an account to start exploring." : "Krijoni një llogari për të filluar eksplorimin."}
              </p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div
            className="flex flex-col justify-center p-7 sm:p-10"
            style={{ background: "var(--surface-white)" }}
          >
            <div className="w-full max-w-sm mx-auto">
              <div className="mb-7">
                <h2
                  className="font-bold tracking-tight"
                  style={{ fontSize: "1.625rem", color: "var(--text-primary)" }}
                >
                  {t.nav.register}
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {language === "en"
                    ? "Fill in the details to create your new account."
                    : "Plotësoni detajet për të krijuar llogarinë tuaj të re."}
                </p>
                {fromListingFlow && (
                  <p
                    className="mt-3 rounded-xl border px-3 py-2 text-xs font-medium"
                    style={{
                      borderColor: "var(--brand-border)",
                      background: "var(--brand-light)",
                      color: "var(--brand-accent)"
                    }}
                  >
                    {language === "en"
                      ? "One quick step: create your account and you go straight to publishing your service."
                      : "Vetëm një hap: krijoni llogarinë dhe vazhdoni direkt me shtimin e shërbimit tuaj."}
                  </p>
                )}
              </div>

              <AuthForm mode="register" />

              {/* Divider — same rhythm as the login page */}
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

              <SocialLogin />

              <p className="mt-7 text-center text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                {t.register.alreadyAccount}{" "}
                <Link
                  href={`/login${redirectQuery(redirect)}`}
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
