"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarDays, KeyRound, ShieldCheck, User2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
  const { language } = useLanguage();
  const en = language === "en";
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const memberSince = useMemo(() => {
    if (!user.createdAt) return en ? "Now" : "Tani";
    return new Date(user.createdAt).toLocaleDateString();
  }, [en, user.createdAt]);

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
      if (!response.ok) throw new Error(data.error || (en ? "Profile update failed" : "Përditësimi i profilit dështoi"));

      toast.success(data.passwordChanged
        ? en ? "Profile and password updated" : "Profili dhe fjalëkalimi u përditësuan"
        : en ? "Profile updated" : "Profili u përditësua");
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : en ? "Something went wrong" : "Diçka shkoi keq");
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
              {en ? "Profile & Security" : "Profili & Siguria"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              {en ? "Personal Info" : "Të dhënat personale"}
            </h2>
          </div>
        </div>

        {/* Quick Stats/Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: en ? "Role" : "Roli", value: user.role === "admin" ? "Administrator" : en ? "User" : "Përdorues", icon: ShieldCheck },
            { label: en ? "Member Since" : "Anëtar që prej", value: memberSince, icon: CalendarDays }
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
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{en ? "Full Name" : "Emri i plotë"}</label>
              <input 
                type="text" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                required 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{en ? "Email Address" : "Adresa e email-it"}</label>
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
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">{en ? "Password" : "Fjalëkalimi"}</p>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {en ? "Send a secure reset link to your email." : "Dërgo një link të sigurt për rivendosje në email."}
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
                    if (!response.ok) throw new Error(data.error || (en ? "Could not send reset link." : "Linku i rivendosjes nuk mund të dërgohej."));
                    toast.success(en
                      ? `Reset link sent to: ${normalizedEmail}. Check Inbox and Spam.`
                      : `Linku i rivendosjes u dërgua te: ${normalizedEmail}. Kontrollo kutinë hyrëse dhe spam-in.`);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : en ? "Could not send reset link." : "Linku i rivendosjes nuk mund të dërgohej.");
                  } finally {
                    setSendingReset(false);
                  }
                }}
                className="shrink-0 rounded-xl px-5 py-3 text-xs font-black text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                style={{ background: "var(--slate-950)", backgroundColor: "#0f172a" }}
              >
                {sendingReset ? en ? "Sending..." : "Duke dërguar..." : en ? "Reset Password" : "Rivendos Fjalëkalimin"}
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
              {saving ? en ? "Saving..." : "Duke ruajtur..." : en ? "Save Profile" : "Ruaj Profilin"}
            </button>
            <button 
              type="button" 
              onClick={() => { setName(user.name); setEmail(user.email); }}
              className="w-full sm:w-auto rounded-xl px-7 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              {en ? "Discard" : "Anulo"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
