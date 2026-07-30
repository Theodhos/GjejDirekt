import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import AdminReports from "@/components/dashboard/AdminReports";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const totalReports = await Report.countDocuments({ status: "pending" });
  const recentReports = await Report.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .populate("reporter", "name email")
    .populate("listing", "title slug")
    .limit(100)
    .lean<any[]>();

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="surface border-none border-red-100 bg-red-50/20 p-5 shadow-2xl sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6 pb-6 border-b border-red-100/50 sm:mb-10 sm:pb-10">
          <div className="flex items-start gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <p className="eyebrow text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Community reports
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">Reported posts</h1>
              <p className="mt-2 text-slate-500">There are {totalReports} reports waiting for review.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <AdminReports reports={recentReports.map((r: any) => ({ ...r, _id: r._id.toString() }))} />
        </div>
      </div>
    </section>
  );
}
