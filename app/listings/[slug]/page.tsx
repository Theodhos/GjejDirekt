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
  Navigation,
  Euro,
  Tag,
  Clock
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import ListingActions from "@/components/ListingActions";
import Badge from "@/components/ui/Badge";
import ListingCard from "@/components/ListingCard";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import ReportListing from "@/components/ReportListing";

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

import ListingGallery from "@/components/listings/ListingGallery";
import ListingStickyBottom from "@/components/listings/ListingStickyBottom";

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

  const allImages = listing.images || [];
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  
  // Map Logic
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

  const phone = listing.contactInfo?.phone?.trim() || listing.contactPhone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello, I'm interested in ${listing.title} from Tourism Platform.`)}` : "";

  return (
    <main className="bg-slate-50 min-h-screen pb-32">
      
      {/* 1. Gallery Section (Acts as Hero) */}
      <section className="page-shell pt-10">
        <ListingGallery images={allImages} listing={listing} />
      </section>

      {/* 2. Main Content */}
      <section className="page-shell mt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          
          <div className="space-y-16">
            {/* Header Info */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-brand-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">{categoryLabel}</span>
                  <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">{subcategoryLabel}</span>
                  {listing.featured && (
                    <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
               </div>
               <h1 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tight mb-8 leading-[1.1]">{listing.title}</h1>
               <div className="flex flex-wrap items-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    {Number(listing.ratingAverage || 0).toFixed(1)} / 5.0 Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-400" />
                    {listing.views || 0} Views
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-950 mb-6">About this service</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* All Fields Presentation */}
            <div className="grid gap-6 sm:grid-cols-2">
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 mb-6">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Business Hours</h4>
                  <p className="text-slate-950 font-black">{listing.businessHours || "Open for inquiries"}</p>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 mb-6">
                    <Euro className="w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {listing.category === "akomodim" || listing.category === "restorante"
                      ? "Price (per person) / Çmimi (për person)"
                      : "Price / Çmimi"}
                  </h4>
                  <p className="text-slate-950 font-black">
                    {(() => {
                      const symbol = listing.currency === "ALL" || listing.currency === "LEK" ? "L" : (listing.currency || "€");
                      if (listing.priceFrom && listing.price) {
                        return `${symbol}${listing.priceFrom} - ${symbol}${listing.price}`;
                      }
                      if (listing.priceFrom) {
                        return `${symbol}${listing.priceFrom}`;
                      }
                      if (listing.price) {
                        return `${symbol}${listing.price}`;
                      }
                      return "Contact for price / Kontakto për çmimin";
                    })()}
                  </p>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 mb-6">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Google Maps</h4>
                  <p className="text-slate-950 font-black">
                    {listing.googleMapsLink ? (
                      <a href={listing.googleMapsLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-600 hover:underline">
                        Open in Maps <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      listing.address || listing.location
                    )}
                  </p>
               </div>
                <div className="hidden sm:block bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-600 mb-6">
                     <Phone className="w-5 h-5" />
                   </div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Contact Number</h4>
                   <p className="text-slate-950 font-black">{phone || "Not public"}</p>
                </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
            <div className="hidden lg:block bg-slate-950 text-white p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-brand-500/20 transition-colors duration-1000" />
               <h3 className="text-3xl font-bold text-white mb-10 relative z-10 leading-tight">Ready to book or inquire?</h3>
               <div className="space-y-4 relative z-10">
                  {phone ? (
                    <>
                      <a href={`tel:${phone}`} className="flex items-center justify-center gap-4 w-full h-16 bg-emerald-600 text-slate-950 rounded-[1.5rem] font-black text-sm hover:bg-brand-500 transition-all active:scale-95">
                        <Phone className="w-5 h-5" /> Call Directly
                      </a>
                      {whatsappHref && (
                        <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-4 w-full h-16 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
                          <MessageCircle className="w-5 h-5" /> WhatsApp
                        </a>
                      )}
                      <div className="grid grid-cols-3 gap-4">
                        {listing.socialLinks?.instagram && (
                          <a href={listing.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-center h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all" title="Instagram">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {listing.socialLinks?.facebook && (
                          <a href={listing.socialLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center justify-center h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all" title="Facebook">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {listing.googleMapsLink && (
                          <a href={listing.googleMapsLink} target="_blank" rel="noreferrer" className="flex items-center justify-center h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all" title="Google Maps">
                            <MapIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-center py-4 italic font-bold">Contact info private</p>
                  )}
               </div>
            </div>

            {canEdit && (
              <Link 
                href={`/listings/${listing.slug}/edit`}
                className="flex items-center justify-center gap-3 w-full h-14 bg-white text-slate-950 border border-slate-200 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-sm"
              >
                <PencilLine className="w-4 h-4" /> Edit Service
              </Link>
            )}

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                  <ShieldCheck className="w-4 h-4 text-brand-600" /> Verified
                </div>
                <div className="pt-6 border-t border-slate-50">
                   <ReportListing listingId={listing._id.toString()} />
                </div>
            </div>
          </aside>

        </div>
      </section>

      {/* Related */}
      {relatedListings.length > 0 && (
        <section className="page-shell mt-32">
           <div className="flex items-end justify-between mb-12">
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter">More from {categoryLabel}</h2>
              <Link href={`/services?category=${listing.category}`} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition">View All</Link>
           </div>
           <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedListings.map((rel: any) => (
                  <ListingCard key={rel._id.toString()} listing={rel} />
              ))}
           </div>
        </section>
      )}

      <ListingStickyBottom 
      phone={phone} 
      whatsappHref={whatsappHref} 
      priceFrom={listing.priceFrom} 
      currency={listing.currency} 
      categoryLabel={categoryLabel} 
    />
  </main>
  );
}
