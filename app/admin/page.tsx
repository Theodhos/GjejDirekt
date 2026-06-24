import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import BlogPost from "@/models/BlogPost";
import Report from "@/models/Report";
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
    recentBlogs,
    customCities,
    hiddenCities
  ] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ status: "pending" }),
    Report.countDocuments({ status: "pending" }),
    BlogPost.countDocuments(),
    BlogPost.find().sort({ createdAt: -1 }).limit(5).populate("author", "name").lean<any>(),
    City.find().lean<any[]>(),
    HiddenCity.find().lean<any[]>()
  ]);

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
      totalCities={totalCities}
      serializedBlogs={serializedBlogs}
      displayName={displayName}
      authEmail={auth.email}
    />
  );
}
