import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import Payment from "@/models/Payment";
import { sendFreePackageInvoiceEmail } from "@/lib/mail";

// The Free package involves no payment. When a user starts it we simply send
// them an invoice-style confirmation email with the package details and price.
const FREE_PACKAGE = {
  al: {
    name: "Falas",
    features: [
      "1 listing biznesi",
      "Emrin dhe përshkrimin e biznesit",
      "Galeri fotosh",
      "Numër telefoni",
      "WhatsApp",
      "Website & rrjete sociale",
      "Vendndodhje dhe Directions",
      "Tags",
      "Shfaqje në rezultatet e kërkimit"
    ]
  },
  en: {
    name: "Free",
    features: [
      "1 business listing",
      "Business name and description",
      "Photo gallery",
      "Phone number",
      "WhatsApp",
      "Website & social media",
      "Location and Directions",
      "Tags",
      "Appear in search results"
    ]
  }
} as const;

export async function POST(req: Request) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let language: "al" | "en" = "al";
  let listingId = "";
  try {
    const body = await req.json();
    if (body?.language === "en") language = "en";
    if (typeof body?.listingId === "string") listingId = body.listingId;
  } catch {
    // No body / invalid JSON — default to Albanian.
  }

  await connectDB();

  // If a service was passed (and the user owns it), bind the package to it.
  const listing = listingId
    ? await Listing.findOne({ _id: listingId, owner: auth.id })
    : null;

  const pkg = FREE_PACKAGE[language];

  // Record the free package so it shows up in the user's payments history.
  await Payment.create({
    user: auth.id,
    userName: auth.name || auth.email,
    userEmail: auth.email,
    listing: listing?._id,
    listingTitle: listing?.title,
    packet: "free",
    packageName: pkg.name,
    amount: 0,
    currency: "EUR",
    verificationStatus: "none"
  });

  try {
    await sendFreePackageInvoiceEmail({
      userName: auth.name || auth.email,
      userEmail: auth.email,
      packageName: pkg.name,
      price: 0,
      features: [...pkg.features],
      language,
      serviceName: listing?.title
    });
  } catch (err) {
    console.error("Failed to send free package invoice email:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
