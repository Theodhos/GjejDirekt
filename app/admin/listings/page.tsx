import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Filter, MapPin, CheckCircle, Clock, XCircle, Sparkles } from "lucide-react";
import { categories } from "@/lib/constants";
import AdminListingActions from "@/components/admin/AdminListingActions";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const featuredFilter = searchParams.featured === 'true';

  const query: Record<string, any> = {};
  if (statusFilter) query.status = statusFilter;
  if (categoryFilter) query.category = categoryFilter;
  if (featuredFilter) query.featured = true;

  const listings = await Listing.find(query).sort({ createdAt: -1 }).populate("owner", "name").lean<any>();

  const statusOptions = ["pending", "approved", "rejected"];

  return (
    <section className="page-shell py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-slate-950">Marketplace Listings</h1>
                <p className="text-sm text-slate-500 mt-1">Monitor, approve, or edit all services.</p>
            </div>
        </div>
        <div className="flex flex-wrap gap-2">
            <Link href="/listings/add" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-brand-600 transition shadow-lg">
                <Sparkles className="w-4 h-4" />
                New Listing
            </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface p-2 flex items-center gap-2">
            <div className="flex-1 px-4 py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                <div className="flex flex-wrap gap-1 mt-2">
                    <Link href="/admin/listings" className={`px-3 py-1 rounded-full text-[10px] font-bold ${!statusFilter ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ALL</Link>
                    {statusOptions.map(s => (
                        <Link key={s} href={`/admin/listings?status=${s}${categoryFilter ? `&category=${categoryFilter}` : ''}`} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusFilter === s ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</Link>
                    ))}
                </div>
            </div>
        </div>
        <div className="surface p-2 flex items-center gap-2 lg:col-span-2 overflow-hidden">
             <div className="flex-1 px-4 py-2 overflow-x-auto no-scrollbar">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p>
                <div className="flex gap-2 mt-2 whitespace-nowrap">
                    <Link href="/admin/listings" className={`px-3 py-1 rounded-full text-[10px] font-bold ${!categoryFilter ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ALL</Link>
                    {categories.map(c => (
                        <Link key={c.value} href={`/admin/listings?category=${c.value}${statusFilter ? `&status=${statusFilter}` : ''}`} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${categoryFilter === c.value ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.label}</Link>
                    ))}
                </div>
            </div>
        </div>
        <div className="surface p-2 flex items-center justify-center">
             <Link href={`/admin/listings?featured=true${statusFilter ? `&status=${statusFilter}` : ''}`} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${featuredFilter ? 'bg-fuchsia-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <Sparkles className="w-4 h-4" />
                Featured Only
            </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {listings.length ? (
          listings.map((listing: any) => (
            <div key={listing._id.toString()} className="surface p-4 sm:p-6 hover:shadow-xl transition-all border-none flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image src={listing.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"} alt={listing.title} fill className="object-cover" />
                    {listing.featured && (
                        <div className="absolute top-2 left-2 bg-fuchsia-600 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-2.5 h-2.5" />
                            Featured
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">{listing.category}</span>
                                <span className="text-[10px] font-black text-slate-300">•</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{listing.subcategory}</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-950 truncate">{listing.title}</h3>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                                    {listing.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(listing.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                                listing.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                                listing.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                'bg-rose-50 text-rose-700'
                            }`}>
                                {listing.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                                 listing.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                 <XCircle className="w-3 h-3" />}
                                {listing.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="text-xs text-slate-400 font-medium">
                            By <span className="text-slate-900 font-bold">{listing.owner?.name || 'Unknown'}</span>
                        </div>
                        <AdminListingActions 
                          id={listing._id.toString()} 
                          slug={listing.slug} 
                          title={listing.title} 
                        />
                    </div>
                </div>
            </div>
          ))
        ) : (
          <div className="surface p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-950">No listings found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters to see more results.</p>
            <Link href="/admin/listings" className="mt-8 text-sm font-black text-brand-600 hover:underline">Clear all filters</Link>
          </div>
        )}
      </div>
    </section>
  );
}
