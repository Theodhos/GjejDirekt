import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const status = searchParams.get("status") as "approved" | "rejected";
  const token = searchParams.get("token");

  const expectedToken = process.env.ADMIN_DELETE_SECRET || "super-secret-token";

  if (!id || !status || !token || token !== expectedToken) {
    return new NextResponse("Unauthorized or missing parameters", { status: 401 });
  }

  try {
    await connectDB();
    
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    
    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const isApproved = status === "approved";
    const color = isApproved ? "#10b981" : "#ef4444";
    const icon = isApproved ? "&check;" : "&times;";

    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; margin: 0;">
          <div style="background: white; padding: 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; max-width: 400px;">
            <div style="width: 60px; height: 60px; background: ${color}; color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px; font-weight: bold;">${icon}</div>
            <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 10px;">Listing ${isApproved ? 'Approved' : 'Rejected'}</h1>
            <p style="color: #64748b; line-height: 1.6;">The listing <b>${listing.title}</b> has been marked as <b>${status}</b>.</p>
            <a href="/admin" style="display: inline-block; margin-top: 20px; color: ${color}; font-weight: 900; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Go to Dashboard &rarr;</a>
          </div>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });

  } catch (error) {
    console.error("Status Via Email Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
