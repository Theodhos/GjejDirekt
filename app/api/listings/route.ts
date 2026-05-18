import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";
import { categories, getCategorySearchValues, getSubcategorySearchValues } from "@/lib/constants";
import Listing from "@/models/Listing";
import User from "@/models/User";

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

function parseCoordinates(body: Record<string, unknown>) {
  const lat = parseMaybeNumber(body.coordinatesLat ?? body["coordinates.lat"] ?? body.lat);
  const lng = parseMaybeNumber(body.coordinatesLng ?? body["coordinates.lng"] ?? body.lng);
  if (lat === undefined || lng === undefined) return undefined;
  return { lat, lng };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQuery(url: URL) {
  const search = url.searchParams.get("q")?.trim();
  const category = url.searchParams.get("category")?.trim();
  const subcategory = url.searchParams.get("subcategory")?.trim();
  const location = url.searchParams.get("location")?.trim();
  const country = url.searchParams.get("country")?.trim();
  const minPrice = url.searchParams.get("minPrice")?.trim();
  const maxPrice = url.searchParams.get("maxPrice")?.trim();
  const minRating = url.searchParams.get("minRating")?.trim();
  const featured = url.searchParams.get("featured") === "true";
  const sort = url.searchParams.get("sort") || "latest";

  const query: Record<string, unknown> = { status: "approved" };
  if (category) query.category = { $in: getCategorySearchValues(category) };
  if (subcategory) query.subcategory = { $in: getSubcategorySearchValues(category || undefined, subcategory) };
  if (location) query.location = { $regex: location, $options: "i" };
  if (country) query.country = { $regex: country, $options: "i" };
  if (featured) query.featured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
  }
  if (minRating) {
    query.ratingAverage = { $gte: Number(minRating) };
  }
  if (search) {
    const normalizedSearch = search.toLowerCase();
    const searchRegex = new RegExp(escapeRegex(search), "i");
    const matchedCategories = categories
      .filter(
        (cat) =>
          cat.value.includes(normalizedSearch) ||
          cat.label.toLowerCase().includes(normalizedSearch) ||
          cat.aliases.some((alias) => alias.includes(normalizedSearch))
      )
      .map((cat) => cat.value);

    query.$or = [
      { title: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
      ...(matchedCategories.length ? [{ category: { $in: matchedCategories } }] : [])
    ];
  }

  const sortQuery: Record<string, 1 | -1> =
    sort === "popular" ? { views: -1, createdAt: -1 } : { createdAt: -1 };
  return { query, sortQuery };
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const { query, sortQuery } = buildQuery(url);
    const listings = await Listing.find(query).sort(sortQuery).populate("owner", "name email role").lean<any>();

    // Sort by package tier for better visibility
    const sorted = listings.sort((a: any, b: any) => {
      const packageOrder = { features: 0, trading: 1, verify: 2, null: 3 };
      const tierA = packageOrder[a.package as keyof typeof packageOrder] ?? 3;
      const tierB = packageOrder[b.package as keyof typeof packageOrder] ?? 3;

      if (tierA !== tierB) return tierA - tierB;

      // Within same tier, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ listings: sorted });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const title = String(body.title || "").trim();

    if (!title || !body.description || !body.category || !body.subcategory || !body.location || !body.contactPhone || !body.bannerImage) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    let slug = slugify(title);
    let counter = 1;
    while (await Listing.findOne({ slug })) {
      slug = `${slugify(title)}-${counter++}`;
    }

    const listing = await Listing.create({
      owner: auth.id,
      title,
      slug,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory,
      location: body.location,
      country: body.country || "",
      address: body.address || "",
      bannerImage: body.bannerImage || "",
      photos: Array.isArray(body.photos) ? body.photos : parseList(body.photos),
      images: Array.isArray(body.images) ? body.images : [],
      price: parseMaybeNumber(body.price),
      priceFrom: parseMaybeNumber(body.priceFrom),
      currency: body.currency || "€",
      businessHours: body.businessHours || "",
      contactInfo: {
        phone: body.contactPhone || "",
        email: body.contactEmail || "",
        website: body.website || ""
      },
      socialLinks: {
        instagram: body.instagramLink || "",
        facebook: body.facebookLink || "",
      },
      googleMapsLink: body.googleMapsLink || "",
      tags: Array.isArray(body.tags) ? body.tags : parseList(body.tags),
      amenities: Array.isArray(body.tags) ? body.tags : parseList(body.tags),
      status: "pending"
    });

    await logActivity({
      type: "listing_submitted",
      title: "New listing submitted",
      description: `${listing.title} is waiting for approval.`,
      actor: auth.id,
      actorName: auth.name,
      listing: listing._id.toString(),
      listingTitle: listing.title,
      meta: { category: listing.category, subcategory: listing.subcategory, location: listing.location }
    });

    const pendingRecipients = [process.env.ADMIN_EMAIL].filter(
      (item): item is string => Boolean(item && item.trim())
    );

    if (pendingRecipients.length) {
      const { sendListingSubmissionEmail } = await import("@/lib/mail");
      await sendListingSubmissionEmail({
        listingTitle: listing.title,
        listingId: listing._id.toString(),
        ownerName: auth.name || auth.email,
        category: listing.category,
        location: listing.location
      }).catch(err => console.error("Email send error:", err));
    }

    const owner = await User.findById(auth.id).lean<any>();
    return NextResponse.json({ listing, owner });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create listing" }, { status: 500 });
  }
}
