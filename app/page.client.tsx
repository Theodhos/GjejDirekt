"use client";

import { useMemo } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { ArrowRight, CheckCircle, MapPin, MessageCircle, Wallet } from "lucide-react";
import HomeSearchHero from "@/components/home/HomeSearchHero";
import CategoryGrid from "@/components/home/CategoryGrid";
import SectionRail from "@/components/home/SectionRail";
import BusinessCard from "@/components/home/BusinessCard";
import ProductCard from "@/components/home/ProductCard";
import RegisterBusinessCTA from "@/components/home/RegisterBusinessCTA";
import { albaniaCities } from "@/lib/albania-cities";
import { categories } from "@/lib/constants";
import { productsFromListings } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

/** Card width for both rails — a little over two cards peek on a 360px phone. */
const CARD_WIDTH = "w-[164px] min-w-[164px] snap-start sm:w-[224px] sm:min-w-[224px]";

type HomePageClientProps = {
  initialListings?: any[];
  initialBlogPosts?: any[];
  initialCities?: any[];
};

function HomePageClient({ initialListings = [], initialBlogPosts = [], initialCities = [] }: HomePageClientProps) {
  const { language, t } = useLanguage();

  // All three arrive server-rendered — already ranked/filtered by the server,
  // so nothing here re-fetches or re-derives them on mount.
  const listings = initialListings;
  const blogPosts = initialBlogPosts;
  const citiesByListingCount = initialCities.length ? initialCities : albaniaCities;

  // Featured businesses lead the page; if nobody paid for a feature slot yet, the
  // verified ones stand in so the row is never empty.
  const recommended = useMemo(() => {
    const featured = listings.filter((listing) => listing.featured || listing.package);
    const verified = listings.filter((listing) => listing.verified && !featured.includes(listing));
    return [...featured, ...verified, ...listings].slice(0, 12);
  }, [listings]);

  const products = useMemo(() => productsFromListings(listings), [listings]);

  // Only categories that actually have businesses get their own row — an empty
  // rail reads as a broken page.
  const categoryRows = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: listings
          .filter((listing) => {
            const value = String(listing.category || "").toLowerCase();
            return value === category.value || category.aliases.includes(value);
          })
          .slice(0, 12)
      }))
      .filter((row) => row.items.length >= 2);
  }, [listings]);

  const benefits = [
    {
      icon: MessageCircle,
      title: language === "en" ? "Order on WhatsApp" : "Porosit në WhatsApp",
      desc: language === "en" ? "One tap, straight to the business." : "Një klik, direkt te biznesi."
    },
    {
      icon: Wallet,
      title: language === "en" ? "0% commission" : "0% komision",
      desc: language === "en" ? "The price you see is the price you pay." : "Çmimi që sheh është çmimi që paguan."
    },
    {
      icon: CheckCircle,
      title: language === "en" ? "Verified businesses" : "Biznese të verifikuara",
      desc: language === "en" ? "The badge means someone checked." : "Badge-i do të thotë i kontrolluar."
    },
    {
      icon: MapPin,
      title: language === "en" ? "Everything nearby" : "Gjithçka pranë teje",
      desc: language === "en" ? "Filtered by your city, not the whole country." : "Filtruar sipas qytetit tënd."
    }
  ];

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <HomeSearchHero />

      <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-6">
        {/* Why GjejDirekt — right after the hero, before any listing content, so
            what the platform actually does (WhatsApp ordering, 0% commission,
            verified, nearby) is clear before someone starts browsing. This used
            to sit near the bottom of the page, well past categories, businesses,
            products and cities. */}
        <section className="gd-panel p-4 sm:p-6">
          <h2 className="gd-section-title mb-3 text-center sm:text-left">
            {language === "en" ? "Why GjejDirekt?" : "Pse GjejDirekt?"}
          </h2>
          <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-xl border p-3 sm:p-4"
                style={{ borderColor: "var(--border-soft)", background: "var(--surface-cream)" }}
              >
                <span
                  className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
                >
                  <benefit.icon className="h-[18px] w-[18px]" />
                </span>
                <p className="text-[13px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {benefit.title}
                </p>
                <p className="mt-1 text-[11.5px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                  {benefit.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Categories — white card panel */}
        <section className="gd-panel p-4 sm:p-5">
          <CategoryGrid />
        </section>

        {/* Recommended businesses */}
        {recommended.length > 0 ? (
          <SectionRail
            title={language === "en" ? "Recommended businesses" : "Biznese të rekomanduara"}
            href="/listings"
            linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
          >
            {recommended.map((listing: any) => (
              <BusinessCard key={listing._id || listing.slug} listing={listing} className={CARD_WIDTH} />
            ))}
          </SectionRail>
        ) : null}

        {/* Popular products */}
        {products.length > 0 && (
          <SectionRail
            title={language === "en" ? "Popular products" : "Produkte popullore"}
            href="/listings"
            linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} className={CARD_WIDTH} />
            ))}
          </SectionRail>
        )}

        <RegisterBusinessCTA />

        {/* Cities */}
        <SectionRail
          title={language === "en" ? "Browse by city" : "Shfleto sipas qytetit"}
          href="/cities"
          linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
        >
          {citiesByListingCount.map((city: any) => (
            <Link
              key={city.value}
              href={`/city/${city.value}`}
              className="gd-card group relative aspect-[4/3] w-[148px] min-w-[148px] snap-start overflow-hidden sm:w-[200px] sm:min-w-[200px]"
            >
              <SafeImage
                src={city.image}
                alt={city.label}
                fill
                sizes="(max-width: 640px) 45vw, 200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(10,12,16,0.8) 0%, rgba(10,12,16,0.05) 65%)" }}
              />
              <span className="absolute inset-x-0 bottom-0 p-2.5 text-[13px] font-bold text-white">{city.label}</span>
            </Link>
          ))}
        </SectionRail>

        {/* One rail per category that has businesses */}
        {categoryRows.map(({ category, items }) => (
          <SectionRail
            key={category.value}
            id={category.value}
            title={category.label}
            href={`/categories/${category.value}`}
            linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
          >
            {items.map((listing: any) => (
              <BusinessCard key={listing._id || listing.slug} listing={listing} className={CARD_WIDTH} />
            ))}
          </SectionRail>
        ))}

        {/* Blog */}
        {blogPosts.length > 0 && (
          <SectionRail
            title={t.blog.latestPub}
            href="/blog"
            linkLabel={language === "en" ? "See all" : "Shiko të gjitha"}
          >
            {blogPosts.map((post: any) => (
              <Link
                key={post._id?.toString?.() || post.slug}
                href={`/blog/${post.slug}`}
                className="gd-card group flex w-[230px] min-w-[230px] snap-start flex-col sm:w-[280px] sm:min-w-[280px]"
              >
                <span className="relative block aspect-[16/9] w-full overflow-hidden">
                  <SafeImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 70vw, 280px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 flex-col p-3">
                  <span className="line-clamp-2 text-[13px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
                    {post.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-[11.5px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {post.excerpt}
                  </span>
                  <span className="gd-section-link mt-2 inline-flex items-center gap-1">
                    {language === "en" ? "Read" : "Lexo"} <ArrowRight className="h-3 w-3" />
                  </span>
                </span>
              </Link>
            ))}
          </SectionRail>
        )}
      </div>
    </div>
  );
}

export default HomePageClient;
