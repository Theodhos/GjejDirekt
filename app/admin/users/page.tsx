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
  // Every registered account — "klient" ones included, even though they can never
  // own a listing — not just the ones a listing happens to point back to.
  const users = await User.find().select("name email role accountType createdAt").sort({ createdAt: -1 }).lean<any[]>();
  const listings = await Listing.find().select("owner title slug package status").lean<any[]>();

  const servicesByOwner = new Map<string, any[]>();
  listings.forEach((listing) => {
    if (!listing.owner) return;
    const ownerId = listing.owner.toString();
    const services = servicesByOwner.get(ownerId) || [];
    services.push({ title: listing.title, slug: listing.slug, package: listing.package, status: listing.status });
    servicesByOwner.set(ownerId, services);
  });

  const serializedUsers = users.map((user) => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    accountType: user.accountType || "biznes",
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
    services: servicesByOwner.get(user._id.toString()) || []
  }));

  return (
    <section className="page-shell py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-slate-950">Users</h1>
                <p className="text-sm text-slate-500 mt-1">Every registered account — business and client — with their listings, if any.</p>
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
