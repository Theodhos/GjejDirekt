import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendMail } from "@/lib/mailer";

// Reset links must ALWAYS point to the live site — never localhost, never the request origin.
const APP_URL = "https://www.tripshqip.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "If email exists, reset link was sent." });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetCode = tokenHash;
    user.resetCodeExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();

    const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;

    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Hello ${user.name || "there"},</p><p>Click here to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes.</p>`
    });

    return NextResponse.json({ message: "If email exists, reset link was sent." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send reset link" }, { status: 500 });
  }
}
