const privacySections = [
  {
    title: "1. Information We Collect",
    body:
      "We collect information you provide directly, including account details (name, email), listing data (title, descriptions, media, location, contact information), review content, and support/admin communications."
  },
  {
    title: "2. Automatically Collected Data",
    body:
      "We may collect technical data such as device/browser type, session timestamps, IP-related logs, pages visited, and interaction events to keep the platform secure and improve performance."
  },
  {
    title: "3. How We Use Your Data",
    body:
      "We use data to create and manage accounts, publish and moderate listings, process user requests, prevent abuse, maintain service quality, and send essential service notifications."
  },
  {
    title: "4. Legal Basis and Consent",
    body:
      "We process data based on legitimate interest (platform operation and security), contractual necessity (account and listing services), and your consent when required."
  },
  {
    title: "5. Data Sharing",
    body:
      "We do not sell personal data. Data may be shared with trusted infrastructure providers (such as hosting, email, analytics, or security services) only as needed to operate the platform or comply with legal obligations."
  },
  {
    title: "6. Public vs Private Content",
    body:
      "Listing information and reviews you publish may be publicly visible. Sensitive account and authentication data are not displayed publicly and are handled with restricted access controls."
  },
  {
    title: "7. Cookies and Similar Technologies",
    body:
      "We use cookies or similar technologies for session management, security, language preferences, and platform analytics. You can manage cookie settings through your browser."
  },
  {
    title: "8. Data Retention",
    body:
      "We retain data for as long as needed for platform operation, moderation history, legal compliance, dispute handling, and security audits. Data may be deleted or anonymized when no longer required."
  },
  {
    title: "9. Security Measures",
    body:
      "We apply reasonable technical and organizational safeguards to protect data. No online system is completely risk-free, but we continuously work to reduce security risks and unauthorized access."
  },
  {
    title: "10. Your Rights",
    body:
      "You may request access, correction, export, restriction, or deletion of your personal data, subject to legal and operational requirements. You may also object to specific processing activities where applicable."
  },
  {
    title: "11. Children's Privacy",
    body:
      "This platform is not intended for children under the applicable minimum legal age. We do not knowingly collect personal data from children."
  },
  {
    title: "12. Policy Updates",
    body:
      "We may update this Privacy Policy from time to time. The \"Last updated\" date above reflects the current version."
  },
  {
    title: "13. Contact",
    body:
      "For privacy requests or questions, contact platform administration through the official support or admin channels available in the platform."
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="page-shell max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-300">Data Protection</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-slate-200 sm:text-base">
              This policy explains what data we collect, why we collect it, and how we protect your information.
            </p>
            <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Last updated: May 17, 2026
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-5 h-fit lg:sticky lg:top-24">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Quick Summary</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>We collect only data needed to operate the platform.</li>
              <li>We do not sell personal data.</li>
              <li>Public listings are visible; account secrets are protected.</li>
              <li>You can request access, correction, or deletion.</li>
            </ul>
          </aside>

          <div className="space-y-4">
            {privacySections.map((section) => (
              <section key={section.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6">
                <h3 className="text-lg font-black text-slate-950">{section.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{section.body}</p>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
