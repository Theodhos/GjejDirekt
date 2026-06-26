"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProfile({ displayName, authEmail }: { displayName: string; authEmail: string }) {
  const { t } = useLanguage();
  const adminText = t.admin as Record<string, string>;
  const commonText = t.common as Record<string, string>;
  const [name, setName] = useState(displayName || "");
  const [email, setEmail] = useState(authEmail || "");
  const [loading, setLoading] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState(true);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      toast.success(t.admin.profileSaved || "Profile saved");
      window.dispatchEvent(new Event("auth-changed"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (commonText.error || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const user = data.user;
        if (user) {
          // If backend has explicit flag use it, else null
          if (typeof user.emailVerified !== 'undefined') setIsEmailVerified(Boolean(user.emailVerified));
          else if (typeof user.verified !== 'undefined') setIsEmailVerified(Boolean(user.verified));
          else setIsEmailVerified(null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setIsEmailVerified(null);
      });
    return () => { mounted = false; };
  }, []);

  async function sendResetConfirmed() {
    setConfirmResetOpen(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset link");
      toast.success(t.admin.resetSent || "Reset link sent to your email");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (commonText.error || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 lg:max-w-md">
      <form onSubmit={saveProfile} className="surface p-4 rounded-2xl">
        <h3 className="text-sm font-semibold text-slate-500 uppercase">{t.admin.profileDataTitle || 'Të dhënat'}</h3>
        <div className="mt-3 grid gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase">{t.admin.fullNameLabel || 'Full name'}</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <label className="text-xs font-bold text-slate-500 uppercase">{t.admin.emailLabel || 'Email address'}</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input value={email} onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                // instant email validation
                setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
              }} />
            </div>
            <div>
              {isEmailVerified === true ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                  ✓ {adminText.verifiedLabel || 'Verified'}
                </span>
              ) : isEmailVerified === false ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-xs font-semibold">
                  {adminText.unverifiedLabel || 'Unverified'}
                </span>
              ) : null}
            </div>
          </div>
          {!emailValid && <p className="text-xs text-rose-600 mt-1">{adminText.invalidEmail || 'Please enter a valid email address.'}</p>}

          <div className="flex items-center gap-4 mt-2">
            <Button type="submit" disabled={loading}>{t.admin.saveProfileBtn || 'Save Profile'}</Button>
            <button type="button" onClick={() => { setName(displayName); setEmail(authEmail); }} className="text-sm font-medium text-slate-600">{commonText.discard || 'Discard'}</button>
          </div>
        </div>
      </form>

      <div className="surface flex flex-1 flex-col p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{adminText.pwResetSubtitle || 'Siguria e llogarisë'}</p>
            <h4 className="text-base font-black text-slate-900">{t.admin.forgotPasswordTitle || 'Fjalëkalimi'}</h4>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600">{t.admin.forgotPasswordDesc || 'Dërgo një link të sigurt për rivendosje në emailin tuaj.'}</p>

        <ul className="mt-4 space-y-2.5">
          {[adminText.pwResetTip1, adminText.pwResetTip2, adminText.pwResetTip3].map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <Button type="button" onClick={() => setConfirmResetOpen(true)} disabled={loading} className="!bg-slate-900 w-full">
            {t.admin.resetPasswordBtn || 'Rivendos Fjalëkalimin'}
          </Button>
        </div>
      </div>

      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <h3 className="text-lg font-bold">{adminText.resetConfirmTitle || 'Confirm password reset'}</h3>
            <p className="mt-2 text-sm text-slate-600">{adminText.resetConfirmDesc || 'We will send a password reset link to your email. Continue?'}</p>
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmResetOpen(false)} className="px-4 py-2 rounded-lg border">{commonText.cancel || 'Cancel'}</button>
              <Button type="button" onClick={sendResetConfirmed} disabled={loading}>{t.admin.resetPasswordBtn || 'Send'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
