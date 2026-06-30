import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Listing from "@/models/Listing";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const payment = await Payment.findById(params.id);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    payment.verificationStatus = "approved";
    await payment.save();

    if (payment.listing) {
      await Listing.updateOne(
        { _id: payment.listing },
        { $set: { verified: true, verificationPending: false } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
