"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import HomeSearchHero from "@/components/home/HomeSearchHero";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionRail from "@/components/home/SectionRail";
import BusinessCard from "@/components/home/BusinessCard";
import { useLanguage } from "@/context/LanguageContext";

/** Card width for the rail — a little over two cards peek on a 360px phone. */
const CARD_WIDTH = "w-[164px] min-w-[164px] snap-start sm:w-[224px] sm:min-w-[224px]";

type CategorySection = {
  value: string;
  label: string;
  listings: any[];
};

/**
 * The whole home page: search, the categories, a row of recommended businesses,
 * then one rail per category that has businesses. Everything else — cities, blog,
 * packages — is one tap away in the header or the search, so it isn't repeated here.
 */
export default function HomePageClient({
  recommended = [],
  sections = []
}: {
  recommended?: any[];
  sections?: CategorySection[];
}) {
  const { language } = useLanguage();
  const router = useRouter();

  // A "klient" account was bounced back here from /create-listing or /listings/add —
  // tell them why instead of silently landing on the homepage. Read directly off
  // `window.location` (not useSearchParams) so this page keeps its static/ISR rendering.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("notice") !== "business-only") return;
    toast.error(
      language === "en"
        ? "Customer accounts can't add a business — order or book instead."
        : "Llogaritë klient nuk mund të shtojnë biznes — porosit ose rezervo direkt."
    );
    router.replace("/", { scroll: false });
    // Deliberately only on mount: once the toast fires, the URL is cleaned and this must not re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {sections.map((section) => (
          <SectionRail
            key={section.value}
            title={section.label}
            href={`/categories/${section.value}`}
            linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
          >
            {section.listings.map((listing: any) => (
              <BusinessCard key={listing._id || listing.slug} listing={listing} className={CARD_WIDTH} />
            ))}
          </SectionRail>
        ))}
      </div>
    </div>
  );
}
