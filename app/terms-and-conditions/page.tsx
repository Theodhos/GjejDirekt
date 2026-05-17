const termsSections = [
  {
    title: "1. Acceptance of Terms",
    body:
      "By accessing or using this platform, you agree to these Terms and to all applicable laws. If you do not agree, please do not use the platform."
  },
  {
    title: "2. Platform Role",
    body:
      "The platform helps users discover tourism-related services, contact providers, and submit listings. We do not own, operate, or guarantee third-party services listed by users."
  },
  {
    title: "3. Accounts and Eligibility",
    body:
      "You are responsible for account activity under your credentials and for keeping your login details secure. You must provide accurate profile and listing information."
  },
  {
    title: "4. Listings, Content, and Moderation",
    body:
      "Users are responsible for listing content, media, claims, prices, and contact details they publish. Listings may be reviewed by administrators and can be approved, rejected, edited for clarity, or removed if they violate law, intellectual property rights, safety expectations, or platform rules."
  },
  {
    title: "5. Prohibited Conduct",
    body:
      "You agree not to publish misleading information, unlawful offers, harmful content, spam, malware, or abusive communications. Attempts to bypass moderation or impersonate other people are not allowed."
  },
  {
    title: "6. Reviews and User Interactions",
    body:
      "Reviews must reflect real experiences and follow respectful conduct standards. We may remove reviews or comments that are fraudulent, abusive, discriminatory, or unrelated to the service experience."
  },
  {
    title: "7. Payments and Packages",
    body:
      "If paid features or packages are offered, billing terms are shown at checkout. Unless explicitly stated otherwise, fees are non-refundable after activation of the purchased feature."
  },
  {
    title: "8. Intellectual Property",
    body:
      "Platform design, code, branding, and original content are protected by applicable intellectual property laws. You keep ownership of content you upload, and grant us a limited license to display and process it for platform operation."
  },
  {
    title: "9. Disclaimer and Limitation of Liability",
    body:
      "The platform is provided \"as is\" and \"as available.\" We are not liable for losses resulting from third-party listings, provider actions, availability issues, booking outcomes, or user-to-user transactions."
  },
  {
    title: "10. Suspension and Termination",
    body:
      "We may suspend or terminate accounts or listings that violate these Terms, create legal or security risk, or harm platform integrity."
  },
  {
    title: "11. Changes to These Terms",
    body:
      "We may update these Terms periodically. Continued use of the platform after updates means you accept the revised version."
  },
  {
    title: "12. Contact",
    body:
      "For questions about these Terms, contact platform administration through the official support or admin communication channels provided in the platform."
  }
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="page-shell max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Legal</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Terms and Conditions</h1>
            <p className="mt-4 text-sm text-slate-200 sm:text-base">
              These terms define how users, service providers, and administrators interact on the tourism platform.
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
              <li>Use the platform lawfully and provide accurate data.</li>
              <li>Listings and reviews can be moderated by admins.</li>
              <li>Users are responsible for their account security.</li>
              <li>Third-party services are not guaranteed by the platform.</li>
            </ul>
          </aside>

          <div className="space-y-4">
            {termsSections.map((section) => (
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
