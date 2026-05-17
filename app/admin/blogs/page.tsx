import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();
  const posts = await BlogPost.find().sort({ createdAt: -1 }).populate("author", "name").lean<any[]>();

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="surface p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <p className="eyebrow">Admin blogs</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">All uploaded blog posts</h1>
            <p className="mt-2 text-sm text-slate-600">Click any card to open the full blog page.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={String(post._id)}
              href={`/blog/${post.slug}`}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US") : ""}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950 line-clamp-2">{post.title}</h2>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
              <p className="mt-4 text-xs text-slate-500">By {post.author?.name || "Editor"}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
