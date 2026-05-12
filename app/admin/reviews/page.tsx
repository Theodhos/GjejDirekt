import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare, Trash2, User, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("listing", "title slug")
    .lean<any>();

  return (
    <section className="page-shell py-10">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-slate-950">Review Management</h1>
                <p className="text-sm text-slate-500 mt-1">Monitor what users are saying about services.</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.length ? (
          reviews.map((review: any) => (
            <div key={review._id.toString()} className="surface p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{review.user?.name || 'Anonymous'}</p>
                                    <p className="text-xs text-slate-500">{review.user?.email || 'No email'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-black">{review.rating}/5</span>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 italic text-slate-700 mb-4">
                            <MessageSquare className="w-5 h-5 text-slate-300 mb-3" />
                            &quot;{review.comment}&quot;
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regarding:</span>
                                <Link href={`/listings/${review.listing?.slug}`} className="text-xs font-black text-slate-950 hover:text-brand-600 flex items-center gap-1.5 underline underline-offset-4 decoration-slate-200">
                                    {review.listing?.title || 'Unknown Listing'}
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                            <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex md:flex-col justify-end gap-3 pt-4 md:pt-0 md:border-l md:border-slate-100 md:pl-6">
                        <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition">
                            Hide
                        </button>
                        <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
          ))
        ) : (
          <div className="surface p-20 flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mb-6" />
            <h3 className="text-xl font-black text-slate-950">No reviews recorded</h3>
            <p className="text-slate-500 mt-2">Feedback will appear here once users start rating services.</p>
          </div>
        )}
      </div>
    </section>
  );
}
