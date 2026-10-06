import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Notification from "@/models/Notification";
import { isObjectId } from "@/lib/utils";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** GET /api/notifications — the caller's latest notifications plus how many are unread. */
export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 401, headers: NO_STORE });

    await connectDB();
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: auth.id }).sort({ createdAt: -1 }).limit(30).lean(),
      Notification.countDocuments({ user: auth.id, read: false })
    ]);
    return NextResponse.json({ notifications, unreadCount }, { headers: NO_STORE });
  } catch (error) {
    return apiError("Failed to load notifications", 500, error);
  }
}

/**
 * PATCH /api/notifications — mark as read.
 *   { all: true }        — everything the caller has
 *   { ids: string[] }    — only these
 */
export async function PATCH(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    await connectDB();

    if (body?.all) {
      await Notification.updateMany({ user: auth.id, read: false }, { $set: { read: true } });
    } else if (Array.isArray(body?.ids)) {
      const ids = body.ids.filter((id: unknown) => typeof id === "string" && isObjectId(id));
      if (ids.length) await Notification.updateMany({ _id: { $in: ids }, user: auth.id }, { $set: { read: true } });
    }

    const unreadCount = await Notification.countDocuments({ user: auth.id, read: false });
    return NextResponse.json({ success: true, unreadCount }, { headers: NO_STORE });
  } catch (error) {
    return apiError("Failed to update notifications", 500, error);
  }
}
