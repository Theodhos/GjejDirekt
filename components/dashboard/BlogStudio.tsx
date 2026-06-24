"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

type BlogPreview = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt?: string | Date;
  author?: { name?: string };
};

export default function BlogStudio({ recentPosts }: { recentPosts: BlogPreview[] }) {
  const { t } = useLanguage();
  const blogText = t.blog as unknown as Record<string, string>;
  const commonText = t.common as Record<string, string>;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const stats = useMemo(
    () => [
      { label: t.admin.draftMode || "Draft mode", value: published ? (commonText.off || "Off") : (commonText.on || "On") },
      { label: t.admin.chars || "Chars", value: content.length.toString() },
      { label: t.admin.posts || "Posts", value: recentPosts.length.toString() }
    ],
    [commonText.off, commonText.on, content.length, published, recentPosts.length, t]
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage: coverImage || undefined,
          published
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      toast.success(published ? "Blog post published" : "Blog draft saved");
      setTitle("");
      setExcerpt("");
      setContent("");
      setCoverImage("");
      setPublished(true);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="blog-studio" className="surface p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.admin.blogStudio}</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{t.admin.blogPublishTitle || 'Publish blog content directly from admin'}</h2>
          <p className="mt-3 text-sm text-slate-600">{t.admin.blogPublishDesc || 'Add destination guides, travel stories, and editorial content without leaving the control panel.'}</p>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 lg:min-w-[340px]">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label={t.common.title || 'Title'} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={blogText.titlePlaceholder || 'The best coastal escapes...'} required />
            <Input
              label={t.admin.coverImage || 'Cover image URL'}
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
              placeholder={t.admin.coverImagePlaceholder || 'https://images.unsplash.com/...'}
            />
          </div>
          <Textarea
            label={blogText.excerptLabel || 'Excerpt'}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder={blogText.excerptPlaceholder || 'Short summary for cards and previews...'}
            required
          />
          <Textarea
            label={blogText.contentLabel || 'Content'}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={blogText.contentPlaceholder || 'Write the full article here...'}
            className="min-h-64"
            required
          />
          <label className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">{t.admin.publishImmediately || 'Publish immediately'}</span>
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? (t.common.loading || 'Saving...') : published ? (t.admin.publishPost || 'Publish post') : (t.admin.saveDraft || 'Save draft')}
          </Button>
        </form>
      </div>
    </section>
  );
}
