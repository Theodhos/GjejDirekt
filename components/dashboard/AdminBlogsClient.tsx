"use client";

import SafeImage from "@/components/ui/SafeImage";
import { imageUrlError } from "@/lib/images";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit3, ExternalLink, Save, Upload, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useLanguage } from "@/context/LanguageContext";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  author?: { name?: string };
};

type BlogDraft = {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
};

const fallbackImage = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80";

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Upload failed");
  return String(data.url || "");
}

export default function AdminBlogsClient({ posts, page, total, perPage, totalPages }: any) {
  const { t, language } = useLanguage();
  const adminText = t.admin as Record<string, string>;
  const commonText = t.common as Record<string, string>;
  const router = useRouter();
  const [items, setItems] = useState<BlogPost[]>(posts || []);
  const [editingId, setEditingId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<BlogDraft>({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: true
  });

  const showingText = adminText.showing || "Showing {start}-{end} of {total}";
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  function startEdit(post: BlogPost) {
    setEditingId(post._id);
    setSelectedFile(null);
    setDraft({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.coverImage || "",
      published: Boolean(post.published)
    });
  }

  function cancelEdit() {
    setEditingId("");
    setSelectedFile(null);
  }

  async function savePost(post: BlogPost) {
    setSavingId(post._id);
    try {
      const coverImage = selectedFile ? await uploadImage(selectedFile) : draft.coverImage;
      const response = await fetch(`/api/blog/${encodeURIComponent(post.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          coverImage
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update blog post");

      setItems((current) =>
        current.map((item) => (item._id === post._id ? { ...item, ...data.post } : item))
      );
      setEditingId("");
      setSelectedFile(null);
      toast.success(adminText.blogUpdated || "Blog post updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : commonText.error || "Something went wrong");
    } finally {
      setSavingId("");
    }
  }

  return (
    <section className="page-shell py-6 sm:py-8">
      <div className="surface p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/admin" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" aria-label="Back to admin">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="eyebrow">{adminText.blogsHeader || t.admin.blogs}</p>
              <h1 className="mt-2 text-2xl font-black text-slate-950">{adminText.blogsTitle || "All uploaded blog posts"}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {(adminText.blogsCompact || "Compact view - page {page} of {totalPages}.")
                  .replace("{page}", String(page))
                  .replace("{totalPages}", String(totalPages))}
              </p>
            </div>
          </div>
          <Button href="/admin#blog-studio" variant="ghost">
            {adminText.publishPost || "Add post"}
          </Button>
        </div>

        <div className="mt-6 grid gap-5 grid-cols-1 lg:grid-cols-2">
          {items.map((post) => {
            const isEditing = editingId === post._id;
            const previewImage = isEditing ? draft.coverImage || post.coverImage || fallbackImage : post.coverImage || fallbackImage;

            return (
              <article key={post._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="grid gap-0 md:grid-cols-[190px_1fr]">
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-full">
                    <SafeImage
                      src={previewImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 190px, 100vw"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${post.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                        {post.published ? (commonText.published || "Published") : (commonText.draft || "Draft")}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    {!isEditing ? (
                      <>
                        <h2 className="mt-3 text-base font-black text-slate-950 line-clamp-2">{post.title}</h2>
                        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                        <p className="mt-3 text-xs text-slate-500">{commonText.by || "By"} {post.author?.name || commonText.editor || t.blog.authorEditor}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button type="button" onClick={() => startEdit(post)} className="px-3 py-2">
                            <Edit3 className="h-4 w-4" />
                            {adminText.edit || "Edit"}
                          </Button>
                          <Button href={`/blog/${post.slug}`} variant="ghost" className="px-3 py-2">
                            <ExternalLink className="h-4 w-4" />
                            {adminText.view || "View"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <form
                        className="mt-4 space-y-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          savePost(post);
                        }}
                      >
                        <Input label={commonText.title || "Title"} value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} required />
                        <Input label={adminText.coverImage || "Cover image URL"} value={draft.coverImage} onChange={(event) => setDraft((current) => ({ ...current, coverImage: event.target.value }))} placeholder="https://..." error={imageUrlError(draft.coverImage, language === "en")} />
                        <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            {selectedFile ? selectedFile.name : adminText.uploadCover || "Upload new image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                          />
                        </label>
                        <Textarea label="Excerpt" value={draft.excerpt} onChange={(event) => setDraft((current) => ({ ...current, excerpt: event.target.value }))} required />
                        <Textarea label={adminText.content || "Content"} value={draft.content} onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))} className="min-h-56" required />
                        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={draft.published}
                            onChange={(event) => setDraft((current) => ({ ...current, published: event.target.checked }))}
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-sm font-medium text-slate-700">{adminText.publishImmediately || "Published"}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <Button type="submit" disabled={savingId === post._id}>
                            <Save className="h-4 w-4" />
                            {savingId === post._id ? (commonText.loading || "Saving...") : (adminText.saveChanges || "Save changes")}
                          </Button>
                          <Button type="button" variant="ghost" onClick={cancelEdit} disabled={savingId === post._id}>
                            <X className="h-4 w-4" />
                            {commonText.cancel || "Cancel"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            {showingText.replace("{start}", String(start)).replace("{end}", String(end)).replace("{total}", String(total))}
          </div>
          <nav className="inline-flex items-center gap-2">
            <Link href={`/admin/blogs?page=${Math.max(1, page - 1)}`} className={`px-3 py-1 rounded-md border ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}>
              {commonText.prev || "Previous"}
            </Link>
            <span className="px-3 py-1">{page}</span>
            <Link href={`/admin/blogs?page=${Math.min(totalPages, page + 1)}`} className={`px-3 py-1 rounded-md border ${page === totalPages ? "opacity-50 pointer-events-none" : ""}`}>
              {commonText.next || "Next"}
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
