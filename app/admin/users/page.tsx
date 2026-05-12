import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Mail, Shield, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean<any>();

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

      <div className="surface overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr key={user._id.toString()} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user._id.toString()}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                        </div>
                        {user.phone && (
                             <div className="flex items-center gap-2 text-xs text-slate-400">
                                {user.phone}
                             </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                        <Shield className="w-3 h-3" />
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-black text-slate-950 hover:text-brand-600 transition">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
