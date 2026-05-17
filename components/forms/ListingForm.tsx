"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { categories } from "@/lib/constants";
import { albaniaCities } from "@/lib/albania-cities";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Camera, Sparkles, Map as MapIcon } from "lucide-react";

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

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ListingForm() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Pre-select category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && !selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, selectedCategory]);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  const suggestedTags = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.tags || [];
  }, [selectedCategory]);

  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      if (!activeTags.includes(customTag.trim())) {
        setActiveTags([...activeTags, customTag.trim()]);
      }
      setCustomTag("");
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const bannerFile = formData.get("bannerImage") as File | null;
      const galleryFiles = Array.from(formData.getAll("galleryImages")).filter((item): item is File => item instanceof File && item.size > 0).slice(0, 5);

      if (!bannerFile || bannerFile.size === 0) {
        throw new Error(language === 'en' ? 'Banner image is required.' : 'Foto e banerit është e detyrueshme.');
      }

      const bannerUrl = await uploadImage(bannerFile);
      const galleryUrls: string[] = [];

      for (const file of galleryFiles) {
        galleryUrls.push(await uploadImage(file));
      }

      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          bannerImage: bannerUrl,
          photos: galleryUrls,
          images: [bannerUrl, ...galleryUrls],
          tags: activeTags
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create listing");

      toast.success(language === 'en' ? "Listing submitted for approval" : "Listimi u dërgua për miratim");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Input
          name="title"
          label={language === 'en' ? 'Title' : 'Titulli'}
          placeholder={language === 'en' ? 'Mountain Escape Villa' : 'Villa e bukur në mal'}
          required
        />
        <Input
          name="location"
          label={language === 'en' ? 'City' : 'Qyteti'}
          placeholder={language === 'en' ? 'Tirana' : 'Tiranë'}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          list="city-list"
          required
        />
      </div>

      <Textarea
        name="description"
        label={language === 'en' ? 'Description' : 'Përshkrimi'}
        placeholder={language === 'en' ? 'Describe the experience, highlights and what makes this listing special.' : 'Përshkruani përvojën, pikat kryesore dhe çfarë e bën këtë vend unik.'}
        required
      />

      <datalist id="city-list">
        {albaniaCities.map((item) => (
          <option key={item.value} value={item.label} />
        ))}
      </datalist>

      <div className="grid gap-4 lg:grid-cols-2">
        <Select
          name="category"
          label={t.common.category}
          options={[
            { label: language === 'en' ? 'Select a category' : 'Zgjidhni një kategori', value: '' },
            ...categories.map((item) => ({ label: item.label, value: item.value }))
          ]}
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setSelectedSubcategory("");
            setActiveTags([]); // Reset tags when category changes
          }}
          required
        />
        <Select
          name="subcategory"
          label={t.common.subcategory}
          options={[
            { label: language === 'en' ? 'Select a subcategory' : 'Zgjidhni një nënkategori', value: '' },
            ...subcategories.map((item) => ({ label: item.label, value: item.value }))
          ]}
          value={selectedSubcategory}
          onChange={(event) => setSelectedSubcategory(event.target.value)}
          required
        />
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">
          {language === 'en' ? 'Features & Amenities' : 'Karakteristikat & Pajisjet'}
        </label>
        <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200">
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestedTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTags.includes(tag) 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                }`}
              >
                {tag}
              </button>
            ))}
            {activeTags.filter(t => !suggestedTags.includes(t)).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-slate-900 text-white shadow-lg"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={addCustomTag}
              placeholder={language === 'en' ? 'Add custom tag... (Press Enter)' : 'Shto tag të personalizuar... (Shtyp Enter)'}
              className="w-full h-12 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:border-brand-500 outline-none text-xs font-bold text-slate-950 shadow-soft"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Input
          name="contactPhone"
          label={language === 'en' ? 'Contact Phone' : 'Telefoni i Kontaktit'}
          placeholder="+355 69 ..."
          required
        />
        <Input
          name="address"
          label={language === 'en' ? 'Exact Address' : 'Adresa e saktë'}
          placeholder={language === 'en' ? 'Street name, Building nr.' : 'Emri i rrugës, Nr. i ndërtesës'}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Input
          name="businessHours"
          label={language === 'en' ? 'Opening Hours' : 'Orari i punës'}
          placeholder="08:00 - 22:00"
        />
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <Input
            name="priceFrom"
            type="number"
            label={language === 'en' ? 'Price Starting From' : 'Çmimi fillon nga'}
            placeholder="50"
          />
          <Select
            name="currency"
            label={language === 'en' ? 'Currency' : 'Valuta'}
            options={[
              { label: "€", value: "€" },
              { label: "$", value: "$" },
              { label: "ALL", value: "ALL" }
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Input
          name="instagramLink"
          label="Instagram Link"
          placeholder="https://instagram.com/yourbusiness"
          value={instagramLink}
          onChange={(e) => setInstagramLink(e.target.value)}
        />
        <Input
          name="facebookLink"
          label="Facebook Link"
          placeholder="https://facebook.com/yourbusiness"
          value={facebookLink}
          onChange={(e) => setFacebookLink(e.target.value)}
        />
        <Input
          name="googleMapsLink"
          label="Google Maps Link"
          placeholder="https://maps.google.com/..."
          value={googleMapsLink}
          onChange={(e) => setGoogleMapsLink(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <label className="block space-y-3 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm group hover:border-brand-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-widest text-slate-950">{language === 'en' ? 'Main Banner Photo' : 'Foto Kryesore (Banner)'}</span>
            <Camera className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <input
            name="bannerImage"
            type="file"
            accept="image/*"
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            required
          />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{language === 'en' ? 'This is the large photo shown at the top.' : 'Kjo është fotoja e madhe që shfaqet në krye.'}</p>
        </label>

        <label className="block space-y-3 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm group hover:border-brand-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-widest text-slate-950">{language === 'en' ? 'Gallery (5 Photos)' : 'Galeria (5 Foto)'}</span>
            <Sparkles className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <input
            name="galleryImages"
            type="file"
            accept="image/*"
            multiple
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            required
          />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{language === 'en' ? 'Please select exactly 5 photos for the best display.' : 'Ju lutem zgjidhni saktësisht 5 foto për paraqitjen më të mirë.'}</p>
        </label>
      </div>

      <input type="hidden" name="country" value="Albania" />

      <div className="pt-8">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-20 text-lg font-black tracking-widest uppercase shadow-2xl shadow-brand-500/20"
        >
          {loading ? (language === 'en' ? 'Creating Service...' : 'Duke krijuar shërbimin...') : (language === 'en' ? 'Launch Listing' : 'Publiko Listimin')}
        </Button>
      </div>
    </form>
  );
}
