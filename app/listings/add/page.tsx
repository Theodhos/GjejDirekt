import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import AddListingShell from "@/components/listings/AddListingShell";

export default async function AddListingPage() {
  const auth = await getAuthUser();
  if (!auth) {
    redirect("/login");
  }

  return <AddListingShell />;
}
