import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, LayoutDashboard, PlusCircle, ShieldCheck, Users, AlertTriangle } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import BlogPost from "@/models/BlogPost";
import Activity from "@/models/Activity";
import Report from "@/models/Report";
import BlogStudio from "@/components/dashboard/BlogStudio";
import AdminCityManager from "@/components/dashboard/AdminCityManager";
import AdminClient from "@/components/dashboard/AdminClient";

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
    recentBlogs
  ] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ status: "pending" }),
    Report.countDocuments({ status: "pending" }),
    BlogPost.countDocuments(),
    BlogPost.find().sort({ createdAt: -1 }).limit(5).populate("author", "name").lean<any>()
  ]);

  const displayName = auth.name || auth.email;
  const serializedBlogs = recentBlogs.map((item: any) => ({ ...item, _id: item._id.toString() }));

  return (
    <AdminClient
      totalUsers={totalUsers}
      totalListings={totalListings}
      pendingListings={pendingListings}
      totalReports={totalReports}
      totalBlogs={totalBlogs}
      serializedBlogs={serializedBlogs}
      displayName={displayName}
      authEmail={auth.email}
    />
  );
}
