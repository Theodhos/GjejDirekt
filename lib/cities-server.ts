import { connectDB } from "@/lib/db";
import { seedCities } from "@/lib/cities-catalog";
import { countListingsByCity, rankCitiesByListings } from "@/lib/city-listing-counts";
import City from "@/models/City";
import HiddenCity from "@/models/HiddenCity";
import Listing from "@/models/Listing";

/**
 * The visible city list (seed + admin-added − hidden), already ranked by how
 * many approved listings each city has. Used by /api/cities and by the home
 * page so the first paint is in the right order.
 */
export async function loadRankedCities() {
  await connectDB();

  const [hidden, customCities, listings] = await Promise.all([
    HiddenCity.find().lean<any[]>(),
    City.find().sort({ label: 1 }).lean<any[]>(),
    Listing.find({ status: "approved" }).select("location").lean<any[]>()
  ]);

  const hiddenSet = new Set(hidden.map((item) => String(item.value).toLowerCase()));
  const visibleCustom = customCities.filter((item) => !hiddenSet.has(String(item.value).toLowerCase()));
  const customByValue = new Map(visibleCustom.map((item) => [String(item.value).toLowerCase(), item]));

  const merged = [
    ...seedCities.filter(
      (item) => !customByValue.has(item.value.toLowerCase()) && !hiddenSet.has(item.value.toLowerCase())
    ),
    ...visibleCustom
  ];

  const counts = countListingsByCity(listings.map((item) => item.location));
  return rankCitiesByListings(merged, counts);
}
