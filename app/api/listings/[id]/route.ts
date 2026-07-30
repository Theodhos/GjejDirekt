import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import Listing from "@/models/Listing";

function parseList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseMaybeNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function parseMaybeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function parseCoordinates(body: Record<string, unknown>) {
  const latValue = body.coordinatesLat ?? body["coordinates.lat"] ?? body.lat;
  const lngValue = body.coordinatesLng ?? body["coordinates.lng"] ?? body.lng;
  const lat = parseMaybeNumber(latValue);
  const lng = parseMaybeNumber(lngValue);
  if (lat === undefined || lng === undefined) return undefined;
  return { lat, lng };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const listing = await Listing.findOne({ $or: [{ _id: params.id }, { slug: params.id }] })
      .populate("owner", "name email role")
      .lean();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load listing" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const listing = await Listing.findById(params.id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    if (listing.owner.toString() !== auth.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const wasPending = listing.status === "pending";

    listing.title = parseMaybeString(body.title) || listing.title;
    listing.description = parseMaybeString(body.description) || listing.description;
    listing.category = parseMaybeString(body.category) || listing.category;
    listing.subcategory = parseMaybeString(body.subcategory) || listing.subcategory;
    listing.location = parseMaybeString(body.location) || listing.location;
    listing.country = parseMaybeString(body.country) || "";
    listing.address = parseMaybeString(body.address) || "";
    listing.images = Array.isArray(body.images) ? body.images.map((item: unknown) => String(item)).filter(Boolean) : listing.images;
    listing.bannerImage = parseMaybeString(body.bannerImage) || listing.images?.[0] || listing.bannerImage;
    listing.photos = Array.isArray(body.photos) ? body.photos.map((item: unknown) => String(item)).filter(Boolean) : listing.images?.slice(1) || listing.photos;
    listing.price = parseMaybeNumber(body.price);
    listing.priceFrom = parseMaybeNumber(body.priceFrom);
    listing.currency = parseMaybeString(body.currency) || listing.currency;
    listing.priceRange = parseMaybeString(body.priceRange);
    listing.duration = parseMaybeString(body.duration);
    listing.difficulty = parseMaybeString(body.difficulty);
    listing.season = parseMaybeString(body.season);
    listing.maxParticipants = parseMaybeNumber(body.maxParticipants);
    listing.minAge = parseMaybeNumber(body.minAge);
    listing.childPrice = parseMaybeNumber(body.childPrice);
    listing.whatToBring = parseList(body.whatToBring);
    listing.cuisines = parseList(body.cuisines);
    listing.languages = parseList(body.languages);
    listing.amenities = parseList(body.amenities);
    listing.tags = parseList(body.tags);
    listing.highlights = parseList(body.highlights);
    const coordinates = parseCoordinates(body as Record<string, unknown>);
    if (coordinates) {
      listing.coordinates = coordinates;
    }
    listing.contactInfo = {
      phone: parseMaybeString(body.contactPhone) || "",
      email: parseMaybeString(body.contactEmail) || "",
      website: parseMaybeString(body.website) || ""
    };
    listing.socialLinks = {
      instagram: parseMaybeString(body.instagram) || parseMaybeString(body.instagramLink) || "",
      facebook: parseMaybeString(body.facebook) || parseMaybeString(body.facebookLink) || "",
      tiktok: parseMaybeString(body.tiktok) || "",
      youtube: parseMaybeString(body.youtube) || "",
      x: parseMaybeString(body.x) || ""
    };
    listing.whatsapp = parseMaybeString(body.whatsapp);
    listing.website = parseMaybeString(body.website);
    listing.googleMapsLink = parseMaybeString(body.googleMapsLink);
    listing.businessHours = parseMaybeString(body.businessHours);
    listing.checkIn = parseMaybeString(body.checkIn);
    listing.checkOut = parseMaybeString(body.checkOut);
    listing.menuLink = parseMaybeString(body.menuLink);
    listing.tips = parseMaybeString(body.tips);
    listing.eventDate = parseMaybeString(body.eventDate);
    listing.eventTime = parseMaybeString(body.eventTime);
    listing.bookingLink = parseMaybeString(body.bookingLink);
    listing.transportType = parseMaybeString(body.transportType);

    if (typeof body.featured === "boolean" && auth.role === "admin") {
      listing.featured = body.featured;
    }

    if (auth.role === "admin" && body.status) {
      listing.status = body.status;
    } else if (auth.role !== "admin") {
      listing.status = "pending";
    }

    await listing.save();

    if (listing.status === "pending" && !wasPending) {
      const recipients = [process.env.ADMIN_EMAIL, process.env.LISTING_PENDING_NOTIFY_EMAIL].filter(
        (item): item is string => Boolean(item && item.trim())
      );
      if (recipients.length) {
        await sendMail({
          to: recipients,
          subject: "Listing sent back to pending review",
          html: `
            <p>The listing <strong>${listing.title}</strong> is now pending review again.</p>
            <p><strong>City:</strong> ${listing.location}</p>
            <p><strong>Category:</strong> ${listing.category}</p>
            <p><strong>Subcategory:</strong> ${listing.subcategory}</p>
          `
        }).catch(() => undefined);
      }
    }

    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const listing = await Listing.findById(params.id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    // Allow deletion if the user is the owner OR is an admin
    if (listing.owner.toString() !== auth.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Listing.findByIdAndDelete(params.id);

    try {
      const { logActivity } = await import("@/lib/activity");
      await logActivity({
        type: "listing_deleted",
        title: "Listing deleted",
        description: `${listing.title} was successfully deleted by ${auth.name || auth.email}.`,
        actor: auth.id,
        actorName: auth.name,
        listing: listing._id.toString(),
        listingTitle: listing.title
      });
    } catch {
      // Activity logging fails silently if not present
    }

    return NextResponse.json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Deletion failed" }, { status: 500 });
  }
}
