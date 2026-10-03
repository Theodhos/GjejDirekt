import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { canCreateListing, getAuthUser } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { logActivity } from "@/lib/activity";
import { escapeRegex, slugify } from "@/lib/utils";
import { apiError } from "@/lib/api";
import { getCategorySearchValues, getSubcategorySearchValues, type ListingAction } from "@/lib/constants";
import { listingSearchText, matchesQuery } from "@/lib/listing-display";
import { withMenuTerms } from "@/lib/food-server";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { rankListings } from "@/lib/ranking";

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

/** Keeps only valid action values, deduped — an empty result just falls back to the category default. */
function parseActions(value: unknown): ListingAction[] {
  const list = Array.isArray(value) ? value : [];
  return Array.from(
    new Set(list.filter((item): item is ListingAction => item === "porosi" || item === "rezervim"))
  );
}

function parseCoordinates(body: Record<string, unknown>) {
  const lat = parseMaybeNumber(body.coordinatesLat ?? body["coordinates.lat"] ?? body.lat);
  const lng = parseMaybeNumber(body.coordinatesLng ?? body["coordinates.lng"] ?? body.lng);
  if (lat === undefined || lng === undefined) return undefined;
  return { lat, lng };
}

async function buildQuery(url: URL) {
  const search = url.searchParams.get("q")?.trim();
  const category = url.searchParams.get("category")?.trim();
  const subcategory = url.searchParams.get("subcategory")?.trim();
  const location = url.searchParams.get("location")?.trim();
  const country = url.searchParams.get("country")?.trim();
  const minPrice = url.searchParams.get("minPrice")?.trim();
  const maxPrice = url.searchParams.get("maxPrice")?.trim();
  const minRating = url.searchParams.get("minRating")?.trim();
  const featured = url.searchParams.get("featured") === "true";
  const verifiedOnly = url.searchParams.get("verified") === "true";
  const sort = url.searchParams.get("sort") || "latest";

  const query: Record<string, unknown> = { status: "approved" };
  if (category) query.category = { $in: getCategorySearchValues(category) };
  if (subcategory) query.subcategory = { $in: getSubcategorySearchValues(category || undefined, subcategory) };
  if (location) query.location = { $regex: escapeRegex(location), $options: "i" };
  if (country) query.country = { $regex: escapeRegex(country), $options: "i" };
  if (featured) query.featured = true;
  if (verifiedOnly) query.verified = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
  }
  if (minRating) {
    query.ratingAverage = { $gte: Number(minRating) };
  }

  const sortQuery: Record<string, 1 | -1> =
    sort === "popular"
      ? { views: -1, createdAt: -1 }
      : sort === "name"
        ? { title: 1 }
        : { createdAt: -1 };
  return { query, sortQuery, sort, search };
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const { query, sortQuery, sort, search } = await buildQuery(url);
    let listings = await Listing.find(query).sort(sortQuery).populate("owner", "name email role").lean<any>();

    if (search) {
      // The same matching the full results page uses: every word of the query has to
      // show up somewhere — in the business's own text, in its category/subcategory
      // (value, label or alias, so "food" or "krepa" find it however it's filed), or
      // in what it actually sells. Word order, plurals and missing diacritics don't
      // matter, so "krepa te embla" finds a business whose description says "krepa
      // të ëmbla" and "krepat" still finds every business whose subcategory is "krepa".
      listings = await withMenuTerms(listings);
      listings = listings.filter((listing: any) => {
        const items = listing.menuItems || [];
        const menuText = items.map((item: any) => `${item.n} ${item.d || ""} ${item.s || ""}`).join(" ");
        return matchesQuery(`${listingSearchText(listing)} ${menuText}`, search);
      });
    }

    // Paid packages rank first, then WhatsApp engagement, then newest — but an
    // explicit sort choice from the user wins over the promotion ranking.
    const sorted = sort === "popular" || sort === "name" ? listings : rankListings(listings);

    return NextResponse.json({ listings: sorted });
  } catch (error) {
    return apiError("Failed to load listings", 500, error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // Defense in depth — the add-listing pages already redirect a "klient" account away.
    if (!canCreateListing(auth)) {
      return NextResponse.json({ error: "Client accounts cannot create a business listing." }, { status: 403 });
    }

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
      actions: parseActions(body.actions),
      location: body.location,
      country: body.country || "",
      address: body.address || "",
      bannerImage: body.bannerImage || "",
      photos: Array.isArray(body.photos) ? body.photos : parseList(body.photos),
      images: Array.isArray(body.images) ? body.images : [],
      price: parseMaybeNumber(body.price),
      priceFrom: parseMaybeNumber(body.priceFrom),
      currency: body.currency || "€",
      priceRange: body.priceRange || "",
      duration: body.duration || "",
      difficulty: body.difficulty || "",
      season: body.season || "",
      maxParticipants: parseMaybeNumber(body.maxParticipants),
      minAge: parseMaybeNumber(body.minAge),
      childPrice: parseMaybeNumber(body.childPrice),
      whatToBring: Array.isArray(body.whatToBring) ? body.whatToBring : parseList(body.whatToBring),
      cuisines: Array.isArray(body.cuisines) ? body.cuisines : parseList(body.cuisines),
      languages: Array.isArray(body.languages) ? body.languages : parseList(body.languages),
      businessHours: body.businessHours || "",
      whatsapp: body.whatsapp || "",
      website: body.website || "",
      checkIn: body.checkIn || "",
      checkOut: body.checkOut || "",
      menuLink: body.menuLink || "",
      tips: body.tips || "",
      eventDate: body.eventDate || "",
      eventTime: body.eventTime || "",
      bookingLink: body.bookingLink || "",
      transportType: body.transportType || "",
      contactInfo: {
        phone: body.contactPhone || "",
        email: body.contactEmail || "",
        website: body.website || ""
      },
      socialLinks: {
        instagram: body.instagramLink || "",
        facebook: body.facebookLink || "",
        tiktok: body.tiktok || "",
        youtube: body.youtube || "",
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
    return apiError("Failed to create listing", 500, error);
  }
}
