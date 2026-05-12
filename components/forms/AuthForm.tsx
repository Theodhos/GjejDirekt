"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
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
      <Input name="email" type="email" label="Email" placeholder="email@example.com" required />
      <Input name="password" type="password" label="Password" placeholder="••••••••" required />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
      </Button>
    </form>
  );
}
