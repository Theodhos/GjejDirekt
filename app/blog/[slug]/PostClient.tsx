"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Facebook, Share2, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export default function PostClient({ post }: { post: any }) {
  const { language } = useLanguage();
  const t = translations[language];

  const image = post.coverImage || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=80";
  const [formattedDate, setFormattedDate] = useState("");
  const [articleUrl, setArticleUrl] = useState("");

  useEffect(() => {
    try {
      const locale = language === "en" ? "en-US" : "sq-AL";
      const d = new Date(post.createdAt);
      setFormattedDate(d.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" }));
    } catch {
      setFormattedDate("");
    }
  }, [language, post.createdAt]);

  useEffect(() => {
    setArticleUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const shareLabel = language === "en" ? "Share" : "Shperndaje";

  const paragraphs = useMemo(() => {
    return String(post.content || "")
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [post.content]);

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <article className="pb-16 sm:pb-20">
        <header className="page-shell pt-12 sm:pt-16">
          <div className="mx-auto text-center">
            <p className="eyebrow mb-5">{t.blog.journalEntry}</p>

            <h1
              className="display-font mx-auto max-w-[1040px] font-bold tracking-normal"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2.35rem, 6vw, 5.2rem)",
                lineHeight: 0.98
              }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className="mx-auto mt-6 max-w-[760px] text-base leading-relaxed sm:text-xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {post.excerpt}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                <UserRound className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                {post.author?.name || t.blog.authorEditor}
              </span>
              {formattedDate && (
                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  <CalendarDays className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                  {formattedDate}
                </span>
              )}
            </div>
          </div>

          <div
            className="relative mt-10 overflow-hidden sm:mt-12 aspect-[16/10] sm:aspect-video rounded-3xl border shadow-xl"
            style={{
              borderColor: "var(--border-soft)",
            }}
          >
            <SafeImage
              src={image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1200px, 100vw"
              priority
            />
          </div>
        </header>

        <div className="page-shell mt-8 sm:mt-10">
          <div className="mx-auto max-w-[820px]">
            <div className="space-y-7">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[1.04rem] leading-8 sm:text-lg sm:leading-9"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p
                  className="text-[1.04rem] leading-8 sm:text-lg sm:leading-9"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {post.content}
                </p>
              )}
            </div>

            <div
              className="mt-12 flex flex-col gap-5 border-t pt-7 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand-600"
                style={{ color: "var(--text-primary)" }}
              >
                <ArrowLeft className="h-4 w-4" />
                {t.blog.allStories}
              </Link>

              <div className="flex items-center gap-2.5">
                <span className="mr-1 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--text-tertiary)" }}>
                  {shareLabel}
                </span>
                <ShareLink href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </ShareLink>
                <ShareLink href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} label="X">
                  X
                </ShareLink>
                <ShareLink href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${articleUrl}`)}`} label="WhatsApp">
                  <Share2 className="h-4 w-4" />
                </ShareLink>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

function ShareLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--surface-white)",
        border: "1px solid var(--border-medium)",
        color: "var(--text-primary)"
      }}
    >
      {children}
    </a>
  );
}
