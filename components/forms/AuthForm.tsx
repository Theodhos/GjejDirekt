"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [emailForMagic, setEmailForMagic] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success(mode === "login" ? "Welcome back!" : "Account created!");
    window.dispatchEvent(new Event("auth-changed"));
    router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" ? (
        <>
          <Input name="name" label="Name" placeholder="Your name" required />
          <Input name="phone" type="tel" label="Phone Number" placeholder="+1 234 567 890" required />
        </>
      ) : null}

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="email@example.com"
        required
        value={emailForMagic}
        onChange={(event) => setEmailForMagic(event.target.value)}
      />
      <Input name="password" type="password" label="Password" placeholder="********" required />

      {mode === "login" ? (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={async () => {
              if (!emailForMagic.trim()) {
                toast.error("Write your email first.");
                return;
              }

              setMagicLoading(true);
              try {
                const normalizedEmail = emailForMagic.trim().toLowerCase();
                const response = await fetch("/api/auth/magic-link/request", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: normalizedEmail })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Could not send sign-in link.");
                toast.success("Sign-in link sent. Check inbox and Spam folder.");
                window.alert(`Sign-in link u dergua te: ${normalizedEmail}\nKontrollo edhe Spam folder.`);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not send sign-in link.");
              } finally {
                setMagicLoading(false);
              }
            }}
            className="text-xs font-semibold text-brand-700 hover:underline"
            disabled={magicLoading}
          >
            {magicLoading ? "Sending..." : "Login with magic link"}
          </button>
        </div>
      ) : null}

      {mode === "login" ? (
        <p className="-mt-2 text-xs text-slate-500">If you do not see the email, check your Spam folder.</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
      </Button>
    </form>
  );
}
