import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Mail, Shield, Calendar } from "lucide-react";
import AdminUserTable from "@/components/admin/AdminUserTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean<any>();
  const serializedUsers = users.map((u: any) => ({ ...u, _id: u._id.toString() }));

  return (
    <section className="page-shell py-10">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-slate-950">User Management</h1>
                <p className="text-sm text-slate-500 mt-1">Manage all registered accounts and roles.</p>
            </div>
        </div>
        <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-brand-600 transition">
            <UserPlus className="w-4 h-4" />
            Create User
        </button>
      </div>

      <AdminUserTable initialUsers={serializedUsers} />
    </section>
  );
}
