import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
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
  try {
    const body = await req.json();
    if (body?.language === "en") language = "en";
  } catch {
    // No body / invalid JSON — default to Albanian.
  }

  const pkg = FREE_PACKAGE[language];

  try {
    await sendFreePackageInvoiceEmail({
      userName: auth.name || auth.email,
      userEmail: auth.email,
      packageName: pkg.name,
      price: 0,
      features: [...pkg.features],
      language
    });
  } catch (err) {
    console.error("Failed to send free package invoice email:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
