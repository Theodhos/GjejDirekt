"use client";

import HomeSearchHero from "@/components/home/HomeSearchHero";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionRail from "@/components/home/SectionRail";
import BusinessCard from "@/components/home/BusinessCard";
import { useLanguage } from "@/context/LanguageContext";

/** Card width for the rail — a little over two cards peek on a 360px phone. */
const CARD_WIDTH = "w-[164px] min-w-[164px] snap-start sm:w-[224px] sm:min-w-[224px]";

/**
 * The whole home page: search, the categories, and a row of recommended businesses.
 * Everything else — cities, blog, packages — is one tap away in the header or the
 * search, so it isn't repeated here.
 */
export default function HomePageClient({ recommended = [] }: { recommended?: any[] }) {
  const { language } = useLanguage();

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <HomeSearchHero />

      <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-6">
        <section className="gd-panel p-4 sm:p-5">
          <CategoryGrid />
        </section>

        {recommended.length > 0 && (
          <SectionRail
            title={language === "en" ? "Recommended businesses" : "Biznese të rekomanduara"}
            href="/listings"
            linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
          >
            {recommended.map((listing: any) => (
              <BusinessCard key={listing._id || listing.slug} listing={listing} className={CARD_WIDTH} />
            ))}
          </SectionRail>
        )}
      </div>
    </div>
  );
}
