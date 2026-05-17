"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MagicLinkVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying sign-in link...");

  useEffect(() => {
    const token = String(searchParams.get("token") || "").trim();

    (async () => {
      if (!token) {
        setMessage("Invalid sign-in link.");
        return;
      }

      const response = await fetch("/api/auth/magic-link/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Link is invalid or expired.");
        return;
      }

      setMessage("Success! Redirecting...");
      router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    })();
  }, [router, searchParams]);

  return (
    <div className="max-w-lg w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft">
      <h1 className="text-2xl font-black text-slate-950">Magic Link Sign In</h1>
      <p className="mt-4 text-slate-600 font-medium">{message}</p>
    </div>
  );
}

export default function MagicLinkPage() {
  return (
    <main className="min-h-[60vh] page-shell flex items-center justify-center py-16">
      <Suspense fallback={
        <div className="max-w-lg w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-black text-slate-950">Magic Link Sign In</h1>
          <p className="mt-4 text-slate-600 font-medium">Verifying sign-in link...</p>
        </div>
      }>
        <MagicLinkVerify />
      </Suspense>
    </main>
  );
}
