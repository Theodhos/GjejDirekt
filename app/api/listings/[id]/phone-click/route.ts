import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { isObjectId } from "@/lib/utils";

// Increments the phone contact-click counter for a listing.
// Counts alongside WhatsApp clicks as a ranking signal within the same package tier.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  if (!isObjectId(params.id)) return NextResponse.json({ success: false }, { status: 200 });

  try {
    await connectDB();
    await Listing.updateOne({ _id: params.id }, { $inc: { phoneClicks: 1 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
