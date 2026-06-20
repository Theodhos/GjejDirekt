"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock, Eye, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const privacySections = {
  al: [
    {
      title: "1. Informacioni që Mbledhim",
      body: "Ne mund të mbledhim informacion si: emrin dhe mbiemrin, email-in, numrin e telefonit, informacionet e biznesit, fotot dhe përmbajtjen e listing-eve, si dhe të dhëna teknike dhe analitike mbi përdorimin e platformës."
    },
    {
      title: "2. Si Përdoret Informacioni",
      body: "Informacioni përdoret për: krijimin dhe menaxhimin e listing-eve, komunikimin me përdoruesit, përmirësimin e platformës, moderimin dhe sigurinë e përmbajtjes, dhe analizimin e përdorimit të platformës."
    },
    {
      title: "3. Listing-et Publike",
      body: "Informacioni që publikoni në listing-e, si: emri i biznesit, telefoni, WhatsApp, Instagram, website, përshkrimet dhe fotot mund të jetë publikisht i aksesueshëm nga përdoruesit e platformës."
    },
    {
      title: "4. Cookies dhe Analitika",
      body: "TripShqip mund të përdorë cookies dhe mjete analitike për: përmirësimin e eksperiencës së përdoruesit, analizimin e trafikut, dhe performancën e platformës. Përdoruesit mund të menaxhojnë cookies përmes shfletuesit të tyre."
    },
    {
      title: "5. Ndarja e Informacionit",
      body: "TripShqip nuk shet të dhënat personale të përdoruesve. Informacioni mund të ndahet vetëm: kur kërkohet nga ligji, për arsye sigurie, ose me shërbime teknike të nevojshme për funksionimin e platformës."
    },
    {
      title: "6. Linke të Jashtme",
      body: "Platforma mund të përmbajë linke drejt website-ve ose shërbimeve të palëve të treta. TripShqip nuk është përgjegjës për politikat e privatësisë së këtyre platformave."
    },
    {
      title: "7. Siguria e të Dhënave",
      body: "Ne përpiqemi të mbrojmë informacionin e përdoruesve përmes masave të arsyeshme teknike dhe organizative. Megjithatë, asnjë platformë online nuk mund të garantojë siguri absolute."
    },
    {
      title: "8. Të Drejtat e Përdoruesve",
      body: "Përdoruesit mund të: kërkojnë përditësimin e të dhënave, kërkojnë fshirjen e profilit ose listing-ut, ose të kontaktojnë TripShqip për çdo pyetje lidhur me privatësinë."
    },
    {
      title: "9. Ndryshimet në Politikën e Privatësisë",
      body: "TripShqip rezervon të drejtën të përditësojë këtë politikë në çdo kohë. Ndryshimet hyjnë në fuqi pas publikimit në platformë."
    },
    {
      title: "10. Kontakt",
      body: "Për pyetje ose kërkesa lidhur me privatësinë dhe të dhënat personale, mund të na kontaktoni përmes faqes “Kontakt”."
    }
  ],
  en: [
    {
      title: "1. Information We Collect",
      body: "We may collect information such as: first name and last name, email, phone number, business information, photos and listing content, as well as technical and analytical data on platform usage."
    },
    {
      title: "2. How the Information is Used",
      body: "The information is used for: creating and managing listings, communicating with users, improving the platform, content moderation and security, and analyzing platform usage."
    },
    {
      title: "3. Public Listings",
      body: "The information you publish in listings, such as: business name, phone, WhatsApp, Instagram, website, descriptions, and photos can be publicly accessible to platform users."
    },
    {
      title: "4. Cookies and Analytics",
      body: "TripShqip may use cookies and analytical tools for: improving the user experience, analyzing traffic, and platform performance. Users can manage cookies through their browser."
    },
    {
      title: "5. Information Sharing",
      body: "TripShqip does not sell users' personal data. Information may only be shared: when required by law, for security reasons, or with technical services necessary for the functioning of the platform."
    },
    {
      title: "6. External Links",
      body: "The platform may contain links to third-party websites or services. TripShqip is not responsible for the privacy policies of these platforms."
    },
    {
      title: "7. Data Security",
      body: "We strive to protect user information through reasonable technical and organizational measures. However, no online platform can guarantee absolute security."
    },
    {
      title: "8. User Rights",
      body: "Users can: request data updates, request deletion of profile or listing, or contact TripShqip for any questions regarding privacy."
    },
    {
      title: "9. Changes to the Privacy Policy",
      body: "TripShqip reserves the right to update this policy at any time. Changes take effect upon publication on the platform."
    },
    {
      title: "10. Contact",
      body: "For questions or requests regarding privacy and personal data, you can contact us through the \"Contact\" page."
    }
  ]
};

const quickSummary = {
  al: [
    "Mbledhim vetëm të dhënat e nevojshme për funksionimin e platformës.",
    "Nuk shesim të dhënat tuaja personale.",
    "Listimet publike janë të dukshme; fjalëkalimet dhe të dhënat e ndjeshme mbrohen.",
    "Mund të kërkoni përditësimin ose fshirjen e të dhënave tuaja."
  ],
  en: [
    "We collect only data needed to operate the platform.",
    "We do not sell personal data.",
    "Public listings are visible; account secrets are protected.",
    "You can request access, correction, or deletion."
  ]
};

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const sections = privacySections[language];
  const summary = quickSummary[language];

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="page-shell max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-300">
              {language === "en" ? "Data Protection" : "Mbrojtja e të Dhënave"}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {language === "en" ? "Privacy Policy" : "Politika e Privatësisë"}
            </h1>
            <p className="mt-4 text-sm text-slate-200 sm:text-base">
              {language === "en"
                ? "At TripShqip, your privacy and data protection are important to us. This Privacy Policy explains how we collect, use, and protect your information."
                : "Në TripShqip, privatësia dhe mbrojtja e të dhënave tuaja janë të rëndësishme për ne. Kjo Politikë Privatësie shpjegon se si mbledhim, përdorim dhe mbrojmë informacionin tuaj."}
            </p>
            <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              {language === "en" ? "TripShqip • We support Albanian tourism" : "TripShqip • Mbështesim turizmin shqiptar"}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-5 h-fit lg:sticky lg:top-24">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
              {language === "en" ? "Quick Summary" : "Përmbledhje e Shkurtër"}
            </h2>
            <ul className="mt-4 space-y-4 text-xs font-bold text-slate-600 leading-relaxed">
              {summary.map((text, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6 hover:border-brand-200 transition-colors">
                <h3 className="text-lg font-black text-slate-950 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-brand-600 shrink-0" />
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base font-semibold">{section.body}</p>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
