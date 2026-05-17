import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token) return NextResponse.json({ error: "Token is required." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    await connectDB();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetCode: tokenHash, resetCodeExpires: { $gt: new Date() } }).select("+password");
    if (!user) return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });

    user.password = await bcrypt.hash(password, 12);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to reset password" }, { status: 500 });
  }
}
