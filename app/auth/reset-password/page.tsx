"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LegacyAuthResetRedirectPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token") || "";
    const nextUrl = token ? `/reset-password?token=${encodeURIComponent(token)}` : "/reset-password";
    router.replace(nextUrl);
  }, [params, router]);

  return (
    <main className="page-shell min-h-[50vh] flex items-center justify-center py-16">
      <p className="text-slate-600 font-medium">Redirecting to password reset...</p>
    </main>
  );
}
