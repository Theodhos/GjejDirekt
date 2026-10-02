"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, BadgeCheck, Loader2, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";
import { defaultProductAction, getOfferKind, getProductAction, type OfferKind, type ProductAction } from "@/lib/business-offer";

type Bi = { en: string; sq: string };

/** What the catalog is called and how the form talks about it, per kind of business. */
const MANAGER_COPY: Record<
  OfferKind,
  {
    manage: Bi;
    intro: Bi;
    add: Bi;
    edit: Bi;
    namePlaceholder: Bi;
    section: Bi;
    sectionPlaceholder: Bi;
    sectionHint: Bi;
    emptyTitle: Bi;
    emptyText: Bi;
  }
> = {
  menu: {
    manage: { en: "Manage menu", sq: "Menaxho menunë" },
    intro: {
      en: "Add the food and drinks you sell. Visitors pick a quantity, add items to their basket, and send the order straight to your WhatsApp.",
      sq: "Shtoni ushqimet dhe pijet që shisni. Vizitorët zgjedhin sasinë, i shtojnë në shportë dhe e dërgojnë porosinë direkt te WhatsApp-i juaj."
    },
    add: { en: "Add a product", sq: "Shto produkt" },
    edit: { en: "Edit product", sq: "Modifiko produktin" },
    namePlaceholder: { en: "e.g. Crêpe with Nutella", sq: "p.sh. Krep me Nutella" },
    section: { en: "Menu section", sq: "Kategoria e menusë" },
    sectionPlaceholder: { en: "e.g. Sweet crêpes", sq: "p.sh. Krepë të ëmbël" },
    sectionHint: {
      en: "Groups items on the menu, e.g. \"Sweet crêpes\", \"Drinks\". Leave blank to keep it ungrouped.",
      sq: "Grupon artikujt në menu, p.sh. \"Krepë të ëmbël\", \"Pije\". Lëreni bosh nëse s'doni grupim."
    },
    emptyTitle: { en: "No products yet.", sq: "Nuk ka ende produkte." },
    emptyText: { en: "Add your first menu item using the form.", sq: "Shtoni produktin tuaj të parë duke përdorur formularin." }
  },
  rooms: {
    manage: { en: "Manage rooms", sq: "Menaxho dhomat" },
    intro: {
      en: "Add the rooms you offer with their price per night. Visitors pick a room, choose their dates, and send the booking request straight to your WhatsApp.",
      sq: "Shtoni dhomat që ofroni me çmimin për natë. Vizitorët zgjedhin dhomën, datat dhe e dërgojnë kërkesën për rezervim direkt te WhatsApp-i juaj."
    },
    add: { en: "Add a room", sq: "Shto dhomë" },
    edit: { en: "Edit room", sq: "Modifiko dhomën" },
    namePlaceholder: { en: "e.g. Double room with sea view", sq: "p.sh. Dhomë dyshe me pamje nga deti" },
    section: { en: "Room type", sq: "Lloji i dhomës" },
    sectionPlaceholder: { en: "e.g. Suites", sq: "p.sh. Suita" },
    sectionHint: {
      en: "Groups rooms on your page, e.g. \"Suites\", \"Standard\". Leave blank to keep them ungrouped.",
      sq: "Grupon dhomat në faqe, p.sh. \"Suita\", \"Standarde\". Lëreni bosh nëse s'doni grupim."
    },
    emptyTitle: { en: "No rooms yet.", sq: "Nuk ka ende dhoma." },
    emptyText: { en: "Add your first room using the form.", sq: "Shtoni dhomën tuaj të parë duke përdorur formularin." }
  },
  products: {
    manage: { en: "Manage products", sq: "Menaxho produktet" },
    intro: {
      en: "Add the products you sell. Visitors pick a quantity, add items to their basket, and send the order straight to your WhatsApp.",
      sq: "Shtoni produktet që shisni. Vizitorët zgjedhin sasinë, i shtojnë në shportë dhe e dërgojnë porosinë direkt te WhatsApp-i juaj."
    },
    add: { en: "Add a product", sq: "Shto produkt" },
    edit: { en: "Edit product", sq: "Modifiko produktin" },
    namePlaceholder: { en: "e.g. Running shoes", sq: "p.sh. Këpucë sportive" },
    section: { en: "Section", sq: "Kategoria" },
    sectionPlaceholder: { en: "e.g. Shoes", sq: "p.sh. Këpucë" },
    sectionHint: {
      en: "Groups products on your page, e.g. \"Shoes\", \"Bags\". Leave blank to keep them ungrouped.",
      sq: "Grupon produktet në faqe, p.sh. \"Këpucë\", \"Çanta\". Lëreni bosh nëse s'doni grupim."
    },
    emptyTitle: { en: "No products yet.", sq: "Nuk ka ende produkte." },
    emptyText: { en: "Add your first product using the form.", sq: "Shtoni produktin tuaj të parë duke përdorur formularin." }
  },
  services: {
    manage: { en: "Manage services", sq: "Menaxho shërbimet" },
    intro: {
      en: "Add the services you offer with their prices. Visitors pick a service, choose a date and time, and send the booking straight to your WhatsApp.",
      sq: "Shtoni shërbimet që ofroni me çmimet e tyre. Vizitorët zgjedhin shërbimin, datën dhe orën dhe e dërgojnë rezervimin direkt te WhatsApp-i juaj."
    },
    add: { en: "Add a service", sq: "Shto shërbim" },
    edit: { en: "Edit service", sq: "Modifiko shërbimin" },
    namePlaceholder: { en: "e.g. Haircut", sq: "p.sh. Prerje flokësh" },
    section: { en: "Section", sq: "Kategoria" },
    sectionPlaceholder: { en: "e.g. Hair", sq: "p.sh. Flokë" },
    sectionHint: {
      en: "Groups services on your page, e.g. \"Hair\", \"Nails\". Leave blank to keep them ungrouped.",
      sq: "Grupon shërbimet në faqe, p.sh. \"Flokë\", \"Thonj\". Lëreni bosh nëse s'doni grupim."
    },
    emptyTitle: { en: "No services yet.", sq: "Nuk ka ende shërbime." },
    emptyText: { en: "Add your first service using the form.", sq: "Shtoni shërbimin tuaj të parë duke përdorur formularin." }
  }
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  menuCategory?: string;
  action?: ProductAction;
  available: boolean;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  menuCategory: string;
  action: ProductAction;
  available: boolean;
};

