import Link from "next/link";
import AuthForm from "@/components/forms/AuthForm";

export default function AdminLoginPage() {
  return (
    <section className="page-shell flex min-h-[70vh] items-center py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="surface-strong overflow-hidden p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-100">Administrator access</p>
          <h1 className="display-font mt-4 text-4xl font-black leading-tight">
            Sign in to moderate listings, users, and platform activity.
          </h1>
          <p className="mt-4 text-slate-300">
            This page is reserved for the platform administrator. Once signed in, you will be redirected to the full control panel.
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5 text-sm text-brand-50">
            <p className="font-semibold text-white">Tip</p>
            <p className="mt-2">
              Use the admin email and password configured in the project environment. The account is auto-created on first database connection.
            </p>
          </div>
        </div>
        <div className="surface p-5 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-600">Access moderation tools and platform analytics.</p>
          <div className="mt-6">
            <AuthForm mode="login" />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Need the regular user area?{" "}
            <Link href="/login" className="font-semibold text-brand-700">
              User login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
