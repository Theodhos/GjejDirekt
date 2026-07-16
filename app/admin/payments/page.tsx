import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminPaymentsTable from "@/components/admin/AdminPaymentsTable";

export const dynamic = "force-dynamic";

function mapPackageLabel(packageKey: string | null | undefined) {
  if (!packageKey) return "Standard";
  const key = packageKey.toLowerCase();
  if (key === "verify") return "Verified";
  if (key === "trading") return "Ads";
  if (key === "features") return "Ads Pro";
  return "Standard";
}

export default async function AdminPaymentsPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const listings = await Listing.find({ status: { $in: ["approved", "pending", "rejected"] } })
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .lean<any>();

  const serializedPayments = listings
    .filter((listing) => listing.owner && typeof listing.owner !== "string")
    .map((listing) => {
      const owner = listing.owner;
      return {
        _id: listing._id.toString(),
        userName: owner.name || "—",
        userEmail: owner.email || "—",
        listingTitle: listing.title,
        listingSlug: listing.slug,
        listingPackage: listing.package || null,
        packageName: mapPackageLabel(listing.package),
        listingVerified: Boolean(listing.verified),
      };
    });

  return (
    <section className="page-shell py-10">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-950">Pagesat</h1>
          <p className="text-sm text-slate-500">Shiko kush ka paguar dhe aprovo manualisht paketat Verified, Ads dhe Ads Pro.</p>
        </div>
      </div>
      <AdminPaymentsTable initialPayments={serializedPayments} />
    </section>
  );
}
