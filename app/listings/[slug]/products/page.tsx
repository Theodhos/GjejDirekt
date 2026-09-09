import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import Product from "@/models/Product";
import { safeJson } from "@/lib/utils";
import ProductManagerClient from "@/components/dashboard/ProductManagerClient";

export const dynamic = "force-dynamic";

export default async function ManageProductsPage({ params }: { params: { slug: string } }) {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug }).lean<any>();
  if (!listing) notFound();

  const isOwner = listing.owner?.toString() === auth.id;
  const isAdmin = auth.role === "admin";
  if (!isOwner && !isAdmin) notFound();

  const products = await Product.find({ listing: listing._id }).sort({ order: 1, createdAt: 1 }).lean<any>();

  return <ProductManagerClient listing={safeJson(listing)} products={safeJson(products)} />;
}
