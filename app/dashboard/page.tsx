import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Activity from "@/models/Activity";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import Reservation from "@/models/Reservation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

const LISTING_PREVIEW_FIELDS = "title slug images photos bannerImage location category";

export default async function DashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const activities = await Activity.find({ actor: auth.id }).sort({ createdAt: -1 }).limit(8).lean<any>();

  // A "klient" account never owns a listing, so its panel shows favorites and its own
  // order/reservation history instead of the business-owner stats (listings, payments).
  const isClient = auth.accountType === "klient" && auth.role !== "admin";
  if (isClient) {
    const [user, orders, reservations] = await Promise.all([
      User.findById(auth.id)
        .populate("favorites", `${LISTING_PREVIEW_FIELDS} ratingAverage reviewCount verified`)
        .lean<any>(),
      Order.find({ user: auth.id }).populate("listing", LISTING_PREVIEW_FIELDS).sort({ createdAt: -1 }).limit(30).lean<any>(),
      Reservation.find({ user: auth.id }).populate("listing", LISTING_PREVIEW_FIELDS).sort({ createdAt: -1 }).limit(30).lean<any>()
    ]);

    const profileUser = {
      name: user?.name || auth.name,
      email: user?.email || auth.email,
      role: auth.role,
      createdAt: user?.createdAt ? new Date(user.createdAt).toISOString() : undefined
    };

    return (
      <DashboardClient
        isClient
        listings={[]}
        activities={JSON.parse(JSON.stringify(activities))}
        profileUser={profileUser}
        isAdmin={false}
        paymentsCount={0}
        favorites={JSON.parse(JSON.stringify(user?.favorites || []))}
        orders={JSON.parse(JSON.stringify(orders))}
        reservations={JSON.parse(JSON.stringify(reservations))}
      />
    );
  }

  const listings = auth.role === "admin"
    ? await Listing.find({}).sort({ createdAt: -1 }).populate("owner", "name email").lean<any>()
    : await Listing.find({ owner: auth.id }).sort({ createdAt: -1 }).lean<any>();
  const user = await User.findById(auth.id).lean<any>();
  const paymentsCount = auth.role === "admin"
    ? await Payment.countDocuments({})
    : await Payment.countDocuments({ user: auth.id });

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
      paymentsCount={paymentsCount}
    />
  );
}
