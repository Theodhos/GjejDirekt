import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { logActivity } from "@/lib/activity";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { isObjectId } from "@/lib/utils";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!isObjectId(params.id)) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    await connectDB();
    const listing = await Listing.findByIdAndUpdate(params.id, { status: "rejected" }, { new: true });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const owner = await User.findById(listing.owner).lean<any>();
    if (owner?.email) {
      await sendMail({
        to: owner.email,
        subject: "Your listing was rejected",
        html: `<p>Your listing <strong>${listing.title}</strong> was rejected during review.</p>`
      }).catch(() => undefined);
    }

    await logActivity({
      type: "listing_rejected",
      title: "Listing rejected",
      description: `${listing.title} was rejected by admin.`,
      actor: auth.id,
      actorName: auth.name,
      listing: listing._id.toString(),
      listingTitle: listing.title
    });

    return NextResponse.json({ listing });
  } catch (error) {
    return apiError("Rejection failed", 500, error);
  }
}
