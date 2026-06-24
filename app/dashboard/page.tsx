import { redirect } from "next/navigation";
import { CalendarDays, MessageSquareText, ShieldCheck, Clock3 } from "lucide-react";
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
  const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "";
  const profileUser = {
    name: user?.name || auth.name,
    email: user?.email || auth.email,
    role: auth.role,
    createdAt: user?.createdAt
  };

  const stats = [
    { label: "Total Listings", value: String(listings.length), accent: false },
    { label: "Pending Approval", value: String(pending), accent: false },
    { label: "Approved", value: String(approved), accent: true },
    { label: "Rejected", value: String(rejected), accent: false }
  ];

  return (
    <main style={{ background: "var(--surface-page)" }}>
      {/* Page Header (Hero) */}
      <div style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px] lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">Your area</p>
              <h1
                className="font-bold tracking-tight mb-4"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
              >
                Personal Dashboard
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                Your listings, favorites, reviews, and platform activity all in one place. Everything you do on the platform is cleanly surfaced here.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/create-listing">Add Listing</Button>
                <Button href="/packet" variant="ghost" className="hidden sm:inline-flex">Buy Package</Button>
                <Button href="/services" variant="ghost">Explore services</Button>
              </div>
            </div>

            <div className="w-full">
              <ProfilePanel user={profileUser} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell py-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 transition-all"
                style={{
                  background: stat.accent ? "var(--brand-light)" : "var(--surface-white)",
                  border: `1px solid ${stat.accent ? "var(--brand-border)" : "var(--border-soft)"}`,
                  boxShadow: "var(--shadow-card)"
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
                  style={{ color: stat.accent ? "var(--brand-accent)" : "var(--text-tertiary)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: stat.accent ? "var(--brand-accent)" : "var(--text-primary)" }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="page-shell py-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Listings Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface-white)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div
              className="flex items-center justify-between gap-4 px-6 py-5"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <div>
                <p className="eyebrow mb-1">Listings</p>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Your Services
                </h2>
              </div>
              <span
                className="rounded-full px-3.5 py-1 text-xs font-semibold"
                style={{
                  background: "var(--brand-light)",
                  color: "var(--brand-accent)",
                  border: "1px solid var(--brand-border)"
                }}
              >
                {listings.length} total
              </span>
            </div>
            <div className="p-6">
              <UserListingTable listings={listings} isAdmin={auth.role === "admin"} />
            </div>
          </div>

          {/* Activity Panel */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface-white)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div
              className="flex items-center gap-4 px-6 py-5"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
              >
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <p className="eyebrow mb-1">Active Session</p>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Last Activity
                </h2>
              </div>
            </div>

            <div className="p-6">
              {activities.length ? (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {activities[0].title}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {activities[0].description}
                  </p>
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid var(--border-soft)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "var(--brand-accent)" }}
                      />
                      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        {new Date(activities[0].createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--brand-accent)" }}
                    >
                      {new Date(activities[0].createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <Clock3 className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                    No recent activity detected.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
