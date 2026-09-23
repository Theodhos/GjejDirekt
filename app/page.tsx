import HomePageClient from "./page.client";
import { loadRankedCities } from "@/lib/cities-server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import BlogPost from "@/models/BlogPost";
import { rankListings } from "@/lib/ranking";
import { safeJson } from "@/lib/utils";

// Listings/posts change a handful of times a day, not every request — cache the
// page and refresh it in the background instead of rendering fresh on every hit.
export const revalidate = 60;

async function loadHomeListings() {
  await connectDB();
  const found = await Listing.find({ status: "approved" }).sort({ createdAt: -1 }).lean<any[]>();
  return rankListings(found);
}

async function loadHomeBlogPosts() {
  await connectDB();
  return BlogPost.find({ published: true }).sort({ createdAt: -1 }).limit(12).lean<any[]>();
}

export default async function HomePage() {
  // Three independent reads — fetch them together server-side and hand the
  // client component finished data, instead of shipping an empty shell that
  // re-fetches all three itself after hydration.
  let listings: any[] = [];
  let blogPosts: any[] = [];
  let cities: any[] = [];
  try {
    [listings, blogPosts, cities] = await Promise.all([
      loadHomeListings(),
      loadHomeBlogPosts(),
      loadRankedCities()
    ]);
  } catch {
    // The client falls back to the static city catalogue; listings/posts just
    // render their empty state rather than failing the whole page.
  }

  return (
    <HomePageClient
      initialListings={safeJson(listings)}
      initialBlogPosts={safeJson(blogPosts)}
      initialCities={safeJson(cities)}
    />
  );
}
