import { redirect } from "next/navigation";
import { CalendarDays, Clock3, MessageSquareText, ShieldCheck, Star } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Review from "@/models/Review";
import Activity from "@/models/Activity";
import UserListingTable from "@/components/dashboard/UserListingTable";
import ProfilePanel from "@/components/dashboard/ProfilePanel";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const listings = auth.role === "admin"
    ? await Listing.find({}).sort({ createdAt: -1 }).populate("owner", "name email").lean<any>()
    : await Listing.find({ owner: auth.id }).sort({ createdAt: -1 }).lean<any>();
  const user = await User.findById(auth.id).populate("favorites").lean<any>();
  const reviews = await Review.find({ user: auth.id }).sort({ createdAt: -1 }).populate("listing", "title slug images location country category subcategory ratingAverage reviewCount").lean<any>();
  const activities = await Activity.find({ actor: auth.id }).sort({ createdAt: -1 }).limit(8).lean<any>();
  const favorites = Array.isArray(user?.favorites) ? user.favorites.filter(Boolean) : [];
  const approved = listings.filter((listing: any) => listing.status === "approved").length;
  const pending = listings.filter((listing: any) => listing.status === "pending").length;
  const rejected = listings.filter((listing: any) => listing.status === "rejected").length;
  const totalReviews = reviews.length;
  const totalFavorites = favorites.length;
  const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "";
  const profileUser = {
    name: user?.name || auth.name,
    email: user?.email || auth.email,
    role: auth.role,
    createdAt: user?.createdAt
  };

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="surface overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr] xl:items-start">
          <div className="max-w-3xl">
            <p className="eyebrow">Your area</p>
            <h1 className="display-font mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Personal dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Your listings, favorites, reviews, and platform activity in one place. Everything you do on the platform is surfaced here clearly.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/create-listing">Add Listing</Button>
              <Button href="/packet">Buy Package</Button>
              <Button href="/services" variant="ghost">
                Explore services
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Member since", value: joinedAt || "Now", icon: CalendarDays },
                { label: "Role", value: auth.role, icon: ShieldCheck },
                { label: "Listings", value: String(listings.length), icon: MessageSquareText }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <item.icon className="h-5 w-5 text-brand-600" />
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-1 break-words text-sm font-bold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <ProfilePanel user={profileUser} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Total listings</p>
          <p className="mt-2 text-3xl font-black">{listings.length}</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Pending approval</p>
          <p className="mt-2 text-3xl font-black">{pending}</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-2 text-3xl font-black">{approved}</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-2 text-3xl font-black">{rejected}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Listings</p>
              <h2 className="text-2xl font-black text-slate-950">Your services</h2>
            </div>
            <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              {listings.length} total
            </div>
          </div>
          <div className="mt-6">
            <UserListingTable listings={listings} isAdmin={auth.role === "admin"} />
          </div>
        </div>

        <div className="space-y-6">

          <div className="surface p-8 border-none shadow-[0_20px_50px_rgba(34,197,94,0.15)] overflow-hidden relative bg-white border border-slate-100 group hover:border-brand-500 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-500/10 transition" />
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Clock3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600">Active Session</p>
                <h2 className="text-2xl font-black text-slate-950">Last activity</h2>
              </div>
            </div>
            
            <div className="relative z-10 p-6 rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
              {activities.length ? (
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                    <p className="text-xl font-black leading-tight text-slate-950 mb-2">{activities[0].title}</p>
                    <p className="text-slate-500 text-base font-medium mb-6 leading-relaxed">{activities[0].description}</p>
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                            <p className="text-xs font-bold text-slate-950">
                                {new Date(activities[0].createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-brand-600">
                          {new Date(activities[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 font-medium italic text-center py-4">No recent activity detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
