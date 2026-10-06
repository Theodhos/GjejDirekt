import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const orders = await Order.find()
    .populate("listing", "title slug")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(200)
    .lean<any[]>();

  return (
    <section className="page-shell py-10">
      <div className="mb-6 flex items-center gap-4 sm:mb-10">
        <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <p className="eyebrow text-orange-600 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Analytics
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Every order sent to a business&apos;s WhatsApp, newest first (last 200).</p>
        </div>
      </div>

      <div className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Business</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      {order.listing?.slug ? (
                        <Link href={`/listings/${order.listing.slug}`} className="font-bold text-slate-950 text-sm hover:underline">
                          {order.listing.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{order.customerName}</p>
                      {(order.customerPhone || order.user?.email) && (
                        <p className="text-xs text-slate-400">{order.customerPhone || order.user?.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                      {(order.items || []).map((item: any) => `${item.qty}x ${item.name}`).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {typeof order.total === "number" ? `${order.total.toLocaleString()} L` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm font-bold text-slate-500">No orders yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
