import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import Listing from "@/models/Listing";
import { isObjectId } from "@/lib/utils";

/**
 * The last step of "add a business": the draft saved after the profile step — which
 * the catalog step has been filling in since — is handed to the admin for approval.
 * This is the moment the listing counts as submitted, so the activity entry and the
 * admin email go out here rather than when the draft was first saved.
 */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!isObjectId(params.id)) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    await connectDB();
    const listing = await Listing.findById(params.id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    if (listing.owner.toString() !== auth.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Already submitted (a double click, a second tab) — nothing left to do.
    if (listing.status !== "draft") return NextResponse.json({ listing });

    listing.status = "pending";
    await listing.save();

    await logActivity({
      type: "listing_submitted",
      title: "New listing submitted",
      description: `${listing.title} is waiting for approval.`,
      actor: auth.id,
      actorName: auth.name,
      listing: listing._id.toString(),
      listingTitle: listing.title,
      meta: { category: listing.category, subcategory: listing.subcategory, location: listing.location }
    });

    if (process.env.ADMIN_EMAIL?.trim()) {
      const { sendListingSubmissionEmail } = await import("@/lib/mail");
      await sendListingSubmissionEmail({
        listingTitle: listing.title,
        listingId: listing._id.toString(),
        ownerName: auth.name || auth.email,
        category: listing.category,
        location: listing.location
      }).catch((err) => console.error("Email send error:", err));
    }

    return NextResponse.json({ listing });
  } catch (error) {
    return apiError("Failed to publish listing", 500, error);
  }
}
