import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import AdminUserTable from "@/components/admin/AdminUserTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const listings = await Listing.find().populate("owner", "name email role createdAt").lean<any>();

  const usersMap = new Map<string, any>();
  listings.forEach((listing) => {
    const owner = listing.owner;
    if (!owner || typeof owner === "string") return;
    const ownerId = owner._id.toString();
    if (!usersMap.has(ownerId)) {
      usersMap.set(ownerId, {
        _id: ownerId,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        createdAt: owner.createdAt ? new Date(owner.createdAt).toISOString() : null,
        services: []
      });
    }
    usersMap.get(ownerId).services.push({
      title: listing.title,
      slug: listing.slug,
      package: listing.package,
      status: listing.status
    });
  });

  const serializedUsers = Array.from(usersMap.values()).sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section className="page-shell py-10">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-slate-950">Users with Services</h1>
                <p className="text-sm text-slate-500 mt-1">All users that have listings on the platform and their services are shown below.</p>
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
