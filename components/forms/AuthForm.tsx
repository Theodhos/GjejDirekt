"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [emailForMagic, setEmailForMagic] = useState("");
  const [isMagicMode, setIsMagicMode] = useState(false);
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
    router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" ? (
        <>
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
