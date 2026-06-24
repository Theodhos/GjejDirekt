"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const heroPost = posts[0];
  const blogFallbacks = t.blog.fallbacks || [];

  return (
    <main style={{ background: "var(--surface-page)" }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}
      >
        {/* Subtle ambient blobs – exactly like Stay Directory */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full" style={{ background: "rgba(34,153,120,0.05)", filter: "blur(100px)" }} />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-[360px] h-[360px] rounded-full" style={{ background: "rgba(34,153,120,0.04)", filter: "blur(80px)" }} />

        <div className="page-shell relative z-10 pt-20 pb-20 text-center">
          <p className="eyebrow mb-4">{t.blog.journalLabel}</p>
          <h1
            className="font-bold tracking-tight mb-5"
            style={{ fontSize: "clamp(2.25rem, 7vw, 4rem)", color: "var(--text-primary)", lineHeight: 1.08 }}
          >
            {t.blog.heroTitle}
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.blog.heroDesc}
          </p>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="page-shell py-16 sm:py-20">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">{t.blog.archiveTitle}</p>
            <h2
              className="font-bold tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.12 }}
            >
              {t.blog.latestPub}
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(loading ? Array.from({ length: 6 }) : (posts.length > 0 ? posts : blogFallbacks)).map(
            (post: any, idx) => (
              <article
                key={idx}
                className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--surface-white)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-card)"
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(47,41,38,0.08)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)";
                }}
              >
                {/* Image */}
                {loading ? (
                  <div className="aspect-[4/3] animate-pulse" style={{ background: "var(--surface-subtle)" }} />
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[4/3] overflow-hidden block"
                    style={{ borderRadius: "16px 16px 0 0" }}
                  >
                    <Image
                      src={post.coverImage || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-3 rounded animate-pulse w-1/3" style={{ background: "var(--surface-subtle)" }} />
                      <div className="h-5 rounded animate-pulse w-full" style={{ background: "var(--surface-subtle)" }} />
                      <div className="h-16 rounded animate-pulse w-full" style={{ background: "var(--surface-subtle)" }} />
                    </div>
                  ) : (
                    <>
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="flex items-center gap-1.5 text-[11px] font-semibold"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          <Calendar className="w-3 h-3" />
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString(
                                language === "en" ? "en-US" : "sq-AL",
                                { month: "short", day: "numeric", year: "numeric" }
                              )
                            : t.blog.recently}
                        </span>
                        <span style={{ color: "var(--border-medium)" }}>·</span>
                        <span
                          className="flex items-center gap-1.5 text-[11px] font-semibold"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          <User className="w-3 h-3" />
                          {post.author?.name || t.blog.authorEditor}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base font-semibold leading-snug mb-2 line-clamp-2 transition-colors duration-200"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors"
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-accent)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                        >
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="text-sm leading-relaxed line-clamp-2 mb-5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {post.excerpt}
                      </p>

                      {/* CTA */}
                      <div className="mt-auto pt-4" style={{ borderTop: "1px solid var(--border-soft)" }}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all"
                          style={{ color: "var(--brand-accent)" }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.color = "var(--brand-hover)";
                            (e.currentTarget as HTMLElement).style.gap = "10px";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.color = "var(--brand-accent)";
                            (e.currentTarget as HTMLElement).style.gap = "";
                          }}
                        >
                          {t.blog.readStory}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </article>
            )
          )}
        </div>

        {/* Load More */}
        <div className="mt-14 flex justify-center">
          <button
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3 text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: "var(--brand-accent)", boxShadow: "0 2px 12px rgba(34,153,120,0.22)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}
          >
            {t.blog.loadMore}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
