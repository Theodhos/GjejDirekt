"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categories } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import LocationPicker from "@/components/forms/LocationPicker";

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

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function ListingForm() {
  const { language } = useLanguage();
  const t = translations[language];
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const files = Array.from(formData.getAll("images")).filter(Boolean) as File[];
      const imageUrls: string[] = [];

      for (const file of files) {
        try {
          imageUrls.push(await uploadImage(file));
        } catch {
          // Keep the form submission moving if one upload fails.
        }
      }

      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, images: imageUrls })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create listing");

      if (!imageUrls.length) {
        toast("Listing created without uploaded images. You can add more later from edit.", {
          icon: "ℹ️"
        });
      }

      toast.success("Listing submitted for approval");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label={language === 'en' ? 'Title' : 'Titulli'} placeholder="Mountain Escape Villa" required />
        <Input name="country" label={language === 'en' ? 'Country' : 'Shteti'} placeholder="Albania" />
      </div>
      <LocationPicker defaultValue="" required />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="currency" label={language === 'en' ? 'Currency' : 'Valuta'} placeholder="EUR" defaultValue="EUR" />
        <Input name="address" label={language === 'en' ? 'Street address' : 'Adresa e rrugës'} placeholder="Street, city, country" />
      </div>
      <Textarea name="description" label={language === 'en' ? 'Description' : 'Përshkrimi'} placeholder={language === 'en' ? 'Describe the experience...' : 'Përshkruani përvojën...'} required />
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          name="category"
          label={t.common.category}
          options={[{ label: language === 'en' ? 'Select a category' : 'Zgjidhni një kategori', value: "" }, ...categories.map((item) => ({ label: item.label, value: item.value }))]}
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setSelectedSubcategory("");
          }}
          required
        />
        <Select
          name="subcategory"
          label={t.common.subcategory}
          options={[
            { label: language === 'en' ? 'Select a subcategory' : 'Zgjidhni një nënkategori', value: "" },
            ...subcategories.map((item) => ({ label: item.label, value: item.value }))
          ]}
          value={selectedSubcategory}
          onChange={(event) => setSelectedSubcategory(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="price" label={t.common.price} type="number" placeholder="100" />
        <Input name="priceFrom" label={language === 'en' ? 'Price From' : 'Çmimi prej'} type="number" placeholder="80" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="amenities" label={language === 'en' ? 'Amenities' : 'Komoditete'} placeholder="Wifi, Breakfast, Pool" />
        <Input name="tags" label="Tags" placeholder="Luxury, Family, Beach" />
        <Input name="contactPhone" label={language === 'en' ? 'Phone' : 'Telefon'} placeholder="+355 6X XXX XXXX" />
      </div>
      <Textarea name="highlights" label={language === 'en' ? 'Highlights' : 'Pikat kryesore'} placeholder="Sunset view, private chef, guided tours" />
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="contactEmail" label="Email" type="email" placeholder="contact@business.com" />
        <Input name="website" label="Website" placeholder="https://example.com" />
        <Input name="instagram" label="Instagram" placeholder="https://instagram.com/..." />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="facebook" label="Facebook" placeholder="https://facebook.com/..." />
        <Input name="tiktok" label="TikTok" placeholder="https://tiktok.com/@..." />
        <Input name="x" label="X / Twitter" placeholder="https://x.com/..." />
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">{language === 'en' ? 'Images' : 'Foto'}</span>
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? (language === 'en' ? 'Submitting...' : 'Duke u dorëzuar...') : (language === 'en' ? 'Submit listing' : 'Dorëzo listimin')}
      </Button>
    </form>

  );
}
