import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import BlogPost from "@/models/BlogPost";
import AdminBlogsClient from "@/components/dashboard/AdminBlogsClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();

  const page = parseInt((searchParams && searchParams.page) || "1", 10) || 1;
  const perPage = 12;

  const [total, posts] = await Promise.all([
    BlogPost.countDocuments(),
    BlogPost.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("author", "name")
      .lean<any[]>()
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <AdminBlogsClient
      posts={safeJson(posts)}
      page={page}
      total={total}
      perPage={perPage}
      totalPages={totalPages}
    />
  );
}
