"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    setLoading(true);
    const res = await fetch("/api/auth/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Failed to reset password.");
    toast.success("Password updated. You can login now.");
    router.push("/login");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
      <h1 className="text-2xl font-black">Set new password</h1>
      <input className="w-full rounded-xl border border-slate-200 p-3" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input className="w-full rounded-xl border border-slate-200 p-3" type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <button disabled={loading} className="w-full rounded-xl bg-slate-950 text-white py-3 font-bold">{loading ? "Saving..." : "Update password"}</button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="page-shell py-12 sm:py-16 min-h-[60vh] flex items-center justify-center">
      <Suspense fallback={
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-600 font-medium">Loading password reset form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
