import { redirect } from "next/navigation";
import { canCreateListing, getAuthUser } from "@/lib/auth";
import CreateListingClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  const auth = await getAuthUser();
  // Publishing a service needs an account — register first, then come straight back here.
  if (!auth) {
    redirect(`/register?redirect=${encodeURIComponent("/create-listing")}`);
  }
  // A "klient" account only browses and orders/reserves — adding a business is a
  // "biznes"-only action.
  if (!canCreateListing(auth)) {
    redirect("/?notice=business-only");
  }

  return <CreateListingClient />;
}
