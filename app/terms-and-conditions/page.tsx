export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
      <div className="page-shell max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950">Terms and Conditions</h1>
        <p className="mt-4 text-slate-600">Last updated: May 17, 2026</p>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-10 text-slate-700 leading-8">
          <section>
            <h2 className="text-xl font-black text-slate-950">1. Use of the Platform</h2>
            <p className="mt-2">By using this platform, you agree to provide accurate information and use the service in accordance with applicable laws.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">2. Listings and Content</h2>
            <p className="mt-2">Users are responsible for the content they publish. We may review, edit, or remove listings that violate policy or law.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">3. Accounts and Security</h2>
            <p className="mt-2">You are responsible for maintaining account security and confidentiality of your credentials.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">4. Limitation of Liability</h2>
            <p className="mt-2">The platform provides discovery and connection services. We are not responsible for third-party actions, bookings, or external transactions.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">5. Changes to Terms</h2>
            <p className="mt-2">We may update these terms periodically. Continued use after updates means acceptance of the revised terms.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
