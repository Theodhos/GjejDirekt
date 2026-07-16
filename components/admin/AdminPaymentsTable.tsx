"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Calendar, Search, CheckCircle2, Clock3, BadgeCheck, Megaphone, Crown, ArrowLeft, ArrowUp, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const COPY = {
  al: {
    title: "Pagesat",
    subtitle: "Shiko kush ka paguar dhe aprovo manualisht paketat Verified, Ads dhe Ads Pro.",
    searchPlaceholder: "Kërko përdorues, listim, paketë...",
    noPayments: "Ende nuk ka pagesa.",
    summary: (count: number, total: number) =>
      `${count} ${count === 1 ? "pagesë" : "pagesa"} · €${total} gjithsej`,
    colUser: "Përdoruesi",
    colListing: "Listimi",
    colAmount: "Shuma",
    colDate: "Data",
    colStatus: "Statusi",
    colAction: "Paketat",
    statusNone: "None",
    approveVerify: "Aprovo Verified",
    approveAds: "Aprovo Ads",
    approveAdsPro: "Aprovo Ads Pro",
    approved: "Aprovuar",
    verifying: "Procesohet...",
    verified: "I Verifikuar",
    paid: "Paguar",
    verifiedToast: "Paketë e aprovuar",
    removedToast: "Paketa u hoq",
    removePackage: "Hiq paketën",
    failToast: "Aprovimi dështoi"
  },
  en: {
    title: "Payments",
    subtitle: "See who paid and approve Verified, Ads, and Ads Pro packages manually.",
    searchPlaceholder: "Search user, listing, package...",
    noPayments: "No payments yet.",
    summary: (count: number, total: number) =>
      `${count} payment${count === 1 ? "" : "s"} · €${total} total`,
    colUser: "User",
    colListing: "Listing",
    colAmount: "Amount",
    colDate: "Date",
    colStatus: "Status",
    colAction: "Packages",
    statusNone: "None",
    approveVerify: "Approve Verified",
    approveAds: "Approve Ads",
    approveAdsPro: "Approve Ads Pro",
    approved: "Approved",
    verifying: "Processing...",
    verified: "Verified",
    paid: "Paid",
    verifiedToast: "Package approved",
    removedToast: "Package removed",
    removePackage: "Remove package",
    failToast: "Approval failed"
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
  listingPackage?: string | null;
  listingVerified?: boolean;
  createdAt?: string | null;
};

export default function AdminPaymentsTable({ initialPayments }: { initialPayments: Payment[] }) {
  const router = useRouter();
  const { language } = useLanguage();
  const c = COPY[language === "en" ? "en" : "al"];
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<{ id: string; packageKey: string } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const filtered = initialPayments.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.userName && p.userName.toLowerCase().includes(term)) ||
      (p.userEmail && p.userEmail.toLowerCase().includes(term)) ||
      (p.listingTitle && p.listingTitle.toLowerCase().includes(term))
    );
  });

  // The assigned package renders black; the packages still available render green.
  const ASSIGNED_COLOR = "bg-slate-900 text-white";
  const AVAILABLE_COLOR = "bg-brand-600 text-white";

  const PACKAGE_TAGS = [
    { label: "Verified", value: "verified" },
    { label: "Ads", value: "ads" },
    { label: "Ads Pro", value: "ads pro" }
  ];

  const normalizePackage = (packageName?: string) => {
    const key = String(packageName || "").toLowerCase();
    if (key.includes("verified") || key === "verify") return "verified";
    if (key.includes("ads pro") || packageName === "features") return "ads pro";
    if (key.includes("ads") || key === "trading") return "ads";
    return null;
  };

  const getCurrentPackage = (p: Payment) => normalizePackage(p.listingPackage || p.packageName);

  const handleApprove = async (id: string, packageKey: string, packageLabel: string) => {
    const confirmMessage = packageKey === "none"
      ? (language === "en"
        ? `Remove ${packageLabel} from this service?`
        : `Hiq ${packageLabel} nga ky shërbim?`)
      : (language === "en"
        ? `Approve ${packageLabel} for this service?`
        : `Aprovo ${packageLabel} për këtë shërbim?`);
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setPending({ id, packageKey });
    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageKey })
      });
      if (res.ok) {
        toast.success(packageKey === "none" ? c.removedToast : c.verifiedToast);
        router.refresh();
      } else {
        toast.error(c.failToast);
      }
    } catch {
      toast.error(c.failToast);
    } finally {
      setPending(null);
    }
  };

  const totalAmount = filtered.reduce((sum, payment) => sum + (payment.amount ?? 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">{c.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{c.subtitle}</p>
        </div>
        <div className="text-sm text-slate-500">
          {language === "en"
            ? `${filtered.length} payments · €${totalAmount} total`
            : `${filtered.length} pagesa · €${totalAmount} gjithsej`}
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

      {filtered.length === 0 ? (
        <div className="surface border-none shadow-xl rounded-[2rem] bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-500">{c.noPayments}</p>
        </div>
      ) : (
        <div className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/90">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colUser}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colListing}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colStatus}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{c.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const currentPackageValue = getCurrentPackage(p);
                  const currentTag = PACKAGE_TAGS.find((tag) => tag.value === currentPackageValue);
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center font-black text-brand-600 text-lg shadow-sm border border-brand-100/50">
                            {p.userName?.charAt(0).toUpperCase() || "U"}
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
                        {currentTag ? (
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-widest ${ASSIGNED_COLOR}`}>
                            {currentTag.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            {c.statusNone}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {PACKAGE_TAGS.map((tag) => {
                            const isCurrent = tag.value === currentPackageValue;
                            const isRowPending = pending?.id === p._id;
                            const isLoading = isRowPending && pending?.packageKey === tag.value;
                            const isRemoving = isRowPending && pending?.packageKey === "none" && isCurrent;
                            return (
                              <div key={tag.value} className="relative">
                                <button
                                  onClick={() => handleApprove(p._id, tag.value, tag.label)}
                                  disabled={isRowPending}
                                  className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-widest transition ${isCurrent ? ASSIGNED_COLOR : `${AVAILABLE_COLOR} opacity-90 hover:opacity-100`} ${isRowPending && !isLoading && !isRemoving ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  {isLoading || isRemoving ? c.verifying : tag.label}
                                </button>
                                {isCurrent && (
                                  <button
                                    type="button"
                                    title={c.removePackage}
                                    aria-label={c.removePackage}
                                    onClick={() => handleApprove(p._id, "none", tag.label)}
                                    disabled={isRowPending}
                                    className={`absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white bg-rose-500 text-white shadow-sm transition hover:bg-rose-600 ${isRowPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    <X className="h-3 w-3" strokeWidth={3} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
