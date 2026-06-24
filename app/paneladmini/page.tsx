import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelAdminiPage() {
  const auth = await getAuthUser();
  if (!auth) {
    // require login to view personal panel
    redirect('/login');
  }

  // Show personal dashboard/profile — redirect to existing dashboard page
  redirect('/dashboard');
}
