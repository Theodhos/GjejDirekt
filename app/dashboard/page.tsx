import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Activity from "@/models/Activity";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const listings = auth.role === "admin"
    ? await Listing.find({}).sort({ createdAt: -1 }).populate("owner", "name email").lean<any>()
    : await Listing.find({ owner: auth.id }).sort({ createdAt: -1 }).lean<any>();
  const user = await User.findById(auth.id).lean<any>();
  const activities = await Activity.find({ actor: auth.id }).sort({ createdAt: -1 }).limit(8).lean<any>();

  const profileUser = {
    name: user?.name || auth.name,
    email: user?.email || auth.email,
    role: auth.role,
    createdAt: user?.createdAt ? new Date(user.createdAt).toISOString() : undefined
  };

  return (
    <DashboardClient
      listings={JSON.parse(JSON.stringify(listings))}
      activities={JSON.parse(JSON.stringify(activities))}
      profileUser={profileUser}
      isAdmin={auth.role === "admin"}
    />
  );
}
