import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { redirect } from "next/navigation";
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
    .lean<any[]>();

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
      <AdminPaymentsTable initialPayments={serializedPayments} />
    </section>
  );
}
