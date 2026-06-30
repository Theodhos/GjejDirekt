import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import UserPaymentsTable from "@/components/dashboard/UserPaymentsTable";

export const dynamic = "force-dynamic";

export default async function DashboardPaymentsPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const payments = await Payment.find({ user: auth.id }).sort({ createdAt: -1 }).lean<any>();
  const serialized = payments.map((p: any) => ({
    _id: p._id.toString(),
    listingTitle: p.listingTitle || "",
    packageName: p.packageName || "",
    packet: p.packet || "",
    amount: p.amount ?? 0,
    currency: p.currency || "EUR",
    verificationStatus: p.verificationStatus || "none",
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null
  }));

  return (
    <section className="page-shell py-10">
      <UserPaymentsTable payments={serialized} />
    </section>
  );
}
