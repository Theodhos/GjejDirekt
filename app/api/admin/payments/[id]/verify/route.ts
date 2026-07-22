import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Listing from "@/models/Listing";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const body = await request.json();
    const desiredVerified = body.desiredVerified;
    const desiredPackage = body.desiredPackage;
    const updates: any = { verificationPending: false };

    if (desiredVerified !== undefined) {
      updates.verified = desiredVerified;
    }

    if (desiredPackage !== undefined) {
      if (desiredPackage === "trading") {
        updates.package = "trading";
        updates.packagePurchaseDate = new Date();
        updates.packageExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (desiredPackage === "features") {
        updates.package = "features";
        updates.packagePurchaseDate = new Date();
        updates.packageExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else {
        updates.package = null;
        updates.packagePurchaseDate = null;
        updates.packageExpiryDate = null;
      }
    }

    let listingId: string | null = null;
    const payment = await Payment.findById(params.id);
    if (payment) {
      listingId = payment.listing ? payment.listing.toString() : null;
      
      if (desiredVerified === false && desiredPackage === null) {
         payment.verificationStatus = "none";
      } else {
         payment.verificationStatus = "approved";
      }

      if (desiredPackage === "trading") {
         payment.packageName = "Ads";
      } else if (desiredPackage === "features") {
         payment.packageName = "Ads Pro";
      } else if (desiredVerified === true) {
         payment.packageName = "Verified";
      }
      
      await payment.save();
    } else {
      listingId = params.id;
    }

    if (!listingId) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    await Listing.updateOne({ _id: listingId }, { $set: updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
