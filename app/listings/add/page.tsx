import { redirect } from "next/navigation";
import { canCreateListing, getAuthUser } from "@/lib/auth";
import AddListingShell from "@/components/listings/AddListingShell";

export default async function AddListingPage() {
  const auth = await getAuthUser();
  // No account yet? Register first, then land straight on the category picker.
  if (!auth) {
    redirect(`/register?redirect=${encodeURIComponent("/create-listing")}`);
  }
  // A "klient" account only browses and orders/reserves — adding a business is a
  // "biznes"-only action.
  if (!canCreateListing(auth)) {
    redirect("/?notice=business-only");
  }

  return <AddListingShell />;
}
