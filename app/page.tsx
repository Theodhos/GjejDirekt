import HomePageClient from "./page.client";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { rankListings } from "@/lib/ranking";
import { safeJson } from "@/lib/utils";
import { categories, getCategoryByValue } from "@/lib/constants";

// Listings change a handful of times a day, not every request — cache the page
// and refresh it in the background instead of rendering fresh on every hit.
export const revalidate = 60;

const RECOMMENDED_COUNT = 12;
const CATEGORY_ROW_COUNT = 10;

/**
 * The businesses shown on the home page. Featured (paid) ones lead; if nobody paid
 * for a slot yet the verified ones stand in, then everyone else, so the row is
 * never empty. Below that, one rail per category — matched through
 * getCategoryByValue so legacy category values still land in the right row —
 * and empty categories simply don't render. Only what is shown is sent to the browser.
 */
async function loadHomeRails() {
  await connectDB();
  const found = rankListings(await Listing.find({ status: "approved" }).sort({ createdAt: -1 }).lean<any[]>());
  const featured = found.filter((listing) => listing.featured || listing.package);
  const verified = found.filter((listing) => listing.verified && !featured.includes(listing));
  const rest = found.filter((listing) => !featured.includes(listing) && !verified.includes(listing));
  const recommended = [...featured, ...verified, ...rest].slice(0, RECOMMENDED_COUNT);

  const sections = categories
    .map((category) => ({
      value: category.value,
      label: category.label,
      listings: found
        .filter((listing) => getCategoryByValue(listing.category)?.value === category.value)
        .slice(0, CATEGORY_ROW_COUNT)
    }))
    .filter((section) => section.listings.length > 0);

  return { recommended, sections };
}

export default async function HomePage() {
  let recommended: any[] = [];
  let sections: any[] = [];
  try {
    ({ recommended, sections } = await loadHomeRails());
  } catch {
    // The hero and the category grid don't need the database; the rows just stay hidden.
  }

  return <HomePageClient recommended={safeJson(recommended)} sections={safeJson(sections)} />;
}
