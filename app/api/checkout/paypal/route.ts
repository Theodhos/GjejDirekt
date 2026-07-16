import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import Payment from "@/models/Payment";
import { normalizePackage } from "@/lib/ranking";
import { sendPaymentNotificationEmail } from "@/lib/mail";

// Server-side source of truth for package pricing/labels so the recorded
// amount never relies on a value the client could tamper with.
const PACKAGE_INFO: Record<string, { amount: number; name: string }> = {
  verified: { amount: 50, name: "Verified" },
  verify: { amount: 50, name: "Verified" },
  ads: { amount: 10, name: "Ads" },
  trending: { amount: 10, name: "Ads" },
  trading: { amount: 10, name: "Ads" },
  "ads-pro": { amount: 15, name: "Ads Pro" },
  features: { amount: 15, name: "Ads Pro" }
};

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderID, packet, listingId } = await request.json();

    if (!orderID || !packet || !listingId) {
      return NextResponse.json({ error: "Missing information" }, { status: 400 });
    }

    const tier = normalizePackage(packet);
    if (!tier) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // In a real production app, you would verify the orderID with PayPal API here
    // using your PAYPAL_CLIENT_SECRET.

    await connectDB();

    const listing = await Listing.findOne({ _id: listingId, owner: auth.id });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const info = PACKAGE_INFO[String(packet).toLowerCase()] || { amount: 0, name: tier };
    const needsApproval = tier === "verify" || tier === "trading" || tier === "features";

    if (needsApproval) {
      await Listing.updateOne(
        { _id: listingId, owner: auth.id },
        { $set: { verificationPending: true } }
      );
    }

    await Payment.create({
      user: auth.id,
      userName: auth.name,
      userEmail: auth.email,
      listing: listing._id,
      listingTitle: listing.title,
      packet: String(packet),
      packageName: info.name,
      amount: info.amount,
      currency: "EUR",
      orderID,
      verificationStatus: needsApproval ? "pending" : "none"
    });

    try {
      await sendPaymentNotificationEmail({
        userName: auth.name,
        userEmail: auth.email,
        packageName: info.name,
        amount: info.amount,
        listingTitle: listing.title,
        needsVerification: isVerifyPackage
      });
    } catch (mailError) {
      console.error("Payment notification email failed:", mailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayPal Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
