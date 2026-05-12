import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarDays,
  Clock3,
  Globe,
  MessageCircle,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Eye,
  ArrowRight,
  Instagram,
  Facebook,
  Share2,
  ChevronRight,
  Map as MapIcon,
  Navigation
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import ListingActions from "@/components/ListingActions";
import Badge from "@/components/ui/Badge";
import ListingCard from "@/components/ListingCard";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug, status: "approved" }).lean<any>();
  if (!listing) return {};

  return {
    title: `${listing.title} | Tourism Platform`,
    description: listing.description.slice(0, 160)
  };
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug }).populate("owner", "name email role").lean<any>();
  if (!listing) notFound();

  const viewer = await getAuthUser();
  const canEdit = Boolean(viewer && (viewer.role === "admin" || viewer.id === listing.owner?._id?.toString()));
  const isPublic = listing.status === "approved";

  if (!isPublic && !canEdit) notFound();

  await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });

  // Fetch Related Listings
  const relatedListings = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
    status: "approved"
  }).limit(4).lean<any>();

  const heroImage = listing.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  const gallery = (listing.images || []).slice(1, 10);
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  
  // Enhanced Map Logic
  const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;
  const mapAddress = [listing.address, listing.location, listing.country].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(
    listing.coordinates?.lat && listing.coordinates?.lng
      ? `${listing.coordinates.lat},${listing.coordinates.lng}`
      : mapAddress || listing.title
  );
  
  const mapSrc = googleMapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${mapQuery}`
    : `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const phone = listing.contactInfo?.phone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}` : "";

  return (
    <main className="bg-white min-h-screen pb-32">
      
      {/* 1. Cinematic Wide Cover */}
      <section className="relative h-[70vh] w-full overflow-hidden group">
        <Image src={heroImage} alt={listing.title} fill className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-20">
            <div className="page-shell">
                <div className="max-w-5xl">
                    <div className="flex items-center gap-4 mb-8">
                        <Badge tone="success" className="bg-brand-500 text-slate-950 font-black px-6 py-2 rounded-full border-none shadow-xl">
                            {categoryLabel}
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600 font-black text-xs uppercase tracking-[0.4em] drop-shadow-sm">
                            {subcategoryLabel}
                        </span>
                    </div>
                    <h1 className="text-7xl sm:text-[10rem] font-black text-slate-950 tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl">
                        {listing.title}
                    </h1>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-slate-950 font-black text-sm">
                            <MapPin className="w-5 h-5 text-brand-600" /> {listing.location}
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-slate-950 font-black text-sm">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> {Number(listing.ratingAverage || 0).toFixed(1)} Rating
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Photo Space - Elegant Grid */}
      <section className="page-shell mt-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {gallery.map((img: string, i: number) => (
                <div key={i} className={`relative overflow-hidden rounded-[3rem] shadow-2xl group transition-all duration-500 hover:z-10 hover:scale-105 ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-square'}`}>
                    <Image src={img} alt={`${listing.title} ${i}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition duration-500" />
                </div>
            ))}
        </div>
      </section>

      {/* 3. Deep Dive - Description & Map */}
      <section className="page-shell mt-32">
        <div className="grid gap-24 lg:grid-cols-[1fr_450px]">
            
            <div>
                <div className="max-w-4xl">
                    <p className="text-3xl sm:text-4xl text-slate-900 leading-[1.3] font-black tracking-tight mb-16 whitespace-pre-line border-l-[12px] border-brand-500 pl-12 py-4">
                        {listing.description}
                    </p>
                </div>

                {listing.highlights?.length ? (
                    <div className="mt-24 grid gap-8 sm:grid-cols-2">
                        {listing.highlights.map((h: string) => (
                            <div key={h} className="flex items-start gap-6 p-8 rounded-[3rem] bg-slate-50 border border-slate-100 group hover:border-brand-500 transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:bg-brand-500 group-hover:text-white transition-colors duration-500">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-950 mb-1">{h}</p>
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Premium Perk</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* 4. MAPS - Functional & Integrated */}
                <div className="mt-32">
                    <div className="flex items-center justify-between gap-6 mb-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-600 mb-4">Location & Access</p>
                            <h3 className="text-4xl font-black text-slate-950 tracking-tighter">Plan your visit</h3>
                        </div>
                        <a 
                            href={externalMapUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-xl"
                        >
                            <Navigation className="w-4 h-4" /> Open in Google Maps
                        </a>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-slate-100 rounded-[5rem] blur-2xl group-hover:bg-brand-500/10 transition-colors duration-1000" />
                        <iframe
                            title="Location map"
                            className="relative h-[600px] w-full rounded-[4.5rem] border-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] z-10"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={mapSrc}
                        />
                    </div>
                </div>
            </div>

            {/* Right: Booking & Connected Networks */}
            <aside className="space-y-10 lg:sticky lg:top-32 h-fit">
                
                {/* 5. Booking Card */}
                <div className="surface p-12 bg-slate-950 text-white border-none shadow-[0_60px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full -mr-24 -mt-24 blur-[80px] group-hover:bg-brand-500/20 transition-colors duration-1000" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-500 mb-8 relative z-10">Direct Reservation</p>
                    <h2 className="text-4xl font-black mb-12 leading-tight relative z-10 tracking-tighter">Experience {listing.title} first-hand.</h2>
                    
                    <div className="space-y-4 relative z-10">
                        {phone ? (
                            <>
                                <a 
                                    href={`tel:${phone}`}
                                    className="flex items-center justify-center gap-4 w-full py-7 bg-white text-slate-950 rounded-[2rem] font-black text-sm hover:bg-brand-500 transition-all shadow-2xl active:scale-95"
                                >
                                    <Phone className="w-5 h-5" /> {phone}
                                </a>
                                {whatsappHref && (
                                    <a 
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-4 w-full py-7 bg-emerald-600 text-white rounded-[2rem] font-black text-sm hover:bg-emerald-500 transition-all shadow-2xl active:scale-95"
                                    >
                                        <MessageCircle className="w-5 h-5" /> Instant WhatsApp
                                    </a>
                                )}
                            </>
                        ) : (
                            <p className="text-slate-500 font-bold italic text-center py-6">Inquiry only. No direct phone listed.</p>
                        )}
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between relative z-10">
                        {canEdit && (
                            <Link href={`/listings/${listing.slug}/edit`} className="text-xs font-black uppercase tracking-widest text-brand-500 hover:text-white transition">
                                Edit Service
                            </Link>
                        )}
                        <ListingActions listingId={listing._id.toString()} />
                    </div>
                </div>

                {/* 6. CONNECTED NETWORKS - BRAND LOGOS */}
                <div className="surface p-12 border-none shadow-2xl bg-white group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-950">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Connected Networks</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {listing.socialLinks?.instagram && (
                            <a 
                                href={listing.socialLinks.instagram} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-50 to-pink-50 border border-slate-100 hover:border-pink-500 transition-all duration-500 shadow-sm hover:shadow-xl group/social"
                            >
                                <Instagram className="w-10 h-10 text-pink-600 transition-transform group-hover/social:scale-110" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Instagram</span>
                            </a>
                        )}
                        {listing.socialLinks?.facebook && (
                            <a 
                                href={listing.socialLinks.facebook} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-100 hover:border-blue-600 transition-all duration-500 shadow-sm hover:shadow-xl group/social"
                            >
                                <Facebook className="w-10 h-10 text-blue-600 transition-transform group-hover/social:scale-110" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Facebook</span>
                            </a>
                        )}
                        {!listing.socialLinks?.instagram && !listing.socialLinks?.facebook && (
                            <div className="col-span-2 text-center py-6 text-slate-400 text-sm font-medium italic">
                                No social networks connected.
                            </div>
                        )}
                    </div>

                    <button className="mt-8 w-full py-5 rounded-full border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-950 hover:text-white transition-all">
                        <Share2 className="w-4 h-4 inline-block mr-2" /> Share Story
                    </button>
                </div>

            </aside>
        </div>
      </section>

      {/* 7. DISCOVERY RAIL */}
      {relatedListings.length > 0 && (
          <section className="mt-48 bg-slate-50 py-40 overflow-hidden">
              <div className="page-shell">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.6em] text-brand-600 mb-6">Discovery Journal</p>
                        <h2 className="text-6xl sm:text-8xl font-black text-slate-950 tracking-tighter leading-none">More to explore</h2>
                    </div>
                    <Link href={`/services?category=${listing.category}`} className="inline-flex items-center gap-5 px-14 py-7 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-500 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105">
                        Discover All <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedListings.map((rel: any) => (
                        <ListingCard key={rel._id.toString()} listing={rel} />
                    ))}
                </div>
              </div>
          </section>
      )}

    </main>
  );
}
