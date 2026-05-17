export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
      <div className="page-shell max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950">Privacy Policy</h1>
        <p className="mt-4 text-slate-600">Last updated: May 17, 2026</p>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-10 text-slate-700 leading-8">
          <section>
            <h2 className="text-xl font-black text-slate-950">1. Information We Collect</h2>
            <p className="mt-2">We collect account details, listing content, and usage data needed to provide and improve the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">2. How We Use Information</h2>
            <p className="mt-2">Data is used to operate the service, review content, improve security, and support user communication.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">3. Data Sharing</h2>
            <p className="mt-2">We do not sell personal data. We may share limited data with trusted providers to operate hosting, analytics, and communications.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">4. Data Retention</h2>
            <p className="mt-2">We retain data as long as necessary for legal, operational, and security purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-slate-950">5. Your Rights</h2>
            <p className="mt-2">You may request access, correction, or deletion of your personal data by contacting platform administration.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
