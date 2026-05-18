import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import ListingEditForm from "@/components/forms/ListingEditForm";

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

  return (
    <section className="page-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-6">
          <p className="eyebrow">Edit listing</p>
          <h1 className="display-font mt-3 text-4xl font-black tracking-tight text-slate-950">{listing.title}</h1>
          <p className="mt-4 text-slate-600">
            Update the information, categories, pricing, and images. If this listing is already approved, your changes will return it to review.
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-brand-50 p-5">
            <p className="text-sm font-semibold text-brand-700">Tip</p>
            <p className="mt-2 text-sm text-slate-600">
              Clear titles, strong imagery, and complete contact details make approvals and conversions much smoother.
            </p>
          </div>
        </div>
        <div className="surface p-6">
          <ListingEditForm listing={listing} />
        </div>
      </div>
    </section>
  );
}
