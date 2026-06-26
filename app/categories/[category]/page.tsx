import { notFound } from "next/navigation";
import { getCategoryByValue, categories } from "@/lib/constants";
import CategoryClient from "@/components/categories/CategoryClient";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { rankListings } from "@/lib/ranking";

export const dynamic = "force-dynamic";

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
  const serializedListings = listings.map((l) => ({
    ...l,
    _id: l._id.toString(),
  }));

  return <CategoryClient category={category} categories={categories} initialListings={serializedListings} />;
}
