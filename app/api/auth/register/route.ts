import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { AUTH_COOKIE, signToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    if (!name || !email || !phone || password.length < 6) {
      return NextResponse.json({ error: "Name, phone, email, and a 6+ character password are required." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, password: hash });
    const token = signToken({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });
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
      type: "user_registered",
      title: "New user registered",
      description: `${user.name} joined the platform.`,
      actor: user._id.toString(),
      actorName: user.name
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    );
  }
}
