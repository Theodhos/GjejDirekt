import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { logActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notifications";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { isObjectId } from "@/lib/utils";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!isObjectId(params.id)) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    await connectDB();
    const listing = await Listing.findByIdAndUpdate(params.id, { status: "approved" }, { new: true });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const owner = await User.findById(listing.owner).lean<any>();
    if (owner?.email) {
      await sendMail({
        to: owner.email,
        subject: "Your listing was approved",
        html: `<p>Congratulations, your listing <strong>${listing.title}</strong> is now live.</p>`
      }).catch(() => undefined);
    }

    // In-app ping for the owner: the header bell lights up with "your business is live".
    if (listing.owner) {
      await createNotification({
        user: listing.owner.toString(),
        type: "listing_approved",
        title: `Biznesi "${listing.title}" u aprovua`,
        body: "Faqja juaj është tani publike dhe klientët mund të porosisin.",
        listing: listing._id.toString(),
        listingTitle: listing.title,
        href: `/listings/${listing.slug}`
      });
    }

    await logActivity({
      type: "listing_approved",
      title: "Listing approved",
      description: `${listing.title} was approved by admin.`,
      actor: auth.id,
      actorName: auth.name,
      listing: listing._id.toString(),
      listingTitle: listing.title
    });

    return NextResponse.json({ listing });
  } catch (error) {
    return apiError("Approval failed", 500, error);
  }
}
