import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await request.json();
    if (!reason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    await connectDB();

    const report = await Report.create({
      listing: params.id,
      reporter: auth.id,
      reason,
      status: "pending"
    });

    // Fetch details for email
    const Listing = (await import("@/models/Listing")).default;
    const listing = await Listing.findById(params.id).lean<any>();
    
    if (listing) {
      const { sendReportEmail } = await import("@/lib/mail");
      await sendReportEmail({
        listingTitle: listing.title,
        listingId: listing._id.toString(),
        reporterName: auth.name || auth.email,
        reason: reason
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
