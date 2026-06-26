import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { normalizePackage } from "@/lib/ranking";

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
    
    // Update the listing package
    await Listing.updateOne(
      { _id: listingId, owner: auth.id },
      { 
        $set: {
          package: tier,
          packagePurchaseDate: new Date(),
          packageExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayPal Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
