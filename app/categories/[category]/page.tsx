import { notFound } from "next/navigation";
import { getCategoryByValue, categories } from "@/lib/constants";
import CategoryClient from "@/components/categories/CategoryClient";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { rankListings } from "@/lib/ranking";
import { safeJson } from "@/lib/utils";

// Approved listings per category change a handful of times a day — cache the
// page and refresh it in the background instead of hitting Mongo on every request.
export const revalidate = 60;

async function getListingsByCategory(categoryValue: string) {
  await connectDB();
  const found = await Listing.find({
    category: categoryValue,
    status: "approved"
  })
    .sort({ createdAt: -1 })
    .lean<any[]>();
  return rankListings(found);
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategoryByValue(params.category);
  if (!category) notFound();

  const listings = await getListingsByCategory(category.value);
  // Converting only _id left ObjectId/Date values (owner, createdAt) in the tree,
  // which React cannot hand to a Client Component. safeJson flattens all of them.
  const serializedListings = safeJson(listings);

  return <CategoryClient category={category} categories={categories} initialListings={serializedListings} />;
}
