import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getAuthUser } from "@/lib/auth";
import { isObjectId } from "@/lib/utils";

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

    if (!isObjectId(params.id)) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    await connectDB();

    // Resolve the listing first so a bad id becomes a 404 instead of an orphaned
    // report plus a CastError 500.
    const Listing = (await import("@/models/Listing")).default;
    const listing = await Listing.findById(params.id).lean<any>();
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const report = await Report.create({
      listing: params.id,
      reporter: auth.id,
      reason,
      status: "pending"
    });

    // The report is already saved — a failing mailbox must not report failure
    // back to the user and invite a duplicate submission.
    try {
      const { sendReportEmail } = await import("@/lib/mail");
      await sendReportEmail({
        listingTitle: listing.title,
        listingId: listing._id.toString(),
        reporterName: auth.name || auth.email,
        reason: reason
      });
    } catch (mailError) {
      console.error("Report notification email failed:", mailError);
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
