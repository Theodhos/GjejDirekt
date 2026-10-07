import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notifications";
import Reservation from "@/models/Reservation";
import Listing from "@/models/Listing";
import Product from "@/models/Product";
import { getListingActions } from "@/lib/constants";
import { isObjectId } from "@/lib/utils";
import { countBookingDays, isDateRange } from "@/lib/reservations";
import { formatPrice } from "@/lib/pricing";

/**
 * GET /api/reservations
 *   ?listingId=<id>  — reservations for one listing (must own it, or be admin)
 *   ?mine=1          — the caller's own reservations, across every business
 *   (no params)      — reservations across every listing the caller owns (or every
 *                      listing at all, for an admin) — the dashboard's default view
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
      const reservations = await Reservation.find({ user: auth.id })
        .populate("listing", "title slug images photos bannerImage location category")
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ reservations });
    }

    if (listingId) {
      if (!isObjectId(listingId)) return NextResponse.json({ reservations: [] });
      const listing = await Listing.findById(listingId).select("owner").lean<any>();
      if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
      if (auth.role !== "admin" && listing.owner?.toString() !== auth.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const reservations = await Reservation.find({ listing: listingId }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ reservations });
    }

    const ownedListingIds =
      auth.role === "admin"
        ? undefined
        : (await Listing.find({ owner: auth.id }).select("_id").lean<any[]>()).map((item) => item._id);

    const query = ownedListingIds ? { listing: { $in: ownedListingIds } } : {};
    const reservations = await Reservation.find(query)
      .populate("listing", "title slug")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ reservations });
  } catch (error) {
    return apiError("Failed to load reservations", 500, error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    const body = await request.json();

    const listingId = String(body.listingId || "");
    const customerName = String(body.customerName || "").trim();
    const customerPhone = String(body.customerPhone || "").trim();
    const dateValue = body.date ? new Date(body.date) : null;

    if (!isObjectId(listingId)) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: "Emri dhe telefoni janë të detyrueshëm." }, { status: 400 });
    }
    if (!dateValue || Number.isNaN(dateValue.getTime())) {
      return NextResponse.json({ error: "Data e rezervimit është e detyrueshme." }, { status: 400 });
    }

    await connectDB();
    const listing = await Listing.findById(listingId).lean<any>();
    if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    if (!getListingActions(listing).includes("rezervim")) {
      return NextResponse.json({ error: "Ky biznes nuk pranon rezervime." }, { status: 400 });
    }

    let itemName: string | undefined;
    let productId: string | undefined;
    if (body.productId && isObjectId(String(body.productId))) {
      const product = await Product.findOne({ _id: body.productId, listing: listingId }).select("name").lean<any>();
      if (product) {
        productId = product._id.toString();
        itemName = product.name;
      }
    }

    const endDateRaw = body.endDate ? new Date(body.endDate) : undefined;
    const endDateValue = endDateRaw && !Number.isNaN(endDateRaw.getTime()) ? endDateRaw : undefined;
    if (endDateValue && !isDateRange(dateValue, endDateValue)) {
      return NextResponse.json({ error: "Data e mbarimit duhet të jetë pas datës së fillimit." }, { status: 400 });
    }
    // Days are recomputed from the dates rather than trusted from the client, so the
    // record can never say "3 ditë" over a two-day range; the total is the cart's
    // per-day price × those days, as the customer saw it before sending.
    const days = countBookingDays(dateValue, endDateValue);
    const totalValue = Number(body.total);
    const total = Number.isFinite(totalValue) && totalValue >= 0 ? Math.round(totalValue) : undefined;
    const partySize = Number(body.partySize);

    const reservation = await Reservation.create({
      listing: listingId,
      product: productId,
      itemName,
      user: auth?.id,
      customerName,
      customerPhone,
      date: dateValue,
      endDate: endDateValue,
      days,
      total,
      time: body.time ? String(body.time).trim() : undefined,
      partySize: Number.isFinite(partySize) && partySize > 0 ? partySize : undefined,
      notes: body.notes ? String(body.notes).trim() : undefined
    });

    await logActivity({
      type: "reservation_created",
      title: "New reservation request",
      description: `${customerName} requested a reservation.`,
      actor: auth?.id,
      actorName: auth?.name || customerName,
      listing: listingId,
      listingTitle: listing.title,
      meta: { reservationId: reservation._id.toString() }
    });

    // Same ping as for an order: the owner sees the booking in the header bell and
    // the dashboard the moment the customer's WhatsApp message is sent.
    if (listing.owner) {
      const formatDay = (value: Date) => value.toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "numeric" });
      const when = [
        endDateValue ? `${formatDay(dateValue)} → ${formatDay(endDateValue)} (${days} ditë)` : formatDay(dateValue),
        body.time ? String(body.time).trim() : undefined
      ]
        .filter(Boolean)
        .join(" ");
      const details = [
        itemName,
        when,
        Number.isFinite(partySize) && partySize > 0 ? `${partySize} persona` : undefined,
        typeof total === "number" ? formatPrice(total) : undefined,
        customerPhone
      ]
        .filter(Boolean)
        .join(" · ");
      await createNotification({
        user: listing.owner.toString(),
        type: "reservation",
        title: `Rezervim i ri nga ${customerName}`,
        body: details,
        listing: listingId,
        listingTitle: listing.title,
        href: "/dashboard#njoftimet",
        meta: { reservationId: reservation._id.toString() }
      });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    return apiError("Reservation failed", 500, error);
  }
}
