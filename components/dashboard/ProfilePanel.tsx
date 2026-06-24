"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarDays, KeyRound, Mail, ShieldCheck, User2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Props = {
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt?: string | Date;
  };
};

export default function ProfilePanel({ user }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const memberSince = useMemo(() => {
    if (!user.createdAt) return "Now";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user.createdAt]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Profile update failed");

      toast.success(data.passwordChanged ? "Profile and password updated" : "Profile updated");
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section 
      className="rounded-[2rem] p-6 sm:p-8 md:p-10 relative bg-white"
      style={{
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.03)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
          <div 
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] border border-slate-100 shadow-sm"
            style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
          >
            <User2 className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: "var(--brand-accent)" }}>
              Profile & Security
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Personal Info
            </h2>
          </div>
        </div>

        {/* Quick Stats/Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Role", value: user.role, icon: ShieldCheck },
            { label: "Member Since", value: memberSince, icon: CalendarDays }
          ].map((item) => (
            <div 
              key={item.label} 
              className="rounded-2xl p-4 sm:p-5 border border-slate-100 bg-slate-50/50"
            >
              <item.icon className="h-5 w-5 mb-3" style={{ color: "var(--brand-accent)" }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">
                {item.label}
              </p>
              <p className="text-sm font-black capitalize text-slate-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Edit Form */}
        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                required 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                required 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="rounded-[1.25rem] p-5 sm:p-6 bg-slate-50 border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <KeyRound className="h-4.5 w-4.5" style={{ color: "var(--brand-accent)" }} />
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">Password</p>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Send a secure reset link to your email.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setSendingReset(true);
                  try {
                    const normalizedEmail = email.trim().toLowerCase();
                    const response = await fetch("/api/auth/password-reset/request", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: normalizedEmail })
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || "Could not send reset link.");
                    toast.success(`Reset link u dergua te: ${normalizedEmail}. Kontrollo Inbox dhe Spam.`);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Could not send reset link.");
                  } finally {
                    setSendingReset(false);
                  }
                }}
                className="shrink-0 rounded-xl px-5 py-3 text-xs font-black text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                style={{ background: "var(--slate-950)", backgroundColor: "#0f172a" }}
              >
                {sendingReset ? "Sending..." : "Reset Password"}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto rounded-xl px-7 py-3.5 text-sm font-black text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
              style={{ background: "var(--brand-accent)" }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <button 
              type="button" 
              onClick={() => { setName(user.name); setEmail(user.email); }}
              className="w-full sm:w-auto rounded-xl px-7 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
