"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Clock, FolderPlus, Loader2, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";
import { defaultProductAction, getOfferKind, getProductAction, type OfferKind, type ProductAction } from "@/lib/business-offer";

type Bi = { en: string; sq: string };

/** What the catalog is called and how the form talks about it, per kind of business. */
export const MANAGER_COPY: Record<
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
      en: "Groups items on the menu, e.g. \"Sweet crêpes\", \"Drinks\".",
      sq: "Grupon artikujt në menu, p.sh. \"Krepë të ëmbël\", \"Pije\"."
    },
    emptyTitle: { en: "No products yet.", sq: "Nuk ka ende produkte." },
    emptyText: { en: "Add a category first, then the items under it.", sq: "Shtoni fillimisht një kategori, pastaj artikujt poshtë saj." }
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
      en: "Groups rooms on your page, e.g. \"Suites\", \"Standard\".",
      sq: "Grupon dhomat në faqe, p.sh. \"Suita\", \"Standarde\"."
    },
    emptyTitle: { en: "No rooms yet.", sq: "Nuk ka ende dhoma." },
    emptyText: { en: "Add a category first, then the rooms under it.", sq: "Shtoni fillimisht një kategori, pastaj dhomat poshtë saj." }
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
      en: "Groups products on your page, e.g. \"Shoes\", \"Bags\".",
      sq: "Grupon produktet në faqe, p.sh. \"Këpucë\", \"Çanta\"."
    },
    emptyTitle: { en: "No products yet.", sq: "Nuk ka ende produkte." },
    emptyText: { en: "Add a category first, then the products under it.", sq: "Shtoni fillimisht një kategori, pastaj produktet poshtë saj." }
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
      en: "Groups services on your page, e.g. \"Hair\", \"Nails\".",
      sq: "Grupon shërbimet në faqe, p.sh. \"Flokë\", \"Thonj\"."
    },
    emptyTitle: { en: "No services yet.", sq: "Nuk ka ende shërbime." },
    emptyText: { en: "Add a category first, then the services under it.", sq: "Shtoni fillimisht një kategori, pastaj shërbimet poshtë saj." }
  }
};

export type CatalogProduct = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  menuCategory?: string;
  action?: ProductAction;
  estimatedTime?: string;
  available: boolean;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  menuCategory: string;
  action: ProductAction;
  estimatedTime: string;
  available: boolean;
};

const EMPTY_FORM: Omit<FormState, "action"> = {
  name: "",
  description: "",
  price: "",
  image: "",
  menuCategory: "",
  estimatedTime: "",
  available: true
};

export type CatalogListing = {
  _id: string;
  slug?: string;
  category?: string;
  subcategory?: string;
  actions?: string[] | null;
};

/** Items saved before categories were required sit in this group until they get one. */
const UNCATEGORIZED = "";

const sameCategory = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const fieldClass = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2";
const fieldStyle = { background: "var(--surface-cream)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" };

/**
 * The catalog editor, organised the way the public page shows it: the owner adds as
 * many categories as the business has ("Krepa të ëmbla", "Krepa të kripura",
 * "Sandwich") and every category carries its own form for filling in its products —
 * name, price, description, photo. Categories can be renamed and deleted; every
 * change saves to the API immediately, which only accepts the listing's owner or an
 * admin.
 *
 * A category is the `menuCategory` its items share, so one with no items yet has
 * nothing to live on in the database — those are remembered in this browser until
 * their first item is added.
 *
 * Used standalone on /listings/[slug]/products (the dashboard's catalog link) and
 * embedded as the wizard's last step and on the business page, so it never renders
 * its own <form>: a nested form inside the wizard would submit the whole listing
 * instead of adding an item.
 */
