import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { categories } from "@/lib/constants";
import ListingCard from "@/components/ListingCard";
import HorizontalRail from "@/components/home/HorizontalRail";
import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";

async function getListingsByCity(city: string) {
  await connectDB();
  // Using regex for flexible matching like in the API
  return Listing.find({ 
    location: { $regex: city, $options: "i" },
    status: "approved" 
  }).sort({ createdAt: -1 }).lean<any[]>();
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityName = decodeURIComponent(params.city);
  const listings = await getListingsByCity(cityName);

  // Group listings by subcategory within each category
  const categorySections = categories.map(cat => {
    const subSections = cat.subcategories.map(sub => {
      const subListings = listings.filter(l => 
        l.category === cat.value && l.subcategory === sub.value
      );
      return {
        subcategory: sub,
        listings: subListings
      };
    });
    
    // Only return category if it has at least one subcategory with listings
    // (Or show all as requested? "nenkategorite me tituj vendosi te gjitha")
    return {
      category: cat,
      subSections
    };
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* City Hero */}
      <section className="relative h-[65vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1580997150503-490333240212?auto=format&fit=crop&w=2000&q=80"
                alt={cityName}
                fill
                className="object-cover opacity-30 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-50" />
        </div>

        <div className="page-shell relative z-10 text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-brand-500/10 border border-brand-500/20 backdrop-blur-md px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 mb-8 animate-fade-in">
                <MapPin className="w-4 h-4" />
                {cityName} Albania
            </div>
            <h1 className="text-7xl sm:text-9xl font-black text-white tracking-tighter mb-6 capitalize animate-slide-up">
                {cityName}
            </h1>
            <p className="text-xl sm:text-2xl text-white/70 font-medium max-w-2xl mx-auto animate-slide-up delay-100">
                Eksploroni akomodimet, shijet lokale dhe aventurat më të mira në {cityName}.
            </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="page-shell py-20 space-y-32">
        {categorySections.map(({ category, subSections }) => {
          // Check if category has any listings at all to avoid empty category headers if desired
          // User wants all subcategories, so I'll show the category if it has at least one sub with listings 
          // or if user wants EVERYTHING. "nenkategorite me tituj vendosi te gjitha"
          
          return (
            <div key={category.value} className="space-y-16">
              <div className="border-b border-slate-200 pb-8">
                <h2 className="display-font text-4xl sm:text-6xl font-black text-slate-950">{category.label}</h2>
                <p className="mt-4 text-lg text-slate-500 font-medium">Zbuloni të gjitha mundësitë e {category.label.toLowerCase()} në {cityName}.</p>
              </div>

              <div className="space-y-12">
                {subSections.map(({ subcategory, listings }) => (
                  <HorizontalRail 
                    key={subcategory.value}
                    eyebrow={category.label}
                    title={subcategory.label}
                  >
                    {listings.length > 0 ? (
                      listings.map((listing: any) => (
                        <div key={listing._id.toString()} className="w-[380px] shrink-0 snap-start">
                          <ListingCard listing={listing} />
                        </div>
                      ))
                    ) : (
                      <div className="w-full flex items-center justify-center py-12 bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nuk ka shërbime të disponueshme për momentin</p>
                      </div>
                    )}
                  </HorizontalRail>
                ))}
              </div>
            </div>
          );
        })}

        {listings.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-slate-100 text-slate-400 mb-6">
                <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-950 mb-4">Asnjë shërbim nuk u gjet</h2>
            <p className="text-slate-500 max-w-md mx-auto">
                Nuk mundëm të gjenim asnjë shërbim për &quot;{cityName}&quot; për momentin. Provoni një qytet tjetër!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
