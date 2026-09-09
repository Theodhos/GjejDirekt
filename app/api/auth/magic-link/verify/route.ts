import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { AUTH_COOKIE, signToken, setAuthCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { logActivity } from "@/lib/activity";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();

    if (!token) {
      return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    await connectDB();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ resetCode: tokenHash });

    if (!user) {
      return NextResponse.json({ error: "Invalid magic link. Code not found in database." }, { status: 401 });
    }

    if (user.resetCodeExpires && new Date() > user.resetCodeExpires) {
      return NextResponse.json({ error: "This magic link has expired." }, { status: 401 });
    }

    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    const jwt = signToken({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });
    setAuthCookie(jwt);
    const response = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

    response.cookies.set(AUTH_COOKIE, jwt, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    await logActivity({
      type: "user_logged_in",
      title: user.role === "admin" ? "Admin logged in" : "User logged in",
      description: `${user.name} signed in via magic link.`,
      actor: user._id.toString(),
      actorName: user.name
    });

    return response;
  } catch (error) {
    return apiError("Magic link verification failed", 500, error);
  }
}
