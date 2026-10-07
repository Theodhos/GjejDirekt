import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import { countBookingDays } from "@/lib/reservations";
import { formatPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const reservations = await Reservation.find()
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
          <p className="eyebrow text-sky-600 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4" /> Analytics
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Reservations</h1>
          <p className="text-sm text-slate-500 mt-1">Every booking sent to a business&apos;s WhatsApp, newest first (last 200).</p>
        </div>
      </div>

      <div className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Business</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Item</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Days</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.length > 0 ? (
                reservations.map((reservation: any) => (
                  <tr key={reservation._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      {reservation.listing?.slug ? (
                        <Link href={`/listings/${reservation.listing.slug}`} className="font-bold text-slate-950 text-sm hover:underline">
                          {reservation.listing.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{reservation.customerName}</p>
                      <p className="text-xs text-slate-400">{reservation.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">{reservation.itemName || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(reservation.date).toLocaleDateString()}
                      {reservation.time ? ` · ${reservation.time}` : ""}
                      {reservation.endDate ? ` → ${new Date(reservation.endDate).toLocaleDateString()}` : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {reservation.days ?? countBookingDays(reservation.date, reservation.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {typeof reservation.total === "number" ? formatPrice(reservation.total) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          reservation.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : reservation.status === "declined" || reservation.status === "cancelled"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(reservation.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-sm font-bold text-slate-500">No reservations yet.</p>
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
