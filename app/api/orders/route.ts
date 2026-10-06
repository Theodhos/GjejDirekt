import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import Order from "@/models/Order";
import Listing from "@/models/Listing";
import { isObjectId } from "@/lib/utils";

/**
 * GET /api/orders
 *   ?mine=1          — the caller's own orders, across every business
 *   ?listingId=<id>  — orders for one listing (must own it, or be admin)
 *   (no params)      — every listing the caller owns (or every listing at all, for
 *                      an admin) — the dashboard's default view, same shape as /api/reservations
 */
export async function GET(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const listingId = url.searchParams.get("listingId");
    const mine = url.searchParams.get("mine");

    await connectDB();

    if (mine) {
      const orders = await Order.find({ user: auth.id })
        .populate("listing", "title slug images photos bannerImage location category")
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ orders });
    }

    if (listingId) {
      if (!isObjectId(listingId)) return NextResponse.json({ orders: [] });
      const listing = await Listing.findById(listingId).select("owner").lean<any>();
      if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
      if (auth.role !== "admin" && listing.owner?.toString() !== auth.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const orders = await Order.find({ listing: listingId }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ orders });
    }

    const ownedListingIds =
      auth.role === "admin"
        ? undefined
        : (await Listing.find({ owner: auth.id }).select("_id").lean<any[]>()).map((item) => item._id);

    const query = ownedListingIds ? { listing: { $in: ownedListingIds } } : {};
    const orders = await Order.find(query).populate("listing", "title slug").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    return apiError("Failed to load orders", 500, error);
  }
}

/** Fired from the checkout drawer right alongside the WhatsApp send — a guest can order without an account. */
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    const body = await request.json();

    const listingId = String(body.listingId || "");
    const customerName = String(body.customerName || "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!isObjectId(listingId)) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    if (!customerName) return NextResponse.json({ error: "Emri është i detyrueshëm." }, { status: 400 });

    const cleanItems = items
      .map((item: any) => ({
        productId: item?.productId ? String(item.productId) : undefined,
        name: String(item?.name || "").trim(),
        price: Number.isFinite(Number(item?.price)) ? Number(item.price) : undefined,
        qty: Number.isFinite(Number(item?.qty)) && Number(item.qty) > 0 ? Number(item.qty) : 1
      }))
      .filter((item: any) => item.name);
    if (!cleanItems.length) return NextResponse.json({ error: "Porosia nuk ka artikuj." }, { status: 400 });

    await connectDB();
    const listing = await Listing.findById(listingId).lean<any>();
    if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

    const total = Number.isFinite(Number(body.total))
      ? Number(body.total)
      : cleanItems.every((item: any) => typeof item.price === "number")
        ? cleanItems.reduce((sum: number, item: any) => sum + item.price * item.qty, 0)
        : undefined;

    const order = await Order.create({
      listing: listingId,
      user: auth?.id,
      customerName,
      customerPhone: body.customerPhone ? String(body.customerPhone).trim() : undefined,
      customerAddress: body.customerAddress ? String(body.customerAddress).trim() : undefined,
      items: cleanItems,
      total,
      paymentMethod: body.paymentMethod ? String(body.paymentMethod).trim() : undefined,
      note: body.note ? String(body.note).trim() : undefined
    });

    await logActivity({
      type: "order_created",
      title: "New order",
      description: `${customerName} placed an order.`,
      actor: auth?.id,
      actorName: auth?.name || customerName,
      listing: listingId,
      listingTitle: listing.title,
      meta: { orderId: order._id.toString() }
    });

    return NextResponse.json({ order });
  } catch (error) {
    return apiError("Order failed", 500, error);
  }
}
