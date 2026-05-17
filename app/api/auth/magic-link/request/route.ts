import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendMail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "If that email exists, a magic link was sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 20);

    user.resetCode = tokenHash;
    user.resetCodeExpires = expiresAt;
    await user.save();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${appUrl}/auth/magic-link?token=${rawToken}`;

    await sendMail({
      to: user.email,
      subject: "Your magic sign-in link",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;color:#0f172a;">
          <h2 style="margin:0 0 12px;">Sign in with Magic Link</h2>
          <p style="margin:0 0 16px;">Hi ${user.name || "there"}, click the button below to sign in securely.</p>
          <p style="margin:0 0 20px;"><a href="${verifyUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">Sign in now</a></p>
          <p style="margin:0 0 8px;font-size:14px;color:#475569;">This link expires in 20 minutes.</p>
        </div>
      `
    });

    return NextResponse.json({ message: "If that email exists, a magic link was sent." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send magic link" }, { status: 500 });
  }
}
