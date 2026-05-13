import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AUTH_COOKIE, signToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, name, photoURL, providerId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required from social provider." }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        password: Math.random().toString(36).slice(-10), // Random password since they login via social
        role: "user",
        avatar: photoURL || "",
        provider: providerId || "google"
      });

      await logActivity({
        type: "user_registered",
        title: "New social registration",
        description: `${user.name} joined via Google.`,
        actor: user._id.toString(),
        actorName: user.name
      });
    }

    // Create session
    const token = signToken({ 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role 
    });

    const response = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    await logActivity({
      type: "user_logged_in",
      title: "Social login",
      description: `${user.name} signed in via Google.`,
      actor: user._id.toString(),
      actorName: user.name
    });

    return response;
  } catch (error) {
    console.error("Social Auth Error:", error);
    return NextResponse.json({ error: "Social authentication failed" }, { status: 500 });
  }
}
