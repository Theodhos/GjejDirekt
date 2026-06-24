"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound, Share2, Bookmark, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useEffect, useState } from "react";

export default function PostClient({ post }: { post: any }) {
  const { language } = useLanguage();
  const t = translations[language];

  const image = post.coverImage || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=80";
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    try {
      const locale = language === "en" ? "en-US" : "sq-AL";
      const d = new Date(post.createdAt);
      setFormattedDate(d.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" }));
    } catch {
      setFormattedDate("");
    }
  }, [language, post.createdAt]);

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── Slim breadcrumb nav ── */}
      <div style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-white)" }}>
        <div className="page-shell flex items-center justify-between py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-600"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog.allStories}
          </Link>
          <div className="flex items-center gap-1">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-neutral-100"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-neutral-100"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <article className="pb-20">

        {/* ── Article Header ── */}
        <header
          className="relative overflow-hidden"
          style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}
        >
          {/* Subtle ambient blob */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full"
            style={{ background: "rgba(34,153,120,0.05)", filter: "blur(90px)" }}
          />

          <div className="page-shell relative z-10 max-w-3xl mx-auto pt-14 pb-14 text-center">
            {/* Label */}
            <div className="mb-5 inline-flex">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "var(--surface-white)",
                  border: "1px solid var(--border-medium)",
                  color: "var(--text-secondary)"
                }}
              >
                {t.blog.journalEntry}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-bold tracking-tight mb-6"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                color: "var(--text-primary)",
                lineHeight: 1.1
              }}
            >
              {post.title}
            </h1>

            {/* Meta — author + date */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
                >
                  <UserRound className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {post.author?.name || t.blog.authorEditor}
                </span>
              </div>
              {formattedDate && (
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
                  >
                    <CalendarDays className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {formattedDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Cover Image ── */}
        <div className="page-shell mt-8">
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "16px",
              aspectRatio: "16/7",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-panel)"
            }}
          >
            <Image
              src={image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Article Body ── */}
        <div className="page-shell max-w-2xl mx-auto mt-10">

          {/* Excerpt / Pull quote */}
          {post.excerpt && (
            <div
              className="mb-8 pl-5 py-1"
              style={{ borderLeft: "3px solid var(--brand-accent)" }}
            >
              <p
                className="text-base sm:text-lg leading-relaxed font-medium italic"
                style={{ color: "var(--text-secondary)" }}
              >
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div
            className="text-base leading-relaxed whitespace-pre-line"
            style={{ color: "var(--text-secondary)" }}
          >
            {post.content}
          </div>

          {/* ── Share / Explore More ── */}
          <div
            className="mt-16 rounded-2xl p-7"
            style={{
              background: "var(--surface-white)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              {/* Left: author block */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: "var(--brand-accent)" }}
                >
                  {(post.author?.name || "E")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-0.5" style={{ color: "var(--text-tertiary)" }}>
                    {t.blog.authorEditor}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {post.author?.name || t.blog.authorEditor}
                  </p>
                </div>
              </div>

              {/* Right: share buttons */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] mr-1" style={{ color: "var(--text-tertiary)" }}>
                  Share
                </span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank" rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-colors hover:bg-neutral-100"
                  style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                >
                  f
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(post.title)}`}
                  target="_blank" rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-colors hover:bg-neutral-100"
                  style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                >
                  𝕏
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                  target="_blank" rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-colors hover:bg-neutral-100"
                  style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>


          {/* Back link */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-600"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t.blog.allStories}
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
