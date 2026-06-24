import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import AdminCityManager from "@/components/dashboard/AdminCityManager";

export const dynamic = "force-dynamic";

export default async function AdminCitiesPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  return (
    <section className="page-shell py-6 sm:py-8">
      <div className="mb-5 flex items-start gap-4">
        <Link href="/admin" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" aria-label="Back to admin">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="eyebrow">Admin cities</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Qytetet</h1>
          <p className="mt-1 text-sm text-slate-600">Menaxho qytetet dhe banner-at e tyre nga nje faqe e dedikuar.</p>
        </div>
      </div>
      <AdminCityManager />
    </section>
  );
}