const EMPTY_FORM: Omit<FormState, "action"> = { name: "", description: "", price: "", image: "", menuCategory: "", available: true };

export default function ProductManagerClient({
  listing,
  products
}: {
  listing: { _id: string; slug: string; title: string; category?: string; subcategory?: string; actions?: string[] | null };
  products: Product[];
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const lang = en ? "en" : "sq";
  const kind = getOfferKind(listing);
  const copy = MANAGER_COPY[kind];
  // New items start with what this kind of business usually does; the owner flips it per item.
  const emptyForm: FormState = { ...EMPTY_FORM, action: defaultProductAction(kind) };
  const router = useRouter();
  const searchParams = useSearchParams();
  // Arrived straight from "Add listing" — this is that flow's last step, not a
  // standalone dashboard visit, so the header reads as "finish setting up" rather
  // than "manage" and "Back" would otherwise return into the wizard's history.
  const isOnboarding = searchParams.get("onboarding") === "1";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<Product[]>(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm);
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
      action: getProductAction(product, kind),
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
        action: form.action,
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
          {isOnboarding ? (
            <div
              className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {en ? "Last step — your listing is already submitted" : "Hapi i fundit — listimi juaj u dërgua tashmë"}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: "var(--text-tertiary)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {en ? "Back" : "Kthehu prapa"}
            </button>
          )}
          <p className="eyebrow mb-3">{copy.manage[lang]}</p>
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            {listing.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            {isOnboarding
              ? en
                ? "One more thing: add what you offer here so customers can order it right away. You can always add more later from your dashboard."
                : "Edhe një gjë: shtoni këtu çfarë ofroni që klientët ta porosisin menjëherë. Mund të shtoni e të modifikoni gjithmonë më vonë nga paneli juaj."
              : copy.intro[lang]}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/listings/${listing.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: "var(--brand-accent)" }}
            >
              {en ? "View listing" : "Shiko listimin"} →
            </Link>
            {isOnboarding && (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--brand-accent)" }}
              >
                {en ? "Finish — go to dashboard" : "Përfundo — shko te paneli"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
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
            {editingId ? copy.edit[lang] : copy.add[lang]}
          </h2>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {en ? "Name" : "Emri"} *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={copy.namePlaceholder[lang]}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              {copy.section[lang]}
            </label>
            <input
              list="menu-category-suggestions"
              value={form.menuCategory}
              onChange={(e) => setForm((prev) => ({ ...prev, menuCategory: e.target.value }))}
              placeholder={copy.sectionPlaceholder[lang]}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
            />
            <datalist id="menu-category-suggestions">
              {Array.from(new Set(items.map((item) => item.menuCategory).filter(Boolean))).map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {copy.sectionHint[lang]}
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
              {en ? "Button on the card" : "Butoni në kartë"}
            </label>
            <div className="grid grid-cols-2 gap-2" role="group">
              {(["porosi", "rezervim"] as const).map((value) => {
                const active = form.action === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setForm((prev) => ({ ...prev, action: value }))}
                    className="rounded-xl px-3 py-2.5 text-sm font-bold transition-colors"
                    style={
                      active
                        ? { background: "var(--brand-accent)", color: "#fff", border: "1px solid var(--brand-accent)" }
                        : { background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }
                    }
                  >
                    {value === "porosi" ? (en ? "Order" : "Porosit") : en ? "Book" : "Rezervo"}
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {en
                ? "\"Order\" goes into the basket as an order; \"Book\" asks the visitor for a date and time."
                : "\"Porosit\" shkon në shportë si porosi; \"Rezervo\" i kërkon vizitorit datë dhe orë."}
            </p>
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
                {copy.emptyTitle[lang]}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {copy.emptyText[lang]}
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
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={
                        getProductAction(product, kind) === "rezervim"
                          ? { background: "var(--brand-light)", color: "var(--brand-accent)" }
                          : { background: "#DCFCE7", color: "#15803D" }
                      }
                    >
                      {getProductAction(product, kind) === "rezervim" ? (en ? "Book" : "Rezervo") : en ? "Order" : "Porosit"}
                    </span>
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
