"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export default function MagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying magic link...");

  useEffect(() => {
    const href = window.location.href;

    (async () => {
      try {
        if (!isSignInWithEmailLink(firebaseAuth, href)) {
          setMessage("Invalid magic link.");
          return;
        }

        let email = window.localStorage.getItem("emailForSignIn") || "";
        if (!email) {
          email = window.prompt("Confirm your email to finish sign-in") || "";
        }
        if (!email) {
          setMessage("Email is required to complete sign-in.");
          return;
        }

        const credential = await signInWithEmailLink(firebaseAuth, email, href);
        window.localStorage.removeItem("emailForSignIn");

        const response = await fetch("/api/auth/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credential.user.email,
            name: credential.user.displayName || email.split("@")[0],
            photoURL: credential.user.photoURL || "",
            providerId: "magic-link"
          })
        });

        const data = await response.json();
        if (!response.ok) {
          setMessage(data.error || "Could not create session.");
          return;
        }

        setMessage("Success! Redirecting...");
        router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Magic link failed.");
      }
    })();
  }, [router, searchParams]);

  return (
    <main className="min-h-[60vh] page-shell flex items-center justify-center py-16">
      <div className="max-w-lg w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-black text-slate-950">Magic Link Sign In</h1>
        <p className="mt-4 text-slate-600 font-medium">{message}</p>
      </div>
    </main>
  );
}
