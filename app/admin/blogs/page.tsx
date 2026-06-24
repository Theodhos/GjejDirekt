import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

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
    <section className="page-shell py-6 sm:py-8">
      <div className="surface p-4 sm:p-6">
        <div className="flex items-start gap-4 mb-4">
          <Link href="/admin" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <p className="eyebrow">Admin blogs</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">All uploaded blog posts</h1>
            <p className="mt-1 text-sm text-slate-600">Compact view — page {page} of {totalPages}. Click a card to open the live blog.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <Link
              key={String(post._id)}
              href={`/blog/${post.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-lg h-44 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${post.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US") : ""}
                </span>
              </div>
              <h2 className="mt-2 text-sm font-black text-slate-950 line-clamp-2 flex-1">{post.title}</h2>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{post.excerpt}</p>
              <p className="mt-2 text-xs text-slate-500">By {post.author?.name || "Editor"}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total} posts</div>
          <div className="flex items-center gap-2">
            <Pagination current={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pagination({ current, totalPages }: { current: number; totalPages: number }) {
  const makeHref = (p: number) => `/admin/blogs?page=${p}`;

  const range = [] as number[];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  for (let i = start; i <= end; i++) range.push(i);

  return (
    <nav className="inline-flex items-center gap-2">
      <Link
        href={makeHref(Math.max(1, current - 1))}
        className={`px-3 py-1 rounded-md border ${current === 1 ? 'opacity-50 pointer-events-none' : ''}`}
      >
        Prev
      </Link>
      {start > 1 && (
        <>
          <Link href={makeHref(1)} className="px-3 py-1 rounded-md border">1</Link>
          {start > 2 && <span className="px-2">…</span>}
        </>
      )}
      {range.map((p) => (
        <Link key={p} href={makeHref(p)} className={`px-3 py-1 rounded-md border ${p === current ? 'bg-slate-900 text-white' : ''}`}>
          {p}
        </Link>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2">…</span>}
          <Link href={makeHref(totalPages)} className="px-3 py-1 rounded-md border">{totalPages}</Link>
        </>
      )}
      <Link
        href={makeHref(Math.min(totalPages, current + 1))}
        className={`px-3 py-1 rounded-md border ${current === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
      >
        Next
      </Link>
    </nav>
  );
}
