import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Listing from "@/models/Listing";
import UserPaymentsTable, { type PaymentRow } from "@/components/dashboard/UserPaymentsTable";
import { PACKAGE_CATALOG, listingActivePackages, normalizePackageKey } from "@/lib/packages";

export const dynamic = "force-dynamic";

export default async function DashboardPaymentsPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();

  const [payments, listings] = await Promise.all([
    Payment.find({ user: auth.id }).sort({ createdAt: -1 }).lean<any[]>(),
    Listing.find({ owner: auth.id })
      .select("title slug verified package packagePurchaseDate packageExpiryDate")
      .sort({ createdAt: -1 })
      .lean<any[]>()
  ]);

  const listingById = new Map(listings.map((item: any) => [item._id.toString(), item]));
  const rows = new Map<string, PaymentRow>();

  // 1) Transaction history — what the user actually requested or paid for.
  payments.forEach((p: any) => {
    const packageKey = normalizePackageKey(p.packet) || normalizePackageKey(p.packageName);
    const listing = p.listing ? listingById.get(p.listing.toString()) : null;
    const definition = packageKey ? PACKAGE_CATALOG[packageKey] : null;
    const amount = p.amount ?? 0;
    const key = packageKey && listing ? `${listing._id.toString()}:${packageKey}` : `payment:${p._id.toString()}`;

    rows.set(key, {
      id: p._id.toString(),
      packageKey,
      packageName: p.packageName || p.packet || "",
      listingTitle: p.listingTitle || listing?.title || "",
      listingSlug: listing?.slug || "",
      amount,
      currency: p.currency || definition?.currency || "EUR",
      billing: definition?.billing || null,
      date: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      expiresAt: null,
      status:
        p.verificationStatus === "pending"
          ? "pending"
          : amount === 0
            ? "free"
            : p.verificationStatus === "approved"
              ? "approved"
              : "paid"
    });
  });

  // 2) Packages an admin has granted — the same truth the admin panel edits.
  //    These override the matching history row so a package is never listed twice.
  const now = Date.now();
  listings.forEach((listing: any) => {
    listingActivePackages(listing).forEach((packageKey) => {
      const definition = PACKAGE_CATALOG[packageKey];
      const isRecurring = packageKey === "ads" || packageKey === "ads-pro";
      const key = `${listing._id.toString()}:${packageKey}`;
      const existing = rows.get(key);
      const startedAt =
        isRecurring && listing.packagePurchaseDate
          ? new Date(listing.packagePurchaseDate).toISOString()
          : null;
      const expiresAt =
        isRecurring && listing.packageExpiryDate ? new Date(listing.packageExpiryDate).toISOString() : null;
      const expired = Boolean(expiresAt && new Date(expiresAt).getTime() < now);

      rows.set(key, {
        id: existing?.id || key,
        packageKey,
        packageName: definition.label.en,
        listingTitle: listing.title || "",
        listingSlug: listing.slug || "",
        amount: existing && existing.amount > 0 ? existing.amount : definition.price,
        currency: existing?.currency || definition.currency,
        billing: definition.billing,
        date: startedAt || existing?.date || null,
        expiresAt,
        status: expired ? "expired" : "active"
      });
    });
  });

  const serialized = Array.from(rows.values()).sort((a, b) => {
    const left = a.date ? new Date(a.date).getTime() : 0;
    const right = b.date ? new Date(b.date).getTime() : 0;
    return right - left;
  });

  return (
    <section className="page-shell py-10">
      <UserPaymentsTable rows={serialized} />
    </section>
  );
}
