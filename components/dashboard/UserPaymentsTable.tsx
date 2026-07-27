"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock3,
  Crown,
  Megaphone,
  Receipt,
  Rocket,
  TimerOff
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PACKAGE_CATALOG, currencySymbol, type PackageBilling, type PackageKey } from "@/lib/packages";

export type PaymentRowStatus = "active" | "expired" | "pending" | "approved" | "paid" | "free";

export type PaymentRow = {
  id: string;
  packageKey: PackageKey | null;
  packageName: string;
  listingTitle: string;
  listingSlug: string;
  amount: number;
  currency: string;
  billing: PackageBilling | null;
  date: string | null;
  expiresAt: string | null;
  status: PaymentRowStatus;
};

const COPY = {
  al: {
    eyebrow: "Pagesat e tua",
    title: "Pagesat",
    subtitle: "Historiku i plotë i paketave dhe pagesave për çdo shërbim.",
    back: "Kthehu te paneli",
    historyTitle: "Historiku i pagesave",
    noPayments: "Ende nuk ke asnjë paketë apo pagesë.",
    noPaymentsHint: "Aktivizo Verified për të shkyçur Website, Book Now, rrjetet sociale dhe galerinë me 10 foto.",
    browsePackages: "Shiko paketat",
    summary: (count: number, total: number) =>
      `${count} ${count === 1 ? "pagesë" : "pagesa"} · €${total} gjithsej`,
    colPackage: "Paketa",
    colService: "Shërbimi",
    colAmount: "Shuma",
    colDate: "Data",
    colStatus: "Statusi",
    noService: "Pa shërbim të caktuar",
    expiresOn: "Skadon më",
    oneTime: "një herë",
    perMonth: "/ muaj",
    status: {
      active: "Aktive",
      expired: "Skaduar",
      pending: "Në pritje",
      approved: "Aprovuar",
      paid: "Paguar",
      free: "Falas"
    }
  },
  en: {
    eyebrow: "Your payments",
    title: "Payments",
    subtitle: "The full history of packages and payments for every service.",
    back: "Back to dashboard",
    historyTitle: "Payment history",
    noPayments: "You have no package or payment yet.",
    noPaymentsHint: "Activate Verified to unlock Website, Book Now, social links and the 10-photo gallery.",
    browsePackages: "Browse packages",
    summary: (count: number, total: number) =>
      `${count} payment${count === 1 ? "" : "s"} · €${total} total`,
    colPackage: "Package",
    colService: "Service",
    colAmount: "Amount",
    colDate: "Date",
    colStatus: "Status",
    noService: "No service assigned",
    expiresOn: "Expires on",
    oneTime: "one-time",
    perMonth: "/ month",
    status: {
      active: "Active",
      expired: "Expired",
      pending: "Pending",
      approved: "Approved",
      paid: "Paid",
      free: "Free"
    }
  }
} as const;

const PACKAGE_ICONS: Record<PackageKey, typeof BadgeCheck> = {
  free: Rocket,
  verified: BadgeCheck,
  ads: Megaphone,
  "ads-pro": Crown
};

const STATUS_STYLES: Record<PaymentRowStatus, { background: string; color: string }> = {
  active: { background: "rgba(16,185,129,0.12)", color: "#047857" },
  expired: { background: "#FEE2E2", color: "#DC2626" },
  pending: { background: "rgba(245,158,11,0.12)", color: "#b45309" },
  approved: { background: "var(--brand-light)", color: "var(--brand-accent)" },
  paid: { background: "rgba(16,185,129,0.12)", color: "#047857" },
  free: { background: "rgba(16,185,129,0.12)", color: "#047857" }
};

const STATUS_ICONS: Record<PaymentRowStatus, typeof CheckCircle2> = {
  active: CheckCircle2,
  expired: TimerOff,
  pending: Clock3,
  approved: BadgeCheck,
  paid: CheckCircle2,
  free: CheckCircle2
};

export default function UserPaymentsTable({ rows }: { rows: PaymentRow[] }) {
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "al";
  const c = COPY[lang];
  const total = rows.reduce((sum, row) => sum + (row.amount ?? 0), 0);

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString(lang === "en" ? "en-GB" : "sq-AL") : "—";

  const billingNote = (row: PaymentRow) => {
    if (!row.billing) return "";
    if (row.billing === "monthly") return c.perMonth;
    if (row.billing === "one-time") return c.oneTime;
    return c.status.free;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-80"
          style={{ border: "1px solid var(--border-soft)", color: "var(--text-secondary)" }}
          title={c.back}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="eyebrow mb-1">{c.eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {c.title}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {c.subtitle}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "var(--surface-white)",
            border: "1px solid var(--border-soft)",
            boxShadow: "var(--shadow-card)"
          }}
        >
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "var(--surface-subtle)" }}
          >
            <Receipt className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {c.noPayments}
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs" style={{ color: "var(--text-tertiary)" }}>
            {c.noPaymentsHint}
          </p>
          <Link
            href="/packet"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-accent)" }}
          >
            {c.browsePackages}
          </Link>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "var(--surface-white)",
            border: "1px solid var(--border-soft)",
            boxShadow: "var(--shadow-card)"
          }}
        >
          <div
            className="flex items-center justify-between gap-4 px-6 py-5"
            style={{ borderBottom: "1px solid var(--border-soft)" }}
          >
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {c.historyTitle}
            </h2>
            <span
              className="shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold"
              style={{
                background: "var(--brand-light)",
                color: "var(--brand-accent)",
                border: "1px solid var(--brand-border)"
              }}
            >
              {c.summary(rows.length, total)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead style={{ background: "var(--surface-cream)" }}>
                <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  {[c.colPackage, c.colService, c.colAmount, c.colDate, c.colStatus].map((label) => (
                    <th
                      key={label}
                      className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const Icon = row.packageKey ? PACKAGE_ICONS[row.packageKey] : Receipt;
                  const StatusIcon = STATUS_ICONS[row.status];
                  const label = row.packageKey
                    ? PACKAGE_CATALOG[row.packageKey].label[lang]
                    : row.packageName || "—";
                  const note = billingNote(row);
                  const isExpired = row.status === "expired";

                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2.5">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                            style={{
                              background: isExpired ? "var(--surface-subtle)" : "var(--brand-light)",
                              color: isExpired ? "var(--text-tertiary)" : "var(--brand-accent)"
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                              {label}
                            </span>
                            {note && (
                              <span className="block text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                                {note}
                              </span>
                            )}
                          </span>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {row.listingSlug && row.listingTitle ? (
                          <Link
                            href={`/listings/${row.listingSlug}`}
                            className="text-sm font-medium underline underline-offset-2"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {row.listingTitle}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                            {row.listingTitle || c.noService}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {currencySymbol(row.currency)}
                          {row.amount ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className="flex items-center gap-2 text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Calendar className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                          {formatDate(row.date)}
                        </div>
                        {row.expiresAt && (
                          <p className="mt-0.5 pl-6 text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                            {c.expiresOn} {formatDate(row.expiresAt)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
                          style={STATUS_STYLES[row.status]}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {c.status[row.status]}
                        </span>
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
