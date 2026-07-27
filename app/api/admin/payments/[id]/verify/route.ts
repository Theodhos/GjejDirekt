import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { PACKAGE_CATALOG } from "@/lib/packages";

/** Marks the payment rows this admin flow owns, so they can be revoked cleanly. */
const ADMIN_GRANT = "admin-grant";

const GRANT_MAP = {
  verify: PACKAGE_CATALOG.verified,
  trading: PACKAGE_CATALOG.ads,
  features: PACKAGE_CATALOG["ads-pro"]
} as const;

/**
 * Keeps the user's payment history in sync with what the admin grants, so
 * /dashboard/payments shows the same package name and price as the catalogue.
 */
async function syncGrantedPackage(
  listing: any,
  packet: keyof typeof GRANT_MAP,
  granted: boolean,
  owner: { name?: string; email?: string } | null
) {
  const filter = { user: listing.owner, listing: listing._id, packet, orderID: ADMIN_GRANT };

  if (!granted) {
    await Payment.deleteMany(filter);
    return;
  }

  const definition = GRANT_MAP[packet];
  await Payment.findOneAndUpdate(
    filter,
    {
      $set: {
        userName: owner?.name || "",
        userEmail: owner?.email || "",
        listingTitle: listing.title,
        packageName: definition.label.en,
        amount: definition.price,
        currency: definition.currency,
        verificationStatus: "approved"
      }
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

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

    // Mirror the grant in the payment history the listing owner sees.
    const owner = await User.findById(listing.owner).select("name email").lean<any>();

    if (desiredVerified !== undefined) {
      await syncGrantedPackage(listing, "verify", Boolean(desiredVerified), owner);
    }

    if (desiredPackage !== undefined) {
      await syncGrantedPackage(listing, "trading", desiredPackage === "trading", owner);
      await syncGrantedPackage(listing, "features", desiredPackage === "features", owner);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
