"use client";

import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { Star, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="page-shell flex min-h-[70vh] items-center py-10 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-0 lg:grid-cols-2 overflow-hidden rounded-[3rem] shadow-2xl">
        <div className="relative overflow-hidden surface-strong p-10 lg:p-16 min-h-[450px] lg:min-h-full border-none">
          <Image 
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80" 
            alt="Travel inspiration" 
            fill 
            className="object-cover opacity-40 scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-400 mb-6">{language === 'en' ? 'Welcome back' : 'Mirë se vini përsëri'}</p>
            <h1 className="display-font text-4xl lg:text-6xl font-black leading-tight tracking-tighter text-white">
                {language === 'en' ? <>Sign in to <br /> Explore Albania.</> : <>Hyni për të <br /> Eksploruar Shqipërinë.</>}
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-sm">
                {language === 'en' 
                    ? 'Access your personalized dashboard to manage listings, save favorites, and share your experiences.' 
                    : 'Aksesoni panelin tuaj të personalizuar për të menaxhuar listimet, ruajtur të preferuarat dhe ndarë përvojat tuaja.'}
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                    language === 'en' ? 'Saved trips' : 'Udhëtime të ruajtura', 
                    language === 'en' ? 'Moderation tools' : 'Mjetet e moderimit', 
                    language === 'en' ? 'Reviews' : 'Vlerësimet', 
                    language === 'en' ? 'Listing management' : 'Menaxhimi i listimeve'
                ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{language === 'en' ? 'Feature' : 'Funksioni'}</p>
                    <p className="text-xs font-bold text-white">{item}</p>
                </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="surface p-10 lg:p-16 border-none flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-black text-slate-950 mb-2">{t.nav.login}</h2>
            <p className="text-slate-500 mb-8 font-medium">
                {language === 'en' ? 'Enter your credentials to continue your journey.' : 'Vendosni kredencialet tuaja për të vazhduar udhëtimin tuaj.'}
            </p>
            
            <div className="mt-6">
                <AuthForm mode="login" />
            </div>

            <div className="mt-8 flex flex-col gap-4">
                <button className="w-full flex items-center justify-center gap-4 rounded-2xl border-2 border-slate-100 p-4 font-black text-slate-950 hover:bg-slate-50 transition-all shadow-sm">
                    <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} height={20} />
                    {language === 'en' ? 'Continue with Google' : 'Vazhdoni me Google'}
                </button>
                
            </div>
            
            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                {language === 'en' ? "New to the platform?" : "I ri në platformë?"}{" "}
                <Link href="/register" className="font-black text-brand-700 hover:underline">
                    {t.nav.register}
                </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
