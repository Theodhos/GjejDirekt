import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import BlogPost from "@/models/BlogPost";
import Report from "@/models/Report";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import Reservation from "@/models/Reservation";
import AdminClient from "@/components/dashboard/AdminClient";
import City from "@/models/City";
import HiddenCity from "@/models/HiddenCity";
import { seedCities } from "@/lib/cities-catalog";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();

  const [
    totalUsers,
    totalListings,
    pendingListings,
    totalReports,
    totalBlogs,
    totalPayments,
    totalOrders,
    totalReservations,
    recentBlogs,
    customCities,
    hiddenCities
  ] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ status: "pending" }),
    Report.countDocuments({ status: "pending" }),
    BlogPost.countDocuments(),
    Payment.countDocuments(),
    Order.countDocuments(),
    Reservation.countDocuments(),
    BlogPost.find().sort({ createdAt: -1 }).limit(5).populate("author", "name").lean<any>(),
    City.find().lean<any[]>(),
    HiddenCity.find().lean<any[]>()
  ]);

  // How many orders and reservations each business has received — one row per
  // business, counted straight from the records the WhatsApp sends leave behind.
  const [ordersByListing, reservationsByListing] = await Promise.all([
    Order.aggregate<{ _id: any; count: number; revenue: number; lastAt: Date }>([
      { $group: { _id: "$listing", count: { $sum: 1 }, revenue: { $sum: { $ifNull: ["$total", 0] } }, lastAt: { $max: "$createdAt" } } }
    ]),
    Reservation.aggregate<{ _id: any; count: number; revenue: number; lastAt: Date }>([
      { $group: { _id: "$listing", count: { $sum: 1 }, revenue: { $sum: { $ifNull: ["$total", 0] } }, lastAt: { $max: "$createdAt" } } }
    ])
  ]);
  const businessIds = Array.from(new Set([...ordersByListing, ...reservationsByListing].map((row) => String(row._id))));
  const businesses = businessIds.length
    ? await Listing.find({ _id: { $in: businessIds } }).select("title slug category location").lean<any[]>()
    : [];
  const businessById = new Map(businesses.map((item: any) => [String(item._id), item]));
  const ordersById = new Map(ordersByListing.map((row) => [String(row._id), row]));
  const reservationsById = new Map(reservationsByListing.map((row) => [String(row._id), row]));
  const businessStats = businessIds
    .map((id) => {
      const business = businessById.get(id);
      const orders = ordersById.get(id);
      const reservations = reservationsById.get(id);
      const lastAt = [orders?.lastAt, reservations?.lastAt].filter(Boolean).sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0];
      return {
        id,
        title: business?.title || "—",
        slug: business?.slug || "",
        location: business?.location || "",
        orders: orders?.count || 0,
        reservations: reservations?.count || 0,
        revenue: (orders?.revenue || 0) + (reservations?.revenue || 0),
        lastAt: lastAt ? new Date(lastAt).toISOString() : null
      };
    })
    .sort((a, b) => b.orders + b.reservations - (a.orders + a.reservations));

  const displayName = auth.name || auth.email;
  const serializedBlogs = recentBlogs.map((item: any) => ({ ...item, _id: item._id.toString() }));
  const hiddenSet = new Set(hiddenCities.map((city: any) => String(city.value).toLowerCase()));
  const customByValue = new Set(customCities.map((city: any) => String(city.value).toLowerCase()));
  const totalCities =
    seedCities.filter((city) => !hiddenSet.has(city.value.toLowerCase()) && !customByValue.has(city.value.toLowerCase())).length +
    customCities.filter((city: any) => !hiddenSet.has(String(city.value).toLowerCase())).length;

  return (
    <AdminClient
      totalUsers={totalUsers}
      totalListings={totalListings}
      pendingListings={pendingListings}
      totalReports={totalReports}
      totalBlogs={totalBlogs}
      totalPayments={totalPayments}
      totalOrders={totalOrders}
      totalReservations={totalReservations}
      totalCities={totalCities}
      businessStats={businessStats}
      serializedBlogs={serializedBlogs}
      displayName={displayName}
      authEmail={auth.email}
    />
  );
}
