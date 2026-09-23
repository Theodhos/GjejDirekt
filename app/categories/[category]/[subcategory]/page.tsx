import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getCategoryByValue, getCategorySearchValues, getSubcategorySearchValues } from "@/lib/constants";
import { rankListings } from "@/lib/ranking";
import { safeJson } from "@/lib/utils";
import SubcategoryClient from "@/components/categories/SubcategoryClient";

// Approved listings per subcategory change a handful of times a day — cache the
// page and refresh it in the background instead of hitting Mongo on every request.
export const revalidate = 60;

async function getListings(category: string, subcategory: string) {
  await connectDB();
  const found = await Listing.find({
    status: "approved",
    category: { $in: getCategorySearchValues(category) },
    subcategory: { $in: getSubcategorySearchValues(category, subcategory) }
  })
    .sort({ createdAt: -1 })
    .lean<any[]>();
  return safeJson(rankListings(found));
}

export default async function SubcategoryPage({
  params
}: {
  params: { category: string; subcategory: string };
}) {
  const { category, subcategory } = params;
  if (!getCategoryByValue(category)) notFound();

  const listings = await getListings(category, subcategory);

  return <SubcategoryClient category={category} subcategory={subcategory} initialListings={listings} />;
}
