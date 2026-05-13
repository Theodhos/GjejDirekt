import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUser } from "@/lib/auth";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { packet, price, listingId } = await request.json();

    if (!packet || !price || !listingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Payment integration disabled temporarily
    return NextResponse.json({ 
      message: "Payments are currently disabled for maintenance.",
      clientSecret: "placeholder_secret" 
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
