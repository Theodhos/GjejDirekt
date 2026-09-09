"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  menuCategory?: string;
  available: boolean;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  menuCategory: string;
  available: boolean;
};

const EMPTY_FORM: FormState = { name: "", description: "", price: "", image: "", menuCategory: "", available: true };

export default function ProductManagerClient({
  listing,
  products
}: {
  listing: { _id: string; slug: string; title: string };
  products: Product[];
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<Product[]>(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: typeof product.price === "number" ? String(product.price) : "",
      image: product.image || "",
      menuCategory: product.menuCategory || "",
      available: product.available
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err: any) {
      toast.error(err.message || (en ? "Image upload failed" : "Ngarkimi i fotos dështoi"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error(en ? "Product name is required" : "Emri i produktit është i detyrueshëm");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price ? Number(form.price) : undefined,
        image: form.image || undefined,
        menuCategory: form.menuCategory.trim() || undefined,
        available: form.available
      };

      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");
        setItems((prev) => prev.map((item) => (item._id === editingId ? data.product : item)));
        toast.success(en ? "Product updated" : "Produkti u përditësua");
      } else {
        const res = await fetch(`/api/listings/${listing._id}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Create failed");
        setItems((prev) => [...prev, data.product]);
        toast.success(en ? "Product added" : "Produkti u shtua");
      }
      resetForm();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || (en ? "Something went wrong" : "Diçka shkoi keq"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      en ? `Delete "${product.name}"?` : `Të fshihet "${product.name}"?`
    );
    if (!confirmed) return;

    setDeletingId(product._id);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setItems((prev) => prev.filter((item) => item._id !== product._id));
      if (editingId === product._id) resetForm();
      toast.success(en ? "Product deleted" : "Produkti u fshi");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || (en ? "Delete failed" : "Fshirja dështoi"));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailable = async (product: Product) => {
    const nextAvailable = !product.available;
    setItems((prev) => prev.map((item) => (item._id === product._id ? { ...item, available: nextAvailable } : item)));
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: nextAvailable })
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setItems((prev) => prev.map((item) => (item._id === product._id ? { ...item, available: !nextAvailable } : item)));
      toast.error(en ? "Failed to update" : "Përditësimi dështoi");
    }
  };

  return (
    <div style={{ background: "var(--surface-page)" }} className="min-h-screen pb-16">
      <section style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell py-8 sm:py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {en ? "Back" : "Kthehu prapa"}
          </button>
          <p className="eyebrow mb-3">{en ? "Manage menu" : "Menaxho menunë"}</p>
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            {listing.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            {en
              ? "Add the food and drinks you sell. Visitors pick a quantity, add items to their basket, and send the order straight to your WhatsApp."
              : "Shtoni ushqimet dhe pijet që shisni. Vizitorët zgjedhin sasinë, i shtojnë në shportë dhe e dërgojnë porosinë direkt te WhatsApp-i juaj."}
          </p>
          <Link
            href={`/listings/${listing.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
            style={{ color: "var(--brand-accent)" }}
          >
            {en ? "View listing" : "Shiko listimin"} →
          </Link>
        </div>
      </section>

      <div className="page-shell mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-4 rounded-2xl p-6"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
        >
          <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            {editingId ? (en ? "Edit product" : "Modifiko produktin") : (en ? "Add a product" : "Shto produkt")}
          </h2>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {en ? "Name" : "Emri"} *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={en ? "e.g. Crêpe with Nutella" : "p.sh. Krep me Nutella"}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {en ? "Menu section" : "Kategoria e menusë"}
            </label>
            <input
              list="menu-category-suggestions"
              value={form.menuCategory}
              onChange={(e) => setForm((prev) => ({ ...prev, menuCategory: e.target.value }))}
              placeholder={en ? "e.g. Sweet crêpes" : "p.sh. Krepë të ëmbël"}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
            />
            <datalist id="menu-category-suggestions">
              {Array.from(new Set(items.map((item) => item.menuCategory).filter(Boolean))).map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {en
                ? "Groups items on the menu, e.g. \"Sweet crêpes\", \"Drinks\". Leave blank to keep it ungrouped."
                : "Grupon artikujt në menu, p.sh. \"Krepë të ëmbël\", \"Pije\". Lëreni bosh nëse s'doni grupim."}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {en ? "Description — what's in it" : "Përshkrimi — çfarë përmban"}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder={en ? "Ingredients, size, notes..." : "Përbërësit, madhësia, shënime..."}
              className="w-full resize-none rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {en ? "Price (Lekë)" : "Çmimi (Lekë)"}
            </label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="300"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {en ? "Photo" : "Foto"}
            </label>
            {form.image ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-xl">
                <SafeImage src={form.image} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:opacity-60"
                style={{ border: "1px dashed var(--border-medium)", color: "var(--text-tertiary)" }}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {uploading ? (en ? "Uploading..." : "Duke ngarkuar...") : (en ? "Upload image" : "Ngarko foto")}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
              className="h-4 w-4 rounded"
            />
            {en ? "Available to order" : "I disponueshëm për porosi"}
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--brand-accent)" }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {editingId ? (en ? "Save changes" : "Ruaj ndryshimet") : (en ? "Add product" : "Shto produktin")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-100"
                style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
              >
                {en ? "Cancel" : "Anulo"}
              </button>
            )}
          </div>
        </form>

        {/* ── List ── */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div
              className="rounded-2xl px-6 py-10 text-center"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {en ? "No products yet." : "Nuk ka ende produkte."}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {en ? "Add your first menu item using the form." : "Shtoni produktin tuaj të parë duke përdorur formularin."}
              </p>
            </div>
          ) : (
            items.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ background: "var(--surface-cream)" }}>
                  {product.image && <SafeImage src={product.image} alt={product.name} fill className="object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>{product.name}</p>
                    {product.menuCategory && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }}
                      >
                        {product.menuCategory}
                      </span>
                    )}
                    {!product.available && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{ background: "#FEE2E2", color: "#DC2626" }}
                      >
                        {en ? "Hidden" : "Fshehur"}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="line-clamp-1 text-xs" style={{ color: "var(--text-tertiary)" }}>{product.description}</p>
                  )}
                  {typeof product.price === "number" && (
                    <p className="mt-0.5 text-xs font-bold" style={{ color: "var(--brand-accent)" }}>{formatPrice(product.price)}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleAvailable(product)}
                    className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors hover:bg-neutral-100"
                    style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                  >
                    {product.available ? (en ? "Hide" : "Fshih") : (en ? "Show" : "Shfaq")}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
                    style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === product._id}
                    onClick={() => handleDelete(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50"
                    style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                  >
                    {deletingId === product._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