export default function CatalogManager({
  listing,
  initialProducts,
  embedded = false
}: {
  listing: CatalogListing;
  initialProducts?: CatalogProduct[];
  embedded?: boolean;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const lang = en ? "en" : "sq";
  const kind = getOfferKind(listing);
  const copy = MANAGER_COPY[kind];
  // New items start with what this kind of business usually does; the owner flips it per item.
  const emptyForm: FormState = { ...EMPTY_FORM, action: defaultProductAction(kind) };
  const router = useRouter();

  const [items, setItems] = useState<CatalogProduct[]>(initialProducts || []);
  const [loadingItems, setLoadingItems] = useState(!initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Categories that hold no item yet.
  const [emptyCategories, setEmptyCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [busyCategory, setBusyCategory] = useState<string | null>(null);

  // Embedded in the wizard there is no server page to hand the items over, so the
  // owner's full catalog (hidden items included) is fetched here instead.
  useEffect(() => {
    if (initialProducts) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/listings/${listing._id}/products`);
        const data = await res.json();
        if (!cancelled && res.ok && Array.isArray(data.products)) setItems(data.products);
      } catch {
      } finally {
        if (!cancelled) setLoadingItems(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing._id]);

  const storageKey = `catalog-categories:${listing._id}`;
  const storageLoaded = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setEmptyCategories(saved.filter((item) => typeof item === "string" && item.trim()));
    } catch {}
    storageLoaded.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!storageLoaded.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(emptyCategories));
    } catch {}
  }, [storageKey, emptyCategories]);

  /** Every category in the order it first appears, then the ones still waiting for an item. */
  const categories = useMemo(() => {
    const names: string[] = [];
    const push = (name?: string) => {
      const value = (name || "").trim();
      if (value && !names.some((item) => sameCategory(item, value))) names.push(value);
    };
    items.forEach((item) => push(item.menuCategory));
    emptyCategories.forEach(push);
    return names;
  }, [items, emptyCategories]);

  const itemsOf = (category: string) =>
    items.filter((item) =>
      category === UNCATEGORIZED ? !(item.menuCategory || "").trim() : sameCategory(item.menuCategory || "", category)
    );

  const hasUncategorized = itemsOf(UNCATEGORIZED).length > 0;

  /** What an existing item looks like in the form. */
  const toForm = (product: CatalogProduct): FormState => {
    const category = (product.menuCategory || "").trim();
    return {
      name: product.name,
      description: product.description || "",
      price: typeof product.price === "number" ? String(product.price) : "",
      image: product.image || "",
      menuCategory: categories.find((item) => sameCategory(item, category)) || category,
      action: getProductAction(product, kind),
      estimatedTime: product.estimatedTime || "",
      available: product.available
    };
  };

  // The field stays ready for the next name, so several categories go in one after another.
  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    if (categories.some((item) => sameCategory(item, name))) {
      toast(en ? "This category already exists" : "Kjo kategori ekziston tashmë");
    } else {
      setEmptyCategories((prev) => [...prev, name]);
    }
    setNewCategory("");
  };

  const patchProduct = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    return data.product as CatalogProduct;
  };

  const renameCategory = async (from: string) => {
    const to = renameValue.trim();
    if (!to || to === from) {
      setRenaming(null);
      return;
    }
    if (categories.some((item) => sameCategory(item, to) && !sameCategory(item, from))) {
      toast.error(en ? "This category already exists" : "Kjo kategori ekziston tashmë");
      return;
    }
    setBusyCategory(from);
    try {
      // The name lives on the items, so renaming the category means moving each of them.
      await Promise.all(itemsOf(from).map((item) => patchProduct(item._id, { menuCategory: to })));
      setItems((prev) => prev.map((item) => (sameCategory(item.menuCategory || "", from) ? { ...item, menuCategory: to } : item)));
      setEmptyCategories((prev) => prev.map((item) => (sameCategory(item, from) ? to : item)));
      setRenaming(null);
      toast.success(en ? "Category renamed" : "Kategoria u riemërtua");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || (en ? "Rename failed" : "Riemërtimi dështoi"));
    } finally {
      setBusyCategory(null);
    }
  };

  const deleteCategory = async (category: string) => {
    const targets = itemsOf(category);
    if (targets.length) {
      const confirmed = window.confirm(
        en
          ? `Delete "${category}" and its ${targets.length} item(s)?`
          : `Të fshihet "${category}" bashkë me ${targets.length} artikuj të saj?`
      );
      if (!confirmed) return;
    }
    setBusyCategory(category);
    try {
      await Promise.all(
        targets.map(async (item) => {
          const res = await fetch(`/api/products/${item._id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
        })
      );
      setItems((prev) => prev.filter((item) => !sameCategory(item.menuCategory || "", category)));
      setEmptyCategories((prev) => prev.filter((item) => !sameCategory(item, category)));
      toast.success(en ? "Category deleted" : "Kategoria u fshi");
      router.refresh();
    } catch {
      toast.error(en ? "Delete failed" : "Fshirja dështoi");
    } finally {
      setBusyCategory(null);
    }
  };

  /** Adds a new item, or saves the one being edited. Resolves to whether it went through. */
  const saveItem = async (values: FormState, id?: string) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      // An empty string on edit removes the photo; a new item simply has none.
      image: values.image || (id ? "" : undefined),
      menuCategory: values.menuCategory.trim(),
      action: values.action,
      estimatedTime: values.estimatedTime.trim(),
      available: values.available
    };

    try {
      if (id) {
        const product = await patchProduct(id, payload);
        setItems((prev) => prev.map((item) => (item._id === id ? product : item)));
        setEditingId(null);
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
      router.refresh();
      return true;
    } catch (err: any) {
      toast.error(err.message || (en ? "Something went wrong" : "Diçka shkoi keq"));
      return false;
    }
  };

  const handleDelete = async (product: CatalogProduct) => {
    const confirmed = window.confirm(
      en ? `Delete "${product.name}"?` : `Të fshihet "${product.name}"?`
    );
    if (!confirmed) return;

    setDeletingId(product._id);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      // The category outlives its last item, so the owner can keep filling it.
      const category = (product.menuCategory || "").trim();
      if (category) {
        setEmptyCategories((prev) => (prev.some((item) => sameCategory(item, category)) ? prev : [...prev, category]));
      }
      setItems((prev) => prev.filter((item) => item._id !== product._id));
      if (editingId === product._id) setEditingId(null);
      toast.success(en ? "Product deleted" : "Produkti u fshi");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || (en ? "Delete failed" : "Fshirja dështoi"));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailable = async (product: CatalogProduct) => {
    const nextAvailable = !product.available;
    setItems((prev) => prev.map((item) => (item._id === product._id ? { ...item, available: nextAvailable } : item)));
    try {
      await patchProduct(product._id, { available: nextAvailable });
      router.refresh();
    } catch {
      setItems((prev) => prev.map((item) => (item._id === product._id ? { ...item, available: !nextAvailable } : item)));
      toast.error(en ? "Failed to update" : "Përditësimi dështoi");
    }
  };

  const renderItem = (product: CatalogProduct) => (
    <div
      key={product._id}
      className="flex flex-wrap items-center gap-3 rounded-xl p-3 sm:flex-nowrap"
      style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: "var(--surface-cream)" }}>
        {product.image && <SafeImage src={product.image} alt={product.name} fill className="object-cover" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>{product.name}</p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={
              getProductAction(product, kind) === "rezervim"
                ? { background: "var(--brand-light)", color: "var(--brand-accent)" }
                : { background: "#DCFCE7", color: "#15803D" }
            }
          >
            {getProductAction(product, kind) === "rezervim" ? (en ? "Service" : "Shërbim") : en ? "Product" : "Produkt"}
          </span>
          {product.estimatedTime && (
            <span
              className="hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex"
              style={{ background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }}
            >
              <Clock className="h-3 w-3" />
              {product.estimatedTime}
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

      <div className="flex basis-full shrink-0 items-center justify-end gap-1.5 sm:basis-auto">
        <button
          type="button"
          onClick={() => toggleAvailable(product)}
          className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors hover:bg-neutral-100"
          style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
        >
          {product.available ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() => setEditingId(product._id)}
          aria-label={en ? "Edit" : "Modifiko"}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
          style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={deletingId === product._id}
          onClick={() => handleDelete(product)}
          aria-label={en ? "Delete" : "Fshi"}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50"
          style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
        >
          {deletingId === product._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );

  const renderCategory = (category: string) => {
    const list = itemsOf(category);
    const uncategorized = category === UNCATEGORIZED;
    const busy = busyCategory !== null && busyCategory === category;
    const isRenaming = renaming !== null && renaming === category;

    return (
      <section
        key={category || "__uncategorized__"}
        className="overflow-hidden rounded-2xl"
        style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
      >
        <header
          className="flex flex-wrap items-center gap-2 px-4 py-3"
          style={{ background: "var(--surface-white)", borderBottom: "1px solid var(--border-soft)" }}
        >
          {isRenaming ? (
            <>
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    renameCategory(category);
                  }
                  if (event.key === "Escape") setRenaming(null);
                }}
                className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:ring-2"
                style={fieldStyle}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => renameCategory(category)}
                aria-label={en ? "Save name" : "Ruaj emrin"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white disabled:opacity-60"
                style={{ background: "var(--brand-accent)" }}
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setRenaming(null)}
                aria-label={en ? "Cancel" : "Anulo"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
                style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {uncategorized ? (en ? "No category" : "Pa kategori") : category}
                </h3>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {list.length} {en ? (list.length === 1 ? "item" : "items") : "artikuj"}
                </p>
              </div>
              {!uncategorized && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setRenaming(category);
                      setRenameValue(category);
                    }}
                    aria-label={en ? "Rename category" : "Riemërto kategorinë"}
                    title={en ? "Rename category" : "Riemërto kategorinë"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
                    style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => deleteCategory(category)}
                    aria-label={en ? "Delete category" : "Fshi kategorinë"}
                    title={en ? "Delete category" : "Fshi kategorinë"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-50"
                    style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                  >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </>
              )}
            </>
          )}
        </header>

        <div className="space-y-2 p-3">
          {uncategorized && (
            <p className="px-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
              {en
                ? "These items have no category yet — edit each one and pick a category."
                : "Këta artikuj nuk kanë ende kategori — modifikojini dhe zgjidhni një kategori."}
            </p>
          )}
          {list.map((product) =>
            editingId === product._id ? (
              <ItemForm
                key={product._id}
                editing
                en={en}
                copy={copy}
                categories={categories}
                initial={toForm(product)}
                onSave={(values) => saveItem(values, product._id)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              renderItem(product)
            )
          )}
          {/* Every category keeps its own form open, so products are filled in right
              where they belong — no hunting for an "add" button first. */}
          {!uncategorized && (
            <ItemForm
              key={`add-${category}`}
              en={en}
              copy={copy}
              categories={categories}
              initial={{ ...emptyForm, menuCategory: category }}
              onSave={(values) => saveItem(values)}
            />
          )}
        </div>
      </section>
    );
  };

  return (
    <div className={embedded ? "space-y-4" : "mx-auto max-w-3xl space-y-4"}>
      {/* ── Add a category ── */}
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
      >
        <label className="mb-1.5 block text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {en ? "Add a category" : "Shto kategori"}
        </label>
        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              addCategory();
            }}
            placeholder={copy.sectionPlaceholder[lang]}
            maxLength={60}
            className={fieldClass}
            style={fieldStyle}
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={!newCategory.trim()}
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: "var(--brand-accent)" }}
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">{en ? "Add" : "Shto"}</span>
          </button>
        </div>
        <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          {copy.sectionHint[lang]}{" "}
          {en
            ? "Add as many categories as you need — each one opens below with its own form for its products. A category is saved with its first product."
            : "Shtoni sa kategori të doni — secila hapet më poshtë me formularin e vet për produktet. Kategoria ruhet bashkë me produktin e parë."}
        </p>
      </div>

      {/* ── Categories, each with its items ── */}
      {loadingItems ? (
        <div
          className="flex items-center justify-center rounded-2xl px-6 py-10"
          style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
        >
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--text-tertiary)" }} />
        </div>
      ) : !categories.length && !hasUncategorized ? (
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
        <>
          {categories.map(renderCategory)}
          {hasUncategorized && renderCategory(UNCATEGORIZED)}
        </>
      )}
    </div>
  );
}

