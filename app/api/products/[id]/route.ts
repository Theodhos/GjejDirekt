import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Product from "@/models/Product";
import { isObjectId } from "@/lib/utils";

function parseMaybeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseMaybeNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined;
}

async function loadOwnedProduct(id: string, authId: string, isAdmin: boolean) {
  if (!isObjectId(id)) return { product: null, error: NextResponse.json({ error: "Product not found" }, { status: 404 }) };

  const product = await Product.findById(id);
  if (!product) return { product: null, error: NextResponse.json({ error: "Product not found" }, { status: 404 }) };

  if (product.owner.toString() !== authId && !isAdmin) {
    return { product: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { product, error: null };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { product, error } = await loadOwnedProduct(params.id, auth.id, auth.role === "admin");
    if (error) return error;

    const body = await request.json();
    if (typeof body.name === "string" && body.name.trim()) product!.name = parseMaybeString(body.name);
    if (typeof body.description === "string") product!.description = parseMaybeString(body.description);
    if ("price" in body) product!.price = parseMaybeNumber(body.price);
    if (typeof body.image === "string") product!.image = parseMaybeString(body.image) || undefined;
    if (typeof body.menuCategory === "string") product!.menuCategory = parseMaybeString(body.menuCategory) || undefined;
    if (typeof body.available === "boolean") product!.available = body.available;
    if ("order" in body) product!.order = parseMaybeNumber(body.order) ?? product!.order;

    await product!.save();
    return NextResponse.json({ product });
  } catch (error) {
    return apiError("Failed to update product", 500, error);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { product, error } = await loadOwnedProduct(params.id, auth.id, auth.role === "admin");
    if (error) return error;

    await Product.findByIdAndDelete(product!._id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError("Failed to delete product", 500, error);
  }
}
