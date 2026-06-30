"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Calendar, Search, CheckCircle2, Clock3, BadgeCheck, Megaphone, Crown, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  al: {
    title: "Pagesat",
    subtitle: "Shiko kush ka paguar dhe aprovo kërkesat për paketën Verified.",
    searchPlaceholder: "Kërko përdorues, listim, paketë...",
    noPayments: "Ende nuk ka pagesa.",
    summary: (count: number, total: number) =>
      `${count} ${count === 1 ? "pagesë" : "pagesa"} · €${total} gjithsej`,
    colUser: "Përdoruesi",
    colListing: "Listimi",
    colAmount: "Shuma",
    colDate: "Data",
    colStatus: "Statusi",
    approveVerify: "Aprovo Verify",
    verifying: "Duke verifikuar...",
    verified: "I Verifikuar",
    paid: "Paguar",
    verifiedToast: "Biznesi u verifikua",
    failToast: "Verifikimi dështoi"
  },
  en: {
    title: "Payments",
    subtitle: "See who paid and approve Verified package requests.",
    searchPlaceholder: "Search user, listing, package...",
    noPayments: "No payments yet.",
    summary: (count: number, total: number) =>
      `${count} payment${count === 1 ? "" : "s"} · €${total} total`,
    colUser: "User",
    colListing: "Listing",
    colAmount: "Amount",
    colDate: "Date",
    colStatus: "Status",
    approveVerify: "Approve Verify",
    verifying: "Verifying...",
    verified: "Verified",
    paid: "Paid",
    verifiedToast: "Business verified",
    failToast: "Failed to verify"
  }
} as const;

type Payment = {
  _id: string;
  userName?: string;
  userEmail?: string;
  listingTitle?: string;
  packageName?: string;
  packet?: string;
  amount?: number;
  currency?: string;
  verificationStatus?: "none" | "pending" | "approved";
  createdAt?: string | null;
};

// Fixed display order + icon per package category.
const CATEGORY_ORDER = ["Verified", "Ads", "Ads Pro"] as const;
const CATEGORY_ICON: Record<string, any> = {
  Verified: BadgeCheck,
  Ads: Megaphone,
  "Ads Pro": Crown
};

export default function AdminPaymentsTable({ initialPayments }: { initialPayments: Payment[] }) {
  const router = useRouter();
  const { language } = useLanguage();
  const c = COPY[language === "en" ? "en" : "al"];
  const [search, setSearch] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const filtered = initialPayments.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.userName && p.userName.toLowerCase().includes(term)) ||
      (p.userEmail && p.userEmail.toLowerCase().includes(term)) ||
      (p.listingTitle && p.listingTitle.toLowerCase().includes(term)) ||
      (p.packageName && p.packageName.toLowerCase().includes(term))
    );
  });

  // Group payments by package category. Keep known packages in a fixed order,
  // then append any unexpected category names at the end.
  const groups = new Map<string, Payment[]>();
  for (const p of filtered) {
    const key = p.packageName || p.packet || "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  const orderedKeys = [
    ...CATEGORY_ORDER.filter((k) => groups.has(k)),
    ...Array.from(groups.keys()).filter((k) => !CATEGORY_ORDER.includes(k as any))
  ];

  const handleApprove = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, { method: "POST" });
      if (res.ok) {
        toast.success(c.verifiedToast);
        router.refresh();
      } else {
        toast.error(c.failToast);
      }
    } catch {
      toast.error(c.failToast);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-950">{c.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{c.subtitle}</p>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={c.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
      </div>

      {orderedKeys.length === 0 && (
        <div className="surface border-none shadow-xl rounded-[2rem] bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-500">{c.noPayments}</p>
        </div>
      )}

      {orderedKeys.map((key) => {
        const rows = groups.get(key)!;
        const Icon = CATEGORY_ICON[key] || CheckCircle2;
        const total = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0);
        return (
          <div key={key} className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100/50">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">{key}</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {c.summary(rows.length, total)}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50/90">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colUser}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colListing}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colAmount}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colDate}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center font-black text-brand-600 text-lg shadow-sm border border-brand-100/50">
                            {p.userName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-black text-slate-950 text-sm">{p.userName || "—"}</p>
                            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <Mail className="w-3 h-3" />
                              {p.userEmail || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-600">{p.listingTitle || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-slate-950">€{p.amount ?? 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {p.verificationStatus === "pending" ? (
                          <button
                            onClick={() => handleApprove(p._id)}
                            disabled={verifyingId === p._id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white hover:bg-amber-600 transition disabled:opacity-60"
                          >
                            <Clock3 className="w-3.5 h-3.5" />
                            {verifyingId === p._id ? c.verifying : c.approveVerify}
                          </button>
                        ) : p.verificationStatus === "approved" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-brand-700 border border-brand-100">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            {c.verified}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {c.paid}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
