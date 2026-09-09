import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { AUTH_COOKIE, getAuthUser, signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import User from "@/models/User";

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(auth.id).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const originalName = user.name;
    const originalEmail = user.email;
    const existingEmail = await User.findOne({ email, _id: { $ne: user._id } }).lean();
    if (existingEmail) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }

    const updates: Record<string, unknown> = {};
    if (name !== user.name) updates.name = name;
    if (email !== user.email) updates.email = email;

    let passwordChanged = false;
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password." }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "New password and confirmation do not match." }, { status: 400 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      updates.password = await bcrypt.hash(newPassword, 12);
      passwordChanged = true;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ message: "No changes detected." });
    }

    Object.assign(user, updates);
    await user.save();

    const payload = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    const token = signToken(payload);
    const response = NextResponse.json({
      user: payload,
      passwordChanged
    });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    await logActivity({
      type: "profile_updated",
      title: passwordChanged ? "Profile and password updated" : "Profile updated",
      description: `${user.name} updated account settings.`,
      actor: user._id.toString(),
      actorName: user.name,
      meta: {
        nameChanged: name !== originalName,
        emailChanged: email !== originalEmail,
        passwordChanged
      }
    });

    return response;
  } catch (error) {
    return apiError("Profile update failed", 500, error);
  }
}
