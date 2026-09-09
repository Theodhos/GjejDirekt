import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
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

    const appUrl = "https://www.gjejdirekt.com";
    const verifyUrl = `${appUrl}/auth/magic-link?token=${rawToken}`;

    await sendMail({
      to: user.email,
      subject: "Your Magic Sign-In Link / Linku juaj Magjik i Hyrjes",
      html: `
        <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0;">
          <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f1f5f9;">
            <!-- Top Decorative Gradient Bar -->
            <div style="height: 6px; background: linear-gradient(90deg, #2563eb, #7c3aed, #ec4899);"></div>
            
            <div style="padding: 40px;">
              <!-- Beautiful Icon Banner -->
              <div style="margin-bottom: 24px; text-align: center;">
                <span style="font-size: 40px;">✨</span>
              </div>
              
              <!-- Heading -->
              <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 8px 0; letter-spacing: -0.025em; line-height: 1.2;">
                Sign in to Tourism Platform
              </h2>
              <h3 style="font-size: 16px; font-weight: 500; color: #64748b; text-align: center; margin: 0 0 30px 0; font-style: italic;">
                Hyni në Platformën e Turizmit
              </h3>
              
              <!-- English Section -->
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 12px 0;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px 0;">
                We received a request to log into your account using a passwordless magic link. Click the button below to sign in instantly.
              </p>
              
              <!-- Albanian Section -->
              <div style="border-top: 1px dashed #e2e8f0; margin: 20px 0; padding-top: 20px;">
                <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 12px 0;">
                  Përshëndetje <strong>${user.name || "vizitor"}</strong>,
                </p>
                <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 30px 0;">
                  Kemi marrë një kërkesë për t'u futur në llogarinë tuaj përmes një linku magjik. Klikoni butonin më poshtë për t'u loguar menjëherë.
                </p>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);">
                  Sign In Instantly / Hyr Menjëherë
                </a>
              </div>
              
              <!-- Footer Info -->
              <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
                <p style="margin: 0 0 6px 0;">This link is valid for <strong>20 minutes</strong> and can only be used once.</p>
                <p style="margin: 0 0 16px 0;">Ky link është i vlefshëm për <strong>20 minuta</strong> dhe mund të përdoret vetëm një herë.</p>
                <p style="margin: 0;">If you did not request this email, you can safely ignore it.</p>
                <p style="margin: 0;">Nëse nuk e keni kërkuar këtë email, thjesht injorojeni atë.</p>
              </div>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ message: "If that email exists, a magic link was sent." });
  } catch (error) {
    return apiError("Failed to send magic link", 500, error);
  }
}
