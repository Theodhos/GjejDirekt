import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getVillagesForCity, normalizeCityName, seedCities } from "@/lib/cities-catalog";
import City from "@/models/City";
import Listing from "@/models/Listing";
import HiddenCity from "@/models/HiddenCity";

export async function GET() {
  try {
    await connectDB();
    const hidden = await HiddenCity.find().lean<any[]>();
    const hiddenSet = new Set(hidden.map((h) => String(h.value).toLowerCase()));
    const customCities = await City.find().sort({ label: 1 }).lean<any[]>();
    const visibleCustom = customCities.filter((c) => !hiddenSet.has(String(c.value).toLowerCase()));
    const customByValue = new Map(visibleCustom.map((c) => [String(c.value).toLowerCase(), c]));

    const merged = [
      ...seedCities.filter((c) => !customByValue.has(c.value.toLowerCase()) && !hiddenSet.has(c.value.toLowerCase())),
      ...visibleCustom
    ].sort((a, b) => String(a.label).localeCompare(String(b.label)));

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

