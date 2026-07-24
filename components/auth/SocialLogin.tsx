"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function SocialLogin() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGoogleLogin() {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      if (!firebaseEnabled || !auth) {
        throw new Error("Firebase is not configured yet.");
      }
      const firebaseInstance = auth!;
      const result = await signInWithPopup(firebaseInstance, provider);
      const user = result.user;

      const response = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          providerId: "google"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync with server");
      }

      toast.success(translations[language].auth.signedInSuccess);
      window.dispatchEvent(new Event("auth-changed"));
      
      // Redirect based on role
      router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
      
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      const message = error?.code === "auth/unauthorized-domain"
        ? translations[language].auth.googleUnauthorizedDomain
        : error.message || translations[language].auth.googleAuthFailed;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-xl border border-[var(--border-medium)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] bg-[var(--surface-white)] hover:border-[var(--brand-accent)] hover:bg-[var(--surface-subtle)] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <div className="w-[18px] h-[18px] border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      ) : (
        <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={18} height={18} />
      )}
      {translations[language].auth.continueWithGoogle}
    </button>
  );
}
