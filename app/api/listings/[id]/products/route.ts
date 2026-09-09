import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import Product from "@/models/Product";
import { isObjectId } from "@/lib/utils";

/**
 * Lists the products/menu items a business has published.
 *
 * The owner (and admins) see everything, including items marked unavailable, so
 * they can manage their menu. Everyone else only sees available items — those
 * are the only ones that should ever reach the public "order" cart.
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const or: Record<string, string>[] = [{ slug: params.id }];
    if (isObjectId(params.id)) or.unshift({ _id: params.id });
    const listing = await Listing.findOne({ $or: or }).select("_id owner").lean<any>();
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const auth = await getAuthUser();
    const canManage = Boolean(auth && (auth.role === "admin" || auth.id === listing.owner?.toString()));

    const query: Record<string, unknown> = { listing: listing._id };
    if (!canManage) query.available = true;

    const products = await Product.find(query).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ products });
  } catch (error) {
    return apiError("Failed to load products", 500, error);
  }
}

function parseMaybeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseMaybeNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined;
}

/** Creates a menu item. Only the listing's owner or an admin can publish one. */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!isObjectId(params.id)) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    await connectDB();
    const listing = await Listing.findById(params.id).select("_id owner").lean<any>();
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    if (listing.owner?.toString() !== auth.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const name = parseMaybeString(body.name);
    if (!name) return NextResponse.json({ error: "Product name is required" }, { status: 400 });

    const product = await Product.create({
      listing: listing._id,
      owner: listing.owner,
      name,
      description: parseMaybeString(body.description),
      price: parseMaybeNumber(body.price),
      image: parseMaybeString(body.image) || undefined,
      menuCategory: parseMaybeString(body.menuCategory) || undefined,
      available: body.available === false ? false : true,
      order: parseMaybeNumber(body.order) ?? 0
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return apiError("Failed to create product", 500, error);
  }
}
