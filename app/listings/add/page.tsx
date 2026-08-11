import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import AddListingShell from "@/components/listings/AddListingShell";

export default async function AddListingPage() {
  const auth = await getAuthUser();
  // No account yet? Register first, then land straight on the category picker.
  if (!auth) {
    redirect(`/register?redirect=${encodeURIComponent("/create-listing")}`);
  }

  return <AddListingShell />;
}
