import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, CheckCircle2, Clock3, Flame, LayoutDashboard, PlusCircle, ShieldCheck, Users, AlertTriangle } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Review from "@/models/Review";
import BlogPost from "@/models/BlogPost";
import Activity from "@/models/Activity";
import Report from "@/models/Report";
import AdminQueue from "@/components/dashboard/AdminQueue";
import BlogStudio from "@/components/dashboard/BlogStudio";
import AdminReports from "@/components/dashboard/AdminReports";
import AdminCityManager from "@/components/dashboard/AdminCityManager";

export const dynamic = "force-dynamic";

function formatDate(value?: string | Date) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const activityStyles: Record<string, { label: string; tone: string }> = {
  user_registered: { label: "User joined", tone: "bg-blue-50 text-blue-700" },
  user_logged_in: { label: "Login", tone: "bg-slate-100 text-slate-700" },
  listing_submitted: { label: "Submission", tone: "bg-amber-50 text-amber-700" },
  listing_approved: { label: "Approved", tone: "bg-emerald-50 text-emerald-700" },
  listing_rejected: { label: "Rejected", tone: "bg-rose-50 text-rose-700" },
  review_created: { label: "Review", tone: "bg-brand-50 text-brand-700" },
  blog_created: { label: "Blog", tone: "bg-violet-50 text-violet-700" },
  profile_updated: { label: "Profile", tone: "bg-cyan-50 text-cyan-700" }
};

export default async function AdminPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();

  const [
    totalUsers,
    totalListings,
    pendingListings,
    approvedListings,
    totalReports,
    totalReviews,
    totalBlogs,
    featuredListings,
    recentBlogs,
    recentQueue,
    recentReports,
    recentActivities,
    favoriteStats
  ] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ status: "pending" }),
    Listing.countDocuments({ status: "approved" }),
    Report.countDocuments({ status: "pending" }),
    Review.countDocuments(),
    BlogPost.countDocuments(),
    Listing.countDocuments({ status: "approved", featured: true }),
    BlogPost.find().sort({ createdAt: -1 }).limit(5).populate("author", "name").lean<any>(),
    Listing.find({ status: "pending" }).sort({ createdAt: -1 }).limit(8).lean<any>(),
    Report.find({ status: "pending" }).sort({ createdAt: -1 }).populate("reporter", "name email").populate("listing", "title slug").limit(10).lean<any>(),
    Activity.find().sort({ createdAt: -1 }).limit(10).lean<any>(),
    User.aggregate([
      {
        $project: {
          count: { $size: { $ifNull: ["$favorites", []] } }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }
        }
      }
    ])
  ]);

  const totalFavorites = favoriteStats[0]?.total || 0;
  const approvalRate = totalListings ? Math.round((approvedListings / totalListings) * 100) : 0;
  const displayName = auth.name || auth.email;
  const serializedQueue = recentQueue.map((item: any) => ({ ...item, _id: item._id.toString() }));
  const serializedBlogs = recentBlogs.map((item: any) => ({ ...item, _id: item._id.toString() }));

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="surface-strong overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-100">Administrator console</p>
            <h1 className="display-font mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Control the tourism marketplace from one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-50 sm:text-base">
              Monitor activity, review pending services, approve or reject listings, and keep every public result high quality.
            </p>
          </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/listings/add"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              Add listing
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              View services
            </Link>
            <Link
              href="#blog-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              Blog studio
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
          <span className="rounded-full bg-white/10 px-3 py-2">Logged in as {displayName}</span>
          <span className="rounded-full bg-white/10 px-3 py-2">{auth.email}</span>
        </div>
      </div>

      <div id="statistics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Users, label: "Users", value: totalUsers, accent: "bg-blue-50 text-blue-700", href: "/admin/users" },
          { icon: ShieldCheck, label: "Listings", value: totalListings, accent: "bg-brand-50 text-brand-700", href: "/admin/listings" },
          { icon: Clock3, label: "Pending", value: pendingListings, accent: "bg-amber-50 text-amber-700", href: "/admin/listings?status=pending" },
          { icon: CheckCircle2, label: "Approved", value: approvedListings, accent: "bg-emerald-50 text-emerald-700", href: "/admin/listings?status=approved" },
          { icon: AlertTriangle, label: "Reports", value: totalReports, accent: "bg-red-50 text-red-700", href: "#reports-section" },
          { icon: BarChart3, label: "Reviews", value: totalReviews, accent: "bg-slate-100 text-slate-700", href: "/admin/reviews" },
          { icon: LayoutDashboard, label: "Blogs", value: totalBlogs, accent: "bg-violet-50 text-violet-700", href: "/admin/blogs" },
          { icon: Users, label: "Favorites", value: totalFavorites, accent: "bg-cyan-50 text-cyan-700", href: "#" }
        ].map((item) => (
          <Link key={item.label} href={item.href} className="surface p-6 hover:border-brand-500 transition-all hover:shadow-xl group">
            <item.icon className={`h-10 w-10 rounded-2xl p-2.5 ${item.accent} transition-transform group-hover:scale-110`} />
            <p className="mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{item.value.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Manage {item.label.toLowerCase()} 
                <PlusCircle className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12" id="reports-section">
        <div className="surface p-8 sm:p-10 shadow-2xl border-none bg-red-50/20 border-red-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-10 border-b border-red-100/50">
            <div>
              <p className="eyebrow text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Community reports
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Reported posts</h2>
              <p className="mt-2 text-slate-500">There are {totalReports} reports waiting for review.</p>
            </div>
          </div>
          <div className="mt-6">
            <AdminReports reports={recentReports.map((r: any) => ({ ...r, _id: r._id.toString() }))} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="surface p-8 sm:p-10 shadow-2xl border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-10 border-b border-slate-100">
            <div>
              <p className="eyebrow text-brand-600">Pending moderation</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Review queue</h2>
              <p className="mt-2 text-slate-500">There are {pendingListings} listings waiting for your approval.</p>
            </div>
            <div className="inline-flex flex-col items-center justify-center rounded-3xl bg-brand-50 border border-brand-100 px-8 py-4">
              <span className="text-2xl font-black text-brand-900 leading-none">{approvalRate}%</span>
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mt-1">Approval rate</span>
            </div>
          </div>
          <div className="mt-6">
            <AdminQueue listings={serializedQueue} />
          </div>
        </div>
      </div>

      <div className="mt-12" id="blog-studio">
        <BlogStudio recentPosts={serializedBlogs as any[]} />
      </div>

      <div className="mt-8" id="city-admin">
        <AdminCityManager />
      </div>

    </section>
  );
}
