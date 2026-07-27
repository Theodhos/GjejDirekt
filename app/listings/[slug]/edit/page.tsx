import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import EditListingShell from "@/components/listings/EditListingShell";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: { slug: string } }) {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug }).lean<any>();
  if (!listing) notFound();

  const isOwner = listing.owner?.toString() === auth.id;
  const isAdmin = auth.role === "admin";
  if (!isOwner && !isAdmin) notFound();

  // Mongo documents carry ObjectIds/Dates — hand the client component plain JSON.
  const plainListing = JSON.parse(JSON.stringify(listing));

  return <EditListingShell listing={plainListing} />;
}
