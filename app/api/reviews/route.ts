import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import Review from "@/models/Review";
import Listing from "@/models/Listing";
import { isObjectId } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const listingId = url.searchParams.get("listingId");
    // A malformed id has no reviews; treat it as empty rather than letting the
    // resulting CastError bubble up as a 500.
    if (!isObjectId(listingId)) {
      return NextResponse.json({ reviews: [] });
    }

    await connectDB();
    const reviews = await Review.find({ listing: listingId }).populate("user", "name").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (error) {
    return apiError("Failed to load reviews", 500, error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const rating = Number(body.rating);
    const comment = String(body.comment || "").trim();

    if (!body.listingId || !rating || !comment) {
      return NextResponse.json({ error: "Listing, rating, and comment are required." }, { status: 400 });
    }
    if (!isObjectId(body.listingId)) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    await connectDB();
    if (!(await Listing.exists({ _id: body.listingId }))) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    const review = await Review.create({
      listing: body.listingId,
      user: auth.id,
      rating,
      comment
    });
    const stats = await Review.aggregate([
      { $match: { listing: review.listing } },
      {
        $group: {
          _id: "$listing",
          average: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    const aggregate = stats[0];
    if (aggregate) {
      await Listing.findByIdAndUpdate(review.listing, {
        ratingAverage: Number(aggregate.average.toFixed(1)),
        reviewCount: aggregate.count
      });
    }

    await logActivity({
      type: "review_created",
      title: "New review posted",
      description: `A rating of ${rating} was added for a listing.`,
      actor: auth.id,
      actorName: auth.name,
      listing: body.listingId,
      meta: { rating, comment }
    });

    return NextResponse.json({ review });
  } catch (error) {
    return apiError("Review failed", 500, error);
  }
}
