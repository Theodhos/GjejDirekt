"use client";

import React from "react";
import Link from "next/link";
import { Clock3, LayoutDashboard, MapPinned, PlusCircle, ShieldCheck, Users, AlertTriangle, CreditCard, ArrowUpRight, ShoppingBag, CalendarCheck, Store } from "lucide-react";
import BlogStudio from "@/components/dashboard/BlogStudio";
import CityStudio from "@/components/dashboard/CityStudio";
import AdminProfile from "@/components/dashboard/AdminProfile";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";

type ListingAny = any;

/** One business's share of the platform's orders and reservations. */
export type BusinessStat = {
  id: string;
  title: string;
  slug: string;
  location: string;
  orders: number;
  reservations: number;
  /** Sum of every order/reservation total that carried a price, in lek. */
  revenue: number;
  /** ISO date of the most recent order or reservation, null when there is none. */
  lastAt: string | null;
};

export default function AdminClient({
  totalUsers,
  totalListings,
  pendingListings,
  totalReports,
  totalBlogs,
  totalPayments,
  totalOrders,
  totalReservations,
  totalCities,
  businessStats = [],
  serializedBlogs,
  displayName,
  authEmail
}: {
  totalUsers: number;
  totalListings: number;
  pendingListings: number;
  totalReports: number;
  totalBlogs: number;
  totalPayments: number;
  totalOrders: number;
  totalReservations: number;
  totalCities: number;
  businessStats?: BusinessStat[];
  serializedBlogs: ListingAny[];
  displayName: string;
  authEmail: string;
}) {
  const { t, language } = useLanguage();
  const en = language === "en";
  const adminText = t.admin as Record<string, string>;
  const viewLabel = en ? "View" : "Shiko";
  const formatWhen = (value: string | null) =>
    value ? new Date(value).toLocaleDateString(en ? "en-GB" : "sq-AL", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const stats = [
    { icon: Users, label: t.admin.users, value: totalUsers, accent: "bg-blue-50 text-blue-700", href: "/admin/users" },
    { icon: ShieldCheck, label: t.admin.listings, value: totalListings, accent: "bg-brand-50 text-brand-700", href: "/admin/listings" },
    { icon: Clock3, label: t.admin.pending, value: pendingListings, accent: "bg-amber-50 text-amber-700", href: "/admin/listings?status=pending" },
    { icon: AlertTriangle, label: t.admin.reports, value: totalReports, accent: "bg-red-50 text-red-700", href: "/admin/reports" },
    { icon: LayoutDashboard, label: t.admin.blogs, value: totalBlogs, accent: "bg-violet-50 text-violet-700", href: "/admin/blogs" },
    { icon: MapPinned, label: adminText.cities || "Qytete", value: totalCities, accent: "bg-teal-50 text-teal-700", href: "/admin/cities" },
    { icon: CreditCard, label: adminText.payments || "Payments", value: totalPayments, accent: "bg-emerald-50 text-emerald-700", href: "/admin/payments" },
    { icon: ShoppingBag, label: language === "en" ? "Orders" : "Porositë", value: totalOrders, accent: "bg-orange-50 text-orange-700", href: "/admin/orders" },
    { icon: CalendarCheck, label: language === "en" ? "Reservations" : "Rezervimet", value: totalReservations, accent: "bg-sky-50 text-sky-700", href: "/admin/reservations" }
  ];

  return (
    <section className="page-shell py-6 sm:py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{t.admin.consoleTitle}</p>
          <h1 className="mt-2 text-2xl font-black text-slate-900">{t.admin.heroTitle}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{t.admin.identifiedAs} {displayName}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{authEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/create-listing" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            <PlusCircle className="h-4 w-4" />
            <span>{adminText.addListingShort || t.admin.addListing}</span>
          </Link>
          <Link href="#blog-studio" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
            {adminText.blogStudio || 'Shto Blog'}
          </Link>
          <button
            type="button"
            onClick={() => document.getElementById("city-studio")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {adminText.addCity || 'Shto Qytet'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        <div className="flex lg:col-span-1">
          <AdminProfile displayName={displayName} authEmail={authEmail} />
        </div>
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {stats.map((item) => (
          <Link key={item.label} href={item.href} className="surface flex flex-col p-6 cursor-pointer hover:border-brand-500 transition-all hover:shadow-xl hover:-translate-y-0.5 group">
            <item.icon className={`h-10 w-10 rounded-2xl p-2.5 ${item.accent} transition-transform group-hover:scale-110`} />
            <p className="mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{item.value.toLocaleString()}</p>
            <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all group-hover:bg-brand-700 group-hover:gap-2.5">
              {viewLabel}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
        </div>
      </div>

      {/* Orders and reservations per business — which businesses the platform is
          actually sending customers to, busiest first. */}
      <div className="mt-12" id="business-orders">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-orange-600 flex items-center gap-2">
              <Store className="w-4 h-4" /> {en ? "Per business" : "Sipas biznesit"}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{en ? "Orders by business" : "Porositë sipas biznesit"}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {en
                ? "How many orders and reservations every business has received, busiest first."
                : "Sa porosi dhe rezervime ka marrë çdo biznes, më të ngarkuarit në krye."}
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {businessStats.length} {en ? "businesses" : "biznese"}
          </span>
        </div>

        <div className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white">
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{en ? "Business" : "Biznesi"}</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">{en ? "Orders" : "Porosi"}</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">{en ? "Reservations" : "Rezervime"}</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">{en ? "Total" : "Gjithsej"}</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">{en ? "Value" : "Vlera"}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{en ? "Last" : "E fundit"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businessStats.length > 0 ? (
                  businessStats.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        {row.slug ? (
                          <Link href={`/listings/${row.slug}`} className="font-bold text-slate-950 text-sm hover:underline">
                            {row.title}
                          </Link>
                        ) : (
                          <span className="text-sm font-bold text-slate-400">{row.title}</span>
                        )}
                        {row.location && <p className="text-xs text-slate-400">{row.location}</p>}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-orange-700">{row.orders.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-sky-700">{row.reservations.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-sm font-black text-slate-950">{(row.orders + row.reservations).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600">{row.revenue > 0 ? formatPrice(row.revenue) : "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatWhen(row.lastAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm font-bold text-slate-500">{en ? "No orders or reservations yet." : "Ende asnjë porosi ose rezervim."}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-12" id="blog-studio">
        <BlogStudio recentPosts={serializedBlogs as any[]} />
      </div>

      <div className="mt-12">
        <CityStudio />
      </div>

    </section>
  );
}
