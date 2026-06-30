"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, BadgeCheck, Clock3, CheckCircle2, Receipt } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  al: {
    eyebrow: "Pagesat e tua",
    title: "Pagesat",
    subtitle: "Të gjitha paketat që ke marrë dhe shërbimi për të cilin janë caktuar.",
    back: "Kthehu te paneli",
    noPayments: "Ende nuk ke asnjë pagesë.",
    browsePackages: "Shiko paketat",
    summary: (count: number, total: number) =>
      `${count} ${count === 1 ? "pagesë" : "pagesa"} · €${total} gjithsej`,
    colPackage: "Paketa",
    colService: "Shërbimi",
    colAmount: "Shuma",
    colDate: "Data",
    colStatus: "Statusi",
    free: "Falas",
    pending: "Në pritje",
    approved: "I Verifikuar",
    paid: "Paguar"
  },
  en: {
    eyebrow: "Your payments",
    title: "Payments",
    subtitle: "Every package you have taken and the service it was applied to.",
    back: "Back to dashboard",
    noPayments: "You have no payments yet.",
    browsePackages: "Browse packages",
    summary: (count: number, total: number) =>
      `${count} payment${count === 1 ? "" : "s"} · €${total} total`,
    colPackage: "Package",
    colService: "Service",
    colAmount: "Amount",
    colDate: "Date",
    colStatus: "Status",
    free: "Free",
    pending: "Pending",
    approved: "Verified",
    paid: "Paid"
  }
} as const;

type Payment = {
  _id: string;
  listingTitle?: string;
  packageName?: string;
  packet?: string;
  amount?: number;
  currency?: string;
  verificationStatus?: "none" | "pending" | "approved";
  createdAt?: string | null;
};

export default function UserPaymentsTable({ payments }: { payments: Payment[] }) {
  const { language } = useLanguage();
  const c = COPY[language === "en" ? "en" : "al"];
  const total = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const statusBadge = (p: Payment) => {
    if (p.verificationStatus === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "rgba(245,158,11,0.12)", color: "#b45309" }}>
          <Clock3 className="w-3.5 h-3.5" />
          {c.pending}
        </span>
      );
    }
    if (p.verificationStatus === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
          <BadgeCheck className="w-3.5 h-3.5" />
          {c.approved}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "rgba(16,185,129,0.12)", color: "#047857" }}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        {(p.amount ?? 0) === 0 ? c.free : c.paid}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-80"
          style={{ border: "1px solid var(--border-soft)", color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="eyebrow mb-1">{c.eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{c.title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{c.subtitle}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl mx-auto mb-4" style={{ background: "var(--surface-subtle)" }}>
            <Receipt className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
          </div>
          <p className="text-sm font-medium mb-5" style={{ color: "var(--text-tertiary)" }}>{c.noPayments}</p>
          <Link
            href="/packet"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-accent)" }}
          >
            {c.browsePackages}
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{c.title}</h2>
            <span
              className="rounded-full px-3.5 py-1 text-xs font-semibold"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid var(--brand-border)" }}
            >
              {c.summary(payments.length, total)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead style={{ background: "var(--surface-cream)" }}>
                <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.colPackage}</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.colService}</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.colAmount}</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.colDate}</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.packageName || p.packet || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{p.listingTitle || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>€{p.amount ?? 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                        <Calendar className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">{statusBadge(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
