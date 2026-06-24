import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StatisticPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== 'admin') {
    // only admins can view admin console
    redirect('/login');
  }

  // Redirect to the existing admin console page
  redirect('/admin');
}
