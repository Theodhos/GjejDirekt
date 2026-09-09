import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getAuthUser } from "@/lib/auth";
import { isObjectId } from "@/lib/utils";

const REPORT_STATUSES = ["pending", "reviewed", "resolved"];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }
    // findByIdAndUpdate does not run schema validators by default, so an
    // unchecked value would be written straight past the enum.
    if (!REPORT_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (!isObjectId(params.id)) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await connectDB();
    const report = await Report.findByIdAndUpdate(
      params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report Status Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
