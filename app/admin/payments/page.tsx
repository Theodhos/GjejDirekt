import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import { redirect } from "next/navigation";
import AdminPaymentsTable from "@/components/admin/AdminPaymentsTable";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const payments = await Payment.find().sort({ createdAt: -1 }).lean<any>();
  const serializedPayments = payments.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    user: p.user ? p.user.toString() : null,
    listing: p.listing ? p.listing.toString() : null,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null
  }));

  return (
    <section className="page-shell py-10">
      <AdminPaymentsTable initialPayments={serializedPayments} />
    </section>
  );
}
