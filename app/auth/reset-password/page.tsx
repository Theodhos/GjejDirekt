"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LegacyAuthResetRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token") || "";
    const nextUrl = token ? `/reset-password?token=${encodeURIComponent(token)}` : "/reset-password";
    router.replace(nextUrl);
  }, [params, router]);

  return (
    <p className="text-slate-600 font-medium">Redirecting to password reset...</p>
  );
}

export default function LegacyAuthResetRedirectPage() {
  return (
    <main className="page-shell min-h-[50vh] flex items-center justify-center py-16">
      <Suspense fallback={<p className="text-slate-600 font-medium">Redirecting to password reset...</p>}>
        <LegacyAuthResetRedirect />
      </Suspense>
    </main>
  );
}
