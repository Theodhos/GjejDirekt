"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminBlogsClient({ posts, page, total, perPage, totalPages }: any) {
  const { t } = useLanguage();
  const adminText = t.admin as Record<string, string>;
  const commonText = t.common as Record<string, string>;
  const showingText = adminText.showing || "Showing {start}-{end} of {total}";

  return (
    <section className="page-shell py-6 sm:py-8">
      <div className="surface p-4 sm:p-6">
        <div className="flex items-start gap-4 mb-4">
          <div>
            <p className="eyebrow">{adminText.blogsHeader || t.admin.blogs}</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">{adminText.blogsTitle || "All uploaded blog posts"}</h1>
            <p className="mt-1 text-sm text-slate-600">{(adminText.blogsCompact || "Compact view - page {page} of {totalPages}.").replace("{page}", String(page)).replace("{totalPages}", String(totalPages))}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post: any) => (
            <Link
              key={String(post._id)}
              href={`/blog/${post.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-lg h-44 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${post.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                  {post.published ? (commonText.published || "Published") : (commonText.draft || "Draft")}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <h2 className="mt-2 text-sm font-black text-slate-950 line-clamp-2 flex-1">{post.title}</h2>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{post.excerpt}</p>
              <p className="mt-2 text-xs text-slate-500">{commonText.by || "By"} {post.author?.name || commonText.editor || t.blog.authorEditor}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">{showingText.replace("{start}", String((page - 1) * perPage + 1)).replace("{end}", String(Math.min(page * perPage, total))).replace("{total}", String(total))}</div>
          <div className="flex items-center gap-2">
            <nav className="inline-flex items-center gap-2">
              <Link href={`/admin/blogs?page=${Math.max(1, page - 1)}`} className={`px-3 py-1 rounded-md border ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}>{commonText.prev || "Previous"}</Link>
              <span className="px-3 py-1">{page}</span>
              <Link href={`/admin/blogs?page=${Math.min(totalPages, page + 1)}`} className={`px-3 py-1 rounded-md border ${page === totalPages ? 'opacity-50 pointer-events-none' : ''}`}>{commonText.next || "Next"}</Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
