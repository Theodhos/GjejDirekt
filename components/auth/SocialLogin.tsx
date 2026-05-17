"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLanguage } from "@/context/LanguageContext";

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

      toast.success(language === 'en' ? "Signed in successfully!" : "Hyrja u krye me sukses!");
      window.dispatchEvent(new Event("auth-changed"));
      
      // Redirect based on role
      router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
      
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      const message = error?.code === "auth/unauthorized-domain"
        ? language === 'en'
          ? "Google sign-in failed because this domain is not authorized in Firebase. Add your Vercel domain to Firebase Auth authorized domains."
          : "Hyrja me Google dështoi sepse ky domen nuk është i autorizuar në Firebase. Shtoni domenin e Vercel tek domenet e autorizuara të Firebase Auth."
        : error.message || (language === 'en' ? "Google authentication failed" : "Autentikimi me Google dështoi");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-4 rounded-2xl border-2 border-slate-100 p-4 font-black text-slate-950 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      ) : (
        <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} height={20} />
      )}
      {language === 'en' ? 'Continue with Google' : 'Vazhdoni me Google'}
    </button>
  );
}
