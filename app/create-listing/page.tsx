import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import CreateListingClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  const auth = await getAuthUser();
  // Publishing a service needs an account — register first, then come straight back here.
  if (!auth) {
    redirect(`/register?redirect=${encodeURIComponent("/create-listing")}`);
  }

  return <CreateListingClient />;
}
