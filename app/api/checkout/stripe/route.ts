import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { packet, price, listingId } = await request.json();

    if (!packet || !price || !listingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(price) * 100), // Stripe expects cents
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: auth.id,
        listingId,
        packet,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
