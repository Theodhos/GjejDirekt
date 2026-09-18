import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import Reservation, { type ReservationStatus } from "@/models/Reservation";
import { isObjectId } from "@/lib/utils";

const ASSIGNABLE_STATUSES: ReservationStatus[] = ["pending", "confirmed", "declined", "cancelled"];

/** PATCH /api/reservations/[id] — confirm/decline/cancel. Owner of the listing (or admin) only. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isObjectId(params.id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const status = String(body.status || "") as ReservationStatus;
    if (!ASSIGNABLE_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const reservation = await Reservation.findById(params.id).populate("listing", "owner title");
    if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const listing = reservation.listing as any;
    if (auth.role !== "admin" && listing?.owner?.toString() !== auth.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    reservation.status = status;
    await reservation.save();

    await logActivity({
      type: "reservation_status_updated",
      title: "Reservation status updated",
      description: `Reservation marked as ${status}.`,
      actor: auth.id,
      actorName: auth.name,
      listing: listing?._id?.toString(),
      listingTitle: listing?.title,
      meta: { reservationId: reservation._id.toString(), status }
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    return apiError("Failed to update reservation", 500, error);
  }
}
