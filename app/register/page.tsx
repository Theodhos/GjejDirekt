"use client";

import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { CheckCircle } from "lucide-react";
import SocialLogin from "@/components/auth/SocialLogin";

export default function RegisterPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="page-shell flex min-h-[70vh] items-center py-10 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-0 lg:grid-cols-2 overflow-hidden rounded-[3rem] shadow-2xl">
        <div className="relative overflow-hidden surface-strong p-10 lg:p-16 min-h-[450px] lg:min-h-full border-none">
          <Image 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" 
            alt="Travel registration" 
            fill 
            className="object-cover opacity-40 scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-400 mb-6">{t.register.start}</p>
            <h1 className="display-font text-4xl lg:text-6xl font-black leading-tight tracking-tighter text-white">
                {t.register.joinTitle.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-sm">
                {t.register.description}
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {t.register.benefits.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.register.benefitLabel}</p>
                <p className="text-xs font-bold text-white">{item}</p>
              </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="surface p-10 lg:p-16 border-none flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-black text-slate-950 mb-2">{t.nav.register}</h2>
            <p className="text-slate-500 mb-8 font-medium">
                {language === 'en' ? 'Fill in the details to create your new account.' : 'Plotësoni detajet për të krijuar llogarinë tuaj të re.'}
            </p>
            
            <div className="mt-6">
                <AuthForm mode="register" />
            </div>

            <div className="mt-8 flex flex-col gap-4">
                <SocialLogin />
            </div>

            
            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
              {t.register.alreadyAccount} {" "}
              <Link href="/login" className="font-black text-brand-700 hover:underline">
                {t.nav.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