const labelClass = "mb-1.5 block text-xs font-semibold";
const labelStyle = { color: "var(--text-secondary)" };
const hintClass = "mt-1 text-[11px]";
const hintStyle = { color: "var(--text-tertiary)" };

/**
 * One item's form — exactly the 8 universal fields, the same for every kind of
 * business and always in this order: title, category, price, type, availability
 * (required), then description, estimated time and photo (optional).
 *
 * Each category renders its own instance, so a half-typed product in one category is
 * never lost by starting another one elsewhere.
 */
function ItemForm({
  en,
  copy,
  categories,
  initial,
  editing = false,
  onSave,
  onCancel
}: {
  en: boolean;
  copy: (typeof MANAGER_COPY)[OfferKind];
  categories: string[];
  initial: FormState;
  editing?: boolean;
  onSave: (values: FormState) => Promise<boolean>;
  onCancel?: () => void;
}) {
  const lang = en ? "en" : "sq";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = async () => {
    if (saving || uploading) return;
    // The universal required fields: title, category, price and type (availability
    // always carries a value).
    if (!form.name.trim()) {
      toast.error(en ? "The title is required" : "Titulli është i detyrueshëm");
      return;
    }
    if (!form.menuCategory.trim()) {
      toast.error(en ? "The category is required" : "Kategoria është e detyrueshme");
      return;
    }
    if (!form.price.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      toast.error(en ? "A valid price is required" : "Çmimi është i detyrueshëm");
      return;
    }

    setSaving(true);
    const saved = await onSave(form);
    setSaving(false);
    // Added: clear the form, ready for the next product of the same category.
    if (saved && !editing) setForm(initial);
  };

  return (
    <div
      // Enter inside a field saves the item — and never submits a surrounding form
      // (the listing wizard wraps this whole editor in its own <form>).
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        if ((event.target as HTMLElement).tagName !== "INPUT") return;
        event.preventDefault();
        handleSubmit();
      }}
      className="space-y-3 rounded-xl p-3 sm:p-4"
      style={{
        background: "var(--surface-white)",
        border: editing ? "1px solid var(--brand-border)" : "1px dashed var(--border-medium)"
      }}
    >
      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
        {editing ? copy.edit[lang] : `${copy.add[lang]} — ${initial.menuCategory}`}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* 1 · Titulli */}
        <div>
          <label className={labelClass} style={labelStyle}>
            {en ? "Title" : "Titulli"} *
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={copy.namePlaceholder[lang]}
            className={fieldClass}
            style={fieldStyle}
          />
        </div>

        {/* 2 · Kategoria */}
        <div>
          <label className={labelClass} style={labelStyle}>
            {en ? "Category" : "Kategoria"} *
          </label>
          <select
            value={form.menuCategory}
            onChange={(e) => setForm((prev) => ({ ...prev, menuCategory: e.target.value }))}
            className={fieldClass}
            style={fieldStyle}
          >
            {!form.menuCategory && <option value="">{en ? "Choose a category" : "Zgjidhni kategorinë"}</option>}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 3 · Çmimi */}
        <div>
          <label className={labelClass} style={labelStyle}>
            {en ? "Price (Lekë)" : "Çmimi (Lekë)"} *
          </label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="300"
            className={fieldClass}
            style={fieldStyle}
          />
          <p className={hintClass} style={hintStyle}>
            {en ? "Numbers only." : "Vetëm numra."}
          </p>
        </div>

        {/* 4 · Lloji — produkt (porositet) apo shërbim (rezervohet) */}
        <div>
          <label className={labelClass} style={labelStyle}>
            {en ? "Type" : "Lloji"} *
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
                  {value === "porosi" ? (en ? "Product" : "Produkt") : en ? "Service" : "Shërbim"}
                </button>
              );
            })}
          </div>
          <p className={hintClass} style={hintStyle}>
            {en
              ? "Product: quantity + / - and the 🛒 Order button. Service: date/time and the 📅 Booking button."
              : "Produkt: sasia + / - dhe butoni 🛒 Porosi. Shërbim: data/ora dhe butoni 📅 Rezervim."}
          </p>
        </div>
      </div>

      {/* 5 · Disponueshmëria — ON/OFF */}
      <div>
        <label className={labelClass} style={labelStyle}>
          {en ? "Availability" : "Disponueshmëria"} *
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={form.available}
          onClick={() => setForm((prev) => ({ ...prev, available: !prev.available }))}
          className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 transition-colors"
          style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
        >
          <span className="text-sm font-semibold" style={{ color: form.available ? "var(--text-primary)" : "var(--text-tertiary)" }}>
            {form.available
              ? en ? "ON — shown in the live catalog" : "ON — shfaqet në katalogun live"
              : en ? "OFF — hidden from the live catalog" : "OFF — e fshehur nga katalogu live"}
          </span>
          <span
            className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
            style={{ background: form.available ? "var(--brand-accent)" : "var(--border-medium)" }}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
              style={{ left: form.available ? "calc(100% - 22px)" : "2px" }}
            />
          </span>
        </button>
      </div>

      {/* 6 · Përshkrimi (opsionale) */}
      <div>
        <label className={labelClass} style={labelStyle}>
          {en ? "Description (optional)" : "Përshkrimi (opsionale)"}
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={2}
          placeholder={en ? "Ingredients, specific features (jacuzzi, etc.)..." : "Përbërësit, tiparet specifike (jacuzzi, etj.)..."}
          className={`${fieldClass} resize-none`}
          style={fieldStyle}
        />
        <p className={hintClass} style={hintStyle}>
          {en
            ? "On the page exactly one line shows, with a \"See more\" button for the rest."
            : "Në faqe shfaqet saktësisht 1 rresht, me butonin \"Shiko më shumë\" për pjesën tjetër."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* 7 · Koha e estimuar (opsionale) */}
        <div>
          <label className={labelClass} style={labelStyle}>
            {en ? "Estimated time (optional)" : "Koha e estimuar (opsionale)"}
          </label>
          <input
            value={form.estimatedTime}
            onChange={(e) => setForm((prev) => ({ ...prev, estimatedTime: e.target.value }))}
            placeholder={en ? "e.g. 15 min" : "p.sh. 15 min"}
            className={fieldClass}
            style={fieldStyle}
          />
          <p className={hintClass} style={hintStyle}>
            {en
              ? "Cooking time for products; appointment length or minimum nights for services."
              : "Koha e gatimit për produktet; kohëzgjatja e takimit ose netët minimale për shërbimet."}
          </p>
        </div>

        {/* 8 · Foto (opsionale) */}
        <div>
          <label className={labelClass} style={labelStyle}>
            {en ? "Photo (optional)" : "Foto (opsionale)"}
          </label>
          {form.image ? (
            <div className="relative h-[62px] w-[62px] overflow-hidden rounded-xl">
              <SafeImage src={form.image} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                aria-label={en ? "Remove photo" : "Hiq foton"}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:opacity-60"
              style={{ border: "1px dashed var(--border-medium)", color: "var(--text-tertiary)" }}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {uploading ? (en ? "Uploading..." : "Duke ngarkuar...") : en ? "Upload photo" : "Ngarko foto"}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) handleUpload(picked);
              e.target.value = "";
            }}
          />
          <p className={hintClass} style={hintStyle}>
            {en ? "Without a photo the item shows as an elegant text-only card." : "Pa foto, artikulli shfaqet si kartë elegante vetëm me tekst."}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "var(--brand-accent)" }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {editing ? (en ? "Save changes" : "Ruaj ndryshimet") : copy.add[lang]}
        </button>
        {editing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-100"
            style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
          >
            {en ? "Cancel" : "Anulo"}
          </button>
        )}
      </div>
    </div>
  );
}
