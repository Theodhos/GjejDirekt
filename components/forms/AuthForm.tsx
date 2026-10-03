"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { readRedirectParam } from "@/lib/auth-redirect";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [emailForMagic, setEmailForMagic] = useState("");
  const [isMagicMode, setIsMagicMode] = useState(false);
  const [accountType, setAccountType] = useState<"biznes" | "klient">("biznes");
  const router = useRouter();

  async function handleSendMagicLink() {
    if (!emailForMagic.trim()) {
      toast.error(language === "en" ? "Please enter your email first." : "Ju lutem vendosni email-in tuaj më parë.");
      return;
    }

    setMagicLoading(true);
    try {
      const normalizedEmail = emailForMagic.trim().toLowerCase();
      const response = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send sign-in link.");
      
      toast.success(
        language === "en"
          ? "Sign-in link sent! Check your inbox and Spam folder."
          : "Linku i hyrjes u dërgua! Kontrolloni kutinë tuaj të mesazheve dhe folderin Spam."
      );
      
      window.alert(
        language === "en"
          ? `A magic sign-in link has been sent to: ${normalizedEmail}\n\nPlease check your inbox and also your Spam folder.`
          : `Linku magjik i hyrjes u dërgua te: ${normalizedEmail}\n\nJu lutem kontrolloni kutinë tuaj të mesazheve dhe gjithashtu folderin Spam.`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send sign-in link.");
    } finally {
      setMagicLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "login" && isMagicMode) {
      await handleSendMagicLink();
      return;
    }

    setLoading(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success(mode === "login" ? "Welcome back!" : "Account created!");
    window.dispatchEvent(new Event("auth-changed"));
    // Coming from "add a listing"? Continue there instead of the dashboard.
    router.push(readRedirectParam(data.user?.role === "admin" ? "/admin" : "/dashboard"));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" ? (
        <>
          <div>
            <span className="mb-2 block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {language === "en" ? "Account type" : "Lloji i llogarisë"}
            </span>
            <input type="hidden" name="accountType" value={accountType} />
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    value: "biznes" as const,
                    title: language === "en" ? "Business" : "Biznes",
                    hint: language === "en" ? "List and manage a business" : "Shto dhe menaxho biznesin tënd"
                  },
                  {
                    value: "klient" as const,
                    title: language === "en" ? "Customer" : "Klient",
                    hint: language === "en" ? "Order and book only" : "Vetëm porosi dhe rezervime"
                  }
                ]
              ).map((option) => {
                const active = accountType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAccountType(option.value)}
                    className="rounded-xl border px-3 py-2.5 text-left transition-colors"
                    style={{
                      borderColor: active ? "var(--brand-accent)" : "var(--border-medium)",
                      background: active ? "var(--brand-light)" : "var(--surface-white)"
                    }}
                  >
                    <span className="block text-sm font-bold" style={{ color: active ? "var(--brand-accent)" : "var(--text-primary)" }}>
                      {option.title}
                    </span>
                    <span className="block text-xs leading-snug" style={{ color: "var(--text-tertiary)" }}>
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Input name="name" label={language === "en" ? "Name" : "Emri"} placeholder={language === "en" ? "Your name" : "Emri juaj"} required />
          <Input name="phone" type="tel" label={language === "en" ? "Phone Number" : "Numri i Telefonit"} placeholder="+1 234 567 890" required />
        </>
      ) : null}

      <Input
        name="email"
        type="email"
        label={language === "en" ? "Email Address" : "Adresa e Email-it"}
        placeholder="email@example.com"
        required
        value={emailForMagic}
        onChange={(event) => setEmailForMagic(event.target.value)}
      />

      {mode === "register" && (
        <Input
          name="password"
          type="password"
          label={language === "en" ? "Password" : "Fjalëkalimi"}
          placeholder={language === "en" ? "At least 6 characters" : "Të paktën 6 karaktere"}
          required
          minLength={6}
        />
      )}

      {mode === "login" && !isMagicMode && (
        <>
          <Input name="password" type="password" label={language === "en" ? "Password" : "Fjalëkalimi"} placeholder="********" required />
          <div className="flex items-center justify-end -mt-2">
            <button
              type="button"
              onClick={() => setIsMagicMode(true)}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              {language === "en" ? "Forgot your password?" : "Keni harruar fjalëkalimin?"}
            </button>
          </div>
        </>
      )}

      {mode === "login" && isMagicMode && (
        <p className="text-xs text-slate-500">
          {language === "en"
            ? "Enter your email to receive a passwordless magic link to log in directly."
            : "Vendosni email-in tuaj për të marrë një link magjik pa fjalëkalim për t'u loguar direkt."}
        </p>
      )}

      {mode === "login" && isMagicMode && (
        <div className="space-y-1 -mt-2">
          <p className="text-xs text-slate-500">
            {language === "en"
              ? "If you do not see the email, check your Spam folder."
              : "Nëse nuk e shihni email-in, kontrolloni folderin Spam."}
          </p>
          <p className="text-xs text-amber-600 font-medium">
            {language === "en"
              ? "Important: If you request multiple links, only the most recent one will work!"
              : "E rëndësishme: Nëse kërkoni disa linqe, vetëm linku më i fundit do të funksionojë!"}
          </p>
        </div>
      )}

      {mode === "login" && isMagicMode ? (
        <>
          <Button type="submit" className="w-full" disabled={magicLoading}>
            {magicLoading 
              ? (language === "en" ? "Sending..." : "Duke u dërguar...") 
              : (language === "en" ? "Send Magic Link" : "Dërgo Linkun Magjik")}
          </Button>
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setIsMagicMode(false)}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              {language === "en" ? "Back to standard login" : "Kthehu te hyrja standarde"}
            </button>
          </div>
        </>
      ) : (
        <Button type="submit" className="w-full" disabled={loading}>
          {loading 
            ? (language === "en" ? "Please wait..." : "Ju lutem prisni...") 
            : mode === "login" 
              ? (language === "en" ? "Login" : "Hyr") 
              : (language === "en" ? "Create account" : "Krijo llogari")}
        </Button>
      )}
    </form>
  );
}
