"use client";

import { useState } from "react";
import { Mail, Shield, Calendar, Search } from "lucide-react";

export default function AdminUserTable({ initialUsers }: { initialUsers: any[] }) {
  const [search, setSearch] = useState("");

  const filteredUsers = initialUsers.filter((user) => {
    const term = search.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-6">
        <h2 className="text-lg font-black text-slate-950">Registered Users</h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm">
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Services</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center font-black text-brand-600 text-lg shadow-sm border border-brand-100/50">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-black text-slate-950 text-sm">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                        user.role === "admin"
                          ? "bg-brand-50 text-brand-700 border border-brand-100 shadow-sm"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {user.services?.slice(0, 3).map((service: any) => (
                        <div key={service.slug} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                          <p>{service.title}</p>
                          <p className="text-[11px] uppercase tracking-widest text-slate-400">
                            {service.package === "verify" ? "Verified" : service.package === "trading" ? "Ads" : service.package === "features" ? "Ads Pro" : "Standard"}
                          </p>
                        </div>
                      ))}
                      {user.services?.length > 3 && (
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">+{user.services.length - 3} more</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm font-bold text-slate-500">No users found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
