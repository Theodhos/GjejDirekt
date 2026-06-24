import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Filter, MapPin, CheckCircle, Clock, XCircle, Sparkles } from "lucide-react";
import { categories } from "@/lib/constants";
import AdminListingsClient from "@/components/dashboard/AdminListingsClient";
import AdminListingActions from "@/components/admin/AdminListingActions";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const featuredFilter = searchParams.featured === 'true';

  const query: Record<string, any> = {};
  if (statusFilter) query.status = statusFilter;
  if (categoryFilter) query.category = categoryFilter;
  if (featuredFilter) query.featured = true;

  const listings = await Listing.find(query).sort({ category: 1, createdAt: -1 }).populate("owner", "name").lean<any>();

  // Group listings by category for clear architecture
  const groupedListings = listings.reduce((acc: Record<string, any[]>, listing: any) => {
    const cat = listing.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(listing);
    return acc;
  }, {});

  const statusOptions = ["pending", "approved", "rejected"];

  return (
    <AdminListingsClient groupedListings={groupedListings} categories={categories} categoryFilter={categoryFilter} />
  );
}
