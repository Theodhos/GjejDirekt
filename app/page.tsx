import HomePageClient from "./page.client";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { rankListings } from "@/lib/ranking";
import { safeJson } from "@/lib/utils";

// Listings change a handful of times a day, not every request — cache the page
// and refresh it in the background instead of rendering fresh on every hit.
export const revalidate = 60;

const RECOMMENDED_COUNT = 12;

/**
 * The businesses shown on the home page. Featured (paid) ones lead; if nobody paid
 * for a slot yet the verified ones stand in, then everyone else, so the row is
 * never empty. Only the twelve that are shown are sent to the browser.
 */
async function loadRecommended() {
  await connectDB();
  const found = rankListings(await Listing.find({ status: "approved" }).sort({ createdAt: -1 }).lean<any[]>());
  const featured = found.filter((listing) => listing.featured || listing.package);
  const verified = found.filter((listing) => listing.verified && !featured.includes(listing));
  const rest = found.filter((listing) => !featured.includes(listing) && !verified.includes(listing));
  return [...featured, ...verified, ...rest].slice(0, RECOMMENDED_COUNT);
}

export default async function HomePage() {
  let recommended: any[] = [];
  try {
    recommended = await loadRecommended();
  } catch {
    // The hero and the category grid don't need the database; the row just stays hidden.
  }

  return <HomePageClient recommended={safeJson(recommended)} />;
}
