"use client";

import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const privacySections = {
  al: [
    { title: "1. Informacioni që Mbledhim", body: "Ne mund të mbledhim informacion si: emrin dhe mbiemrin, email-in, numrin e telefonit, informacionet e biznesit, fotot dhe përmbajtjen e listing-eve, si dhe të dhëna teknike dhe analitike mbi përdorimin e platformës." },
    { title: "2. Si Përdoret Informacioni", body: "Informacioni përdoret për: krijimin dhe menaxhimin e listing-eve, komunikimin me përdoruesit, përmirësimin e platformës, moderimin dhe sigurinë e përmbajtjes, dhe analizimin e përdorimit të platformës." },
    { title: "3. Listing-et Publike", body: "Informacioni që publikoni në listing-e, si: emri i biznesit, telefoni, WhatsApp, Instagram, website, përshkrimet dhe fotot mund të jetë publikisht i aksesueshëm nga përdoruesit e platformës." },
    { title: "4. Cookies dhe Analitika", body: "TripShqip mund të përdorë cookies dhe mjete analitike për: përmirësimin e eksperiencës së përdoruesit, analizimin e trafikut, dhe performancën e platformës. Përdoruesit mund të menaxhojnë cookies përmes shfletuesit të tyre." },
    { title: "5. Ndarja e Informacionit", body: "TripShqip nuk shet të dhënat personale të përdoruesve. Informacioni mund të ndahet vetëm: kur kërkohet nga ligji, për arsye sigurie, ose me shërbime teknike të nevojshme për funksionimin e platformës." },
    { title: "6. Linke të Jashtme", body: "Platforma mund të përmbajë linke drejt website-ve ose shërbimeve të palëve të treta. TripShqip nuk është përgjegjës për politikat e privatësisë së këtyre platformave." },
    { title: "7. Siguria e të Dhënave", body: "Ne përpiqemi të mbrojmë informacionin e përdoruesve përmes masave të arsyeshme teknike dhe organizative. Megjithatë, asnjë platformë online nuk mund të garantojë siguri absolute." },
    { title: "8. Të Drejtat e Përdoruesve", body: "Përdoruesit mund të: kërkojnë përditësimin e të dhënave, kërkojnë fshirjen e profilit ose listing-ut, ose të kontaktojnë TripShqip për çdo pyetje lidhur me privatësinë." },
    { title: "9. Ndryshimet në Politikën e Privatësisë", body: "TripShqip rezervon të drejtën të përditësojë këtë politikë në çdo kohë. Ndryshimet hyjnë në fuqi pas publikimit në platformë." },
    { title: "10. Kontakt", body: "Për pyetje ose kërkesa lidhur me privatësinë dhe të dhënat personale, mund të na kontaktoni përmes faqes së Kontaktit." }
  ],
  en: [
    { title: "1. Information We Collect", body: "We may collect information such as: first name and last name, email, phone number, business information, photos and listing content, as well as technical and analytical data on platform usage." },
    { title: "2. How the Information is Used", body: "The information is used for: creating and managing listings, communicating with users, improving the platform, content moderation and security, and analyzing platform usage." },
    { title: "3. Public Listings", body: "The information you publish in listings, such as: business name, phone, WhatsApp, Instagram, website, descriptions, and photos can be publicly accessible to platform users." },
    { title: "4. Cookies and Analytics", body: "TripShqip may use cookies and analytical tools for: improving the user experience, analyzing traffic, and platform performance. Users can manage cookies through their browser." },
    { title: "5. Information Sharing", body: "TripShqip does not sell users' personal data. Information may only be shared: when required by law, for security reasons, or with technical services necessary for the functioning of the platform." },
    { title: "6. External Links", body: "The platform may contain links to third-party websites or services. TripShqip is not responsible for the privacy policies of these platforms." },
    { title: "7. Data Security", body: "We strive to protect user information through reasonable technical and organizational measures. However, no online platform can guarantee absolute security." },
    { title: "8. User Rights", body: "Users can: request data updates, request deletion of profile or listing, or contact TripShqip for any questions regarding privacy." },
    { title: "9. Changes to the Privacy Policy", body: "TripShqip reserves the right to update this policy at any time. Changes take effect upon publication on the platform." },
    { title: "10. Contact", body: "For questions or requests regarding privacy and personal data, you can contact us through the \"Contact\" page." }
  ]
};

const quickSummary = {
  al: ["Mbledhim vetëm të dhënat e nevojshme për funksionimin e platformës.", "Nuk shesim të dhënat tuaja personale.", "Listimet publike janë të dukshme; fjalëkalimet dhe të dhënat e ndjeshme mbrohen.", "Mund të kërkoni përditësimin ose fshirjen e të dhënave tuaja."],
  en: ["We collect only data needed to operate the platform.", "We do not sell personal data.", "Public listings are visible; account secrets are protected.", "You can request access, correction, or deletion."]
};

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const sections = privacySections[language];
  const summary = quickSummary[language];

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(34,153,120,0.05)", filter: "blur(100px)" }} />
        <div className="page-shell relative z-10 pt-14 pb-14 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="hover:text-brand-600 transition-colors">{language === "en" ? "Home" : "Kreu"}</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{language === "en" ? "Privacy Policy" : "Politika e Privatësisë"}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="eyebrow mb-3">{language === "en" ? "Data Protection" : "Mbrojtja e të Dhënave"}</p>
          <h1 className="font-bold tracking-tight mb-4" style={{ fontSize: "clamp(1.875rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.1 }}>
            {language === "en" ? "Privacy Policy" : "Politika e Privatësisë"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {language === "en"
              ? "At TripShqip, your privacy and data protection are important to us."
              : "Në TripShqip, privatësia dhe mbrojtja e të dhënave tuaja janë të rëndësishme për ne."}
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="page-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl p-5" style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-secondary)" }}>
                {language === "en" ? "Quick Summary" : "Përmbledhje e Shkurtër"}
              </h2>
              <ul className="space-y-3">
                {summary.map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--brand-accent)" }} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl p-5 sm:p-6 transition-all"
                style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
              >
                <h3 className="flex items-center gap-2.5 text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  <Lock className="w-4 h-4 shrink-0" style={{ color: "var(--brand-accent)" }} />
                  {section.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
