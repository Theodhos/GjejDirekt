import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";

const PACKAGE_DURATIONS = {
  verify: null, // No expiry
  trading: 30, // 30 days
  features: 90 // 90 days
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await getAuthUser();

    if (!auth?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, packageTier, paymentMethod } = body;

    if (!listingId || !packageTier || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["verify", "trading", "features"].includes(packageTier)) {
      return NextResponse.json(
        { error: "Invalid package tier" },
        { status: 400 }
      );
    }

    // Find the listing and verify ownership
    const listing = await Listing.findOne({ _id: listingId, owner: auth.id });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or unauthorized" },
        { status: 404 }
      );
    }

    // Process payment (in production, integrate with Stripe/PayPal)
    if (paymentMethod === "card") {
      // Simulate card payment
      console.log(`Processing card payment for ${packageTier} package`);
    } else if (paymentMethod === "paypal") {
      // In production, redirect to PayPal
      console.log(`Processing PayPal payment for ${packageTier} package`);
    }

    // Update listing with package info
    const now = new Date();
    const durationDays = PACKAGE_DURATIONS[packageTier as keyof typeof PACKAGE_DURATIONS];
    const expiryDate = durationDays
      ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)
      : null;

    listing.package = packageTier;
    listing.packagePurchaseDate = now;
    if (expiryDate) {
      listing.packageExpiryDate = expiryDate;
    }

    await listing.save();

    return NextResponse.json({
      success: true,
      message: "Package purchased successfully",
      listing
    });
  } catch (error) {
    console.error("Package purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await getAuthUser();

    if (!auth?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's listings with their package info
    const listings = await Listing.find({ owner: auth.id });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
