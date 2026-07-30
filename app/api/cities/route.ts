import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getVillagesForCity, normalizeCityName, seedCities } from "@/lib/cities-catalog";
import { loadRankedCities } from "@/lib/cities-server";
import City from "@/models/City";
import Listing from "@/models/Listing";
import HiddenCity from "@/models/HiddenCity";

export async function GET() {
  try {
    // Ranked by listing count so "Popular destinations" is ordered everywhere.
    const merged = await loadRankedCities();

    return NextResponse.json({ cities: merged });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load cities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    const label = String(body.label || "").trim();
    const country = String(body.country || "Albania").trim();
    const region = String(body.region || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();

    if (!label) return NextResponse.json({ error: "City name is required" }, { status: 400 });
    if (country !== "Albania") return NextResponse.json({ error: "Only Albania cities can be added from admin." }, { status: 400 });

    const value = normalizeCityName(label);
    if (!value) return NextResponse.json({ error: "Invalid city name" }, { status: 400 });

    const normalizedLabel = normalizeCityName(label);
    const existsInSeed = seedCities.some(
      (c) =>
        normalizeCityName(c.value) === normalizedLabel ||
        normalizeCityName(c.label) === normalizedLabel
    );
    const existsCustom = await City.findOne({
      $or: [{ value }, { label: new RegExp(`^${label}$`, "i") }]
    });
    if (existsInSeed || existsCustom) {
      return NextResponse.json({ error: "City already exists." }, { status: 409 });
    }

    const city = await City.create({
      value,
      label,
      region: region || "Albania",
      description: description || `Services and experiences in ${label}.`,
      image: image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      country: "Albania",
      villages: getVillagesForCity(label, "Albania"),
      source: "admin"
    });

    return NextResponse.json({ city }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to add city" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    const value = String(body.value || "").trim().toLowerCase();
    if (!value) return NextResponse.json({ error: "City value is required" }, { status: 400 });

    const currentCity = await City.findOne({ value }).lean<any>();
    const seedCity = seedCities.find((c) => c.value.toLowerCase() === value);
    if (!currentCity && !seedCity) return NextResponse.json({ error: "City not found." }, { status: 404 });

    const label = String(body.label || currentCity?.label || seedCity?.label || "").trim();
    const region = String(body.region ?? currentCity?.region ?? seedCity?.region ?? "Albania").trim();
    const description = String(body.description ?? currentCity?.description ?? seedCity?.description ?? "").trim();
    const image = String(body.image ?? currentCity?.image ?? seedCity?.image ?? "").trim();

    if (!label) return NextResponse.json({ error: "City name is required" }, { status: 400 });

    const duplicate = await City.findOne({
      value: { $ne: value },
      label: new RegExp(`^${label}$`, "i")
    });
    if (duplicate) return NextResponse.json({ error: "Another city already uses this name." }, { status: 409 });

    const city = await City.findOneAndUpdate(
      { value },
      {
        $set: {
          value,
          label,
          region: region || "Albania",
          description: description || `Services and experiences in ${label}.`,
          image: image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          country: "Albania",
          villages: currentCity?.villages?.length
            ? currentCity.villages
            : seedCity?.villages || getVillagesForCity(label, "Albania"),
          source: "admin"
        }
      },
      { new: true, upsert: true, runValidators: true }
    ).lean<any>();

    return NextResponse.json({ city });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update city" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const url = new URL(request.url);
    const value = String(url.searchParams.get("value") || "").trim().toLowerCase();
    if (!value) return NextResponse.json({ error: "City value is required" }, { status: 400 });

    const city = await City.findOne({ value });
    const seedCity = seedCities.find((c) => c.value.toLowerCase() === value);
    if (!city && !seedCity) return NextResponse.json({ error: "City not found." }, { status: 404 });

    const cityLabel = String(city?.label || seedCity?.label || "").trim();
    if (city) {
      await City.deleteOne({ _id: city._id });
    }
    await HiddenCity.updateOne({ value }, { $set: { value } }, { upsert: true });

    const deletedListings = await Listing.deleteMany({
      location: { $regex: `^${cityLabel}$`, $options: "i" }
    });

    return NextResponse.json({
      success: true,
      deletedCity: cityLabel,
      deletedListings: deletedListings.deletedCount || 0
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete city" }, { status: 500 });
  }
}

