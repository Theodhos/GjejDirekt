"use client";

import SafeImage from "@/components/ui/SafeImage";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categories, getCategoryFormValue, getSubcategoryFormValue } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";
import { Camera, Sparkles } from "lucide-react";

type ListingData = {
  _id: string;
  title: string;
  location: string;
  country?: string;
  currency?: string;
  description: string;
  category: string;
  subcategory: string;
  address?: string;
  price?: number;
  priceFrom?: number;
  coordinates?: { lat?: number; lng?: number };
  amenities?: string[];
  tags?: string[];
  highlights?: string[];
  contactInfo?: { phone?: string; email?: string; website?: string };
  socialLinks?: { instagram?: string; facebook?: string; tiktok?: string; x?: string };
  googleMapsLink?: string;
  businessHours?: string;
  whatsapp?: string;
  website?: string;
  checkIn?: string;
  checkOut?: string;
  menuLink?: string;
  tips?: string;
  eventDate?: string;
  eventTime?: string;
  bookingLink?: string;
  transportType?: string;
  bannerImage?: string;
  photos?: string[];
  images?: string[];
};

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url as string;
}

export default function ListingEditForm({ listing }: { listing: ListingData }) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const en = language === "en";
  const categoryNames = t.categories.names as Record<string, string>;
  const subcategoryNames = t.categories.subnames as Record<string, Record<string, string>>;
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFormValue(listing.category));
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    getSubcategoryFormValue(listing.category, listing.subcategory)
  );
  const initialImages = listing.images?.length
    ? listing.images
    : [listing.bannerImage, ...(listing.photos || [])].filter((item): item is string => Boolean(item));
  const [currentBanner, setCurrentBanner] = useState(initialImages[0] || "");
  const [currentGallery, setCurrentGallery] = useState<string[]>(initialImages.slice(1));
  const [activeTags, setActiveTags] = useState<string[]>(listing.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [location, setLocation] = useState(listing.location || "");
  const [cities, setCities] = useState<any[]>(albaniaCities);
  const [villages, setVillages] = useState<string[]>([]);
  const [selectedVillage, setSelectedVillage] = useState("");

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  const suggestedTags = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.tags || [];
  }, [selectedCategory]);

  function toggleTag(tag: string) {
    setActiveTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function addCustomTag(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || !customTag.trim()) return;
    event.preventDefault();
    const nextTag = customTag.trim();
    setActiveTags((current) => (current.includes(nextTag) ? current : [...current, nextTag]));
    setCustomTag("");
  }

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const data = await res.json();
        if (Array.isArray(data.cities) && data.cities.length) {
          setCities(data.cities);
        }
      } catch {}
    };
    loadCities();
  }, []);

  useEffect(() => {
    const found = cities.find((c) => String(c.label).toLowerCase() === location.toLowerCase());
    const nextVillages = found?.villages || [];
    setVillages(nextVillages);
    if (!nextVillages.includes(selectedVillage)) setSelectedVillage("");
  }, [location, cities, selectedVillage]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const bannerFile = formData.get("bannerImage");
      const galleryFiles = Array.from(formData.getAll("galleryImages")).filter((item): item is File => item instanceof File && item.size > 0);
      let bannerUrl = currentBanner;
      const uploadedGallery: string[] = [];

      if (bannerFile instanceof File && bannerFile.size > 0) {
        bannerUrl = await uploadImage(bannerFile);
      }

      for (const file of galleryFiles) {
        try {
          uploadedGallery.push(await uploadImage(file));
        } catch {
          // Continue with the rest of the update if one image fails.
        }
      }

      const galleryImages = [...currentGallery, ...uploadedGallery];
      const images = [bannerUrl, ...galleryImages].filter(Boolean);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(`/api/listings/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          images,
          bannerImage: bannerUrl,
          photos: galleryImages,
          tags: activeTags
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (en ? "Update failed" : "Përditësimi dështoi"));

      toast.success(en ? "Listing updated" : "Shërbimi u përditësua");
      router.push(`/listings/${data.listing.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : en ? "Something went wrong" : "Diçka shkoi keq");
    } finally {
      setLoading(false);
    }
  }

  const isPerPersonCategory = selectedCategory === "akomodim" || selectedCategory === "restorante";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label={en ? "Title" : "Titulli"} defaultValue={listing.title} required />
        <Input
          name="location"
          label={en ? "City" : "Qyteti"}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          list="city-list"
          required
        />
      </div>

      <datalist id="city-list">
        {cities.map((item) => (
          <option key={item.value} value={item.label} />
        ))}
      </datalist>

      {villages.length > 0 && (
        <Select
          name="village"
          label={en ? "Village (Optional)" : "Fshati (Opsionale)"}
          options={[
            { label: en ? "Select village" : "Zgjidh fshatin", value: "" },
            ...villages.map((v) => ({ label: v, value: v }))
          ]}
          value={selectedVillage}
          onChange={(event) => setSelectedVillage(event.target.value)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input name="address" label={en ? "Street address" : "Adresa e rrugës"} defaultValue={listing.address || ""} />
        <Select
          name="currency"
          label={en ? "Currency" : "Valuta"}
          defaultValue={listing.currency || "LEK"}
          options={[
            { label: "LEK (L)", value: "LEK" },
            { label: "Euro (€)", value: "€" },
            { label: "USD ($)", value: "$" }
          ]}
        />
      </div>

      <Textarea name="description" label={en ? "Description" : "Përshkrimi"} defaultValue={listing.description} required />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          name="category"
          label={en ? "Category" : "Kategoria"}
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setSelectedSubcategory("");
          }}
          options={[
            { label: en ? "Select a category" : "Zgjidh një kategori", value: "" },
            ...categories.map((item) => ({ label: categoryNames[item.value] || item.label, value: item.value }))
          ]}
        />
        <Select
          name="subcategory"
          label={en ? "Subcategory" : "Nënkategoria"}
          value={selectedSubcategory}
          onChange={(event) => setSelectedSubcategory(event.target.value)}
          options={[
            { label: en ? "Select a subcategory" : "Zgjidh një nënkategori", value: "" },
            ...subcategories.map((item) => ({
              label: subcategoryNames[selectedCategory]?.[item.value] || item.label,
              value: item.value
            }))
          ]}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">
          {en ? "Features / amenities" : "Karakteristika / pajisje"}
        </label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedTags.map((tag) => {
              const isActive = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                  }`}
                >
                  {tag}
                  {isActive && <span className="text-[10px] font-black">x</span>}
                </button>
              );
            })}
            {activeTags.filter((tag) => !suggestedTags.includes(tag)).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow"
              >
                {tag}
                <span className="text-[10px] font-black">x</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
            <input
              type="text"
              value={customTag}
              onChange={(event) => setCustomTag(event.target.value)}
              onKeyDown={addCustomTag}
              placeholder={en ? "Add custom tag and press Enter" : "Shto etiketë dhe shtyp Enter"}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs font-medium text-slate-950 outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          name="priceFrom"
          label={isPerPersonCategory ? (en ? "Min Price (per person)" : "Çmimi Min (për person)") : (en ? "Minimum Price" : "Çmimi Minimal")}
          type="number"
          defaultValue={listing.priceFrom || ""}
        />
        <Input
          name="price"
          label={isPerPersonCategory ? (en ? "Max Price (per person)" : "Çmimi Max (për person)") : (en ? "Maximum Price" : "Çmimi Maksimal")}
          type="number"
          defaultValue={listing.price || ""}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input name="amenities" label={en ? "Amenities" : "Pajisjet"} defaultValue={(listing.amenities || []).join(", ")} />
        <Input name="contactPhone" label={en ? "Phone" : "Telefoni"} defaultValue={listing.contactInfo?.phone || ""} />
      </div>

      <Textarea name="highlights" label={en ? "Highlights" : "Pikat kryesore"} defaultValue={(listing.highlights || []).join(", ")} />

      <div className="grid gap-4 md:grid-cols-3">
        <Input name="contactEmail" label="Email" type="email" defaultValue={listing.contactInfo?.email || ""} />
        <Input name="website" label="Website" defaultValue={listing.website || listing.contactInfo?.website || ""} />
        <Input name="whatsapp" label="WhatsApp" defaultValue={listing.whatsapp || ""} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input name="instagram" label="Instagram" defaultValue={listing.socialLinks?.instagram || ""} />
        <Input name="facebook" label="Facebook" defaultValue={listing.socialLinks?.facebook || ""} />
        <Input name="googleMapsLink" label="Google Maps Link" defaultValue={listing.googleMapsLink || ""} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input name="businessHours" label={en ? "Opening Hours" : "Orari i punës"} defaultValue={listing.businessHours || ""} />
        <Input name="tiktok" label="TikTok" defaultValue={listing.socialLinks?.tiktok || ""} />
        <Input name="x" label="X / Twitter" defaultValue={listing.socialLinks?.x || ""} />
      </div>

      <input type="hidden" name="country" value="Albania" />

      {selectedCategory === "akomodim" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="checkIn" label={en ? "Check-in Time" : "Check-in"} defaultValue={listing.checkIn || ""} />
          <Input name="checkOut" label={en ? "Check-out Time" : "Check-out"} defaultValue={listing.checkOut || ""} />
        </div>
      )}

      {selectedCategory === "restorante" && (
        <Input name="menuLink" label={en ? "Menu Link" : "Linku i Menusë"} defaultValue={listing.menuLink || ""} />
      )}

      {selectedCategory === "evente" && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="eventDate" type="date" label={en ? "Event Date" : "Data e Eventit"} defaultValue={listing.eventDate || ""} />
            <Input name="eventTime" type="time" label={en ? "Event Time" : "Ora e Eventit"} defaultValue={listing.eventTime || ""} />
          </div>
          <Input name="bookingLink" label={en ? "Booking Link" : "Linku i Rezervimit"} defaultValue={listing.bookingLink || ""} />
        </>
      )}

      {selectedCategory === "transport" && (
        <Input name="transportType" label={en ? "Type of Transport" : "Lloji i Transportit"} defaultValue={listing.transportType || ""} />
      )}

      {selectedCategory === "atraksione" && (
        <Textarea name="tips" label={en ? "Tips / Additional Information" : "Këshilla / Informacion shtesë"} defaultValue={listing.tips || ""} />
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">{en ? "Current images" : "Imazhet aktuale"}</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {currentGallery.length ? (
            currentGallery.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setCurrentGallery((items) => items.filter((item) => item !== image))}
                className="group relative overflow-hidden rounded-3xl border border-slate-200"
                title={en ? "Click to remove" : "Kliko për ta hequr"}
              >
                <div className="relative h-32 w-full">
                  <SafeImage src={image} alt={en ? "Current listing" : "Imazh aktual"} fill className="object-cover" />
                </div>
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-white opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100">
                  {en ? "Remove" : "Hiq"}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500">{en ? "No current images." : "Nuk ka imazhe aktuale."}</p>
          )}
        </div>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">{en ? "Add more images" : "Shto imazhe të tjera"}</span>
        <input
          name="galleryImages"
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
        />
      </label>

      <Button type="submit" disabled={loading}>
        {loading ? (en ? "Saving..." : "Duke ruajtur...") : (en ? "Save changes" : "Ruaj ndryshimet")}
      </Button>
    </form>
  );
}
