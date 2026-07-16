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
    const packageKey = String(body.packageKey || "").toLowerCase();
    const updates: any = { verificationPending: false };

    if (packageKey === "none") {
      updates.verified = false;
      updates.package = null;
      updates.packagePurchaseDate = null;
      updates.packageExpiryDate = null;
    } else if (packageKey === "verified" || packageKey === "verify") {
      updates.verified = true;
      updates.package = "verify";
      updates.packagePurchaseDate = new Date();
      updates.packageExpiryDate = null;
    } else if (packageKey === "ads" || packageKey === "trading") {
      updates.verified = true;
      updates.package = "trading";
      updates.packagePurchaseDate = new Date();
      updates.packageExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (packageKey === "ads pro" || packageKey === "features") {
      updates.verified = true;
      updates.package = "features";
      updates.packagePurchaseDate = new Date();
      updates.packageExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    let listingId: string | null = null;
    const payment = await Payment.findById(params.id);
    if (payment) {
      listingId = payment.listing ? payment.listing.toString() : null;
      payment.verificationStatus = packageKey === "none" ? "none" : "approved";
      payment.packageName = packageKey === "ads" ? "Ads" : packageKey === "ads pro" ? "Ads Pro" : packageKey === "verified" || packageKey === "verify" ? "Verified" : payment.packageName;
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
