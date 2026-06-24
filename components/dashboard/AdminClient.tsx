"use client";

import React from "react";
import Link from "next/link";
import { Clock3, LayoutDashboard, MapPinned, PlusCircle, ShieldCheck, Users, AlertTriangle } from "lucide-react";
import BlogStudio from "@/components/dashboard/BlogStudio";
import AdminProfile from "@/components/dashboard/AdminProfile";
import { useLanguage } from "@/context/LanguageContext";

type ListingAny = any;

export default function AdminClient({
  totalUsers,
  totalListings,
  pendingListings,
  totalReports,
  totalBlogs,
  totalCities,
  serializedBlogs,
  displayName,
  authEmail
}: {
  totalUsers: number;
  totalListings: number;
  pendingListings: number;
  totalReports: number;
  totalBlogs: number;
  totalCities: number;
  serializedBlogs: ListingAny[];
  displayName: string;
  authEmail: string;
}) {
  const { t } = useLanguage();
  const adminText = t.admin as Record<string, string>;

  const stats = [
    { icon: Users, label: t.admin.users, value: totalUsers, accent: "bg-blue-50 text-blue-700", href: "/admin/users" },
    { icon: ShieldCheck, label: t.admin.listings, value: totalListings, accent: "bg-brand-50 text-brand-700", href: "/admin/listings" },
    { icon: Clock3, label: t.admin.pending, value: pendingListings, accent: "bg-amber-50 text-amber-700", href: "/admin/listings?status=pending" },
    { icon: AlertTriangle, label: t.admin.reports, value: totalReports, accent: "bg-red-50 text-red-700", href: "/admin/reports" },
    { icon: LayoutDashboard, label: t.admin.blogs, value: totalBlogs, accent: "bg-violet-50 text-violet-700", href: "/admin/blogs" },
    { icon: MapPinned, label: adminText.cities || "Qytete", value: totalCities, accent: "bg-teal-50 text-teal-700", href: "/admin/cities" }
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
          <Link href="/admin/cities" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
            {adminText.addCity || 'Shto Qytet'}
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AdminProfile displayName={displayName} authEmail={authEmail} />
        </div>
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {stats.map((item) => (
          <Link key={item.label} href={item.href} className="surface p-6 hover:border-brand-500 transition-all hover:shadow-xl group">
            <item.icon className={`h-10 w-10 rounded-2xl p-2.5 ${item.accent} transition-transform group-hover:scale-110`} />
            <p className="mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{item.value.toLocaleString()}</p>
          </Link>
        ))}
        </div>
      </div>

      {/* Pending moderation removed from dashboard per request — manage approvals in /admin/listings?status=pending */}

      <div className="mt-12" id="blog-studio">
        <BlogStudio recentPosts={serializedBlogs as any[]} />
      </div>

    </section>
  );
}
