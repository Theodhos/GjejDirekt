"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { imageUrlError } from "@/lib/images";
import { Edit3, Save, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useLanguage } from "@/context/LanguageContext";

type CityItem = {
  value: string;
  label: string;
  region?: string;
  image?: string;
  description?: string;
  country?: string;
};

type CityDraft = {
  label: string;
  region: string;
  image: string;
  description: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Upload failed");
  return String(data.url || "");
}

export default function AdminCityManager() {
  const { t, language } = useLanguage();
  const commonText = t.common as Record<string, string>;
  const adminText = t.admin as Record<string, string>;
  const [deletingValue, setDeletingValue] = useState("");
  const [savingValue, setSavingValue] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [cities, setCities] = useState<CityItem[]>([]);
  const [draft, setDraft] = useState<CityDraft>({
    label: "",
    region: "",
    image: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadCities() {
    const res = await fetch("/api/cities", { cache: "no-store" });
    const data = await res.json();
    setCities(data.cities || []);
  }

  async function deleteCity(value: string, label: string) {
    const confirmed = window.confirm(t.admin.confirmDeleteCity?.replace("{label}", label) || `Delete city "${label}" and all listings for this city?`);
    if (!confirmed) return;

    setDeletingValue(value);
    try {
      const res = await fetch(`/api/cities?value=${encodeURIComponent(value)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (t.admin.deleteCityFailed || "Failed to delete city"));
      toast.success((t.admin.cityDeleted || "City deleted.") + ` ${(data.deletedListings || 0)} ${t.admin.deletedListingsSuffix || "listings."}`);
      await loadCities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (commonText.error || "Something went wrong"));
    } finally {
      setDeletingValue("");
    }
  }

  useEffect(() => {
    loadCities().catch(() => setCities([]));
  }, []);

  function startEdit(city: CityItem) {
    setEditingValue(city.value);
    setSelectedFile(null);
    setDraft({
      label: city.label || "",
      region: city.region || "",
      image: city.image || "",
      description: city.description || ""
    });
  }

  function cancelEdit() {
    setEditingValue("");
    setSelectedFile(null);
  }

  async function saveCity(city: CityItem) {
    setSavingValue(city.value);
    try {
      const nextImage = selectedFile ? await uploadImage(selectedFile) : draft.image;
      const res = await fetch("/api/cities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: city.value,
          ...draft,
          image: nextImage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update city");

      setCities((current) => current.map((item) => (item.value === city.value ? data.city : item)));
      setEditingValue("");
      setSelectedFile(null);
      toast.success(adminText.cityUpdated || "City banner updated.");
      await loadCities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (commonText.error || "Something went wrong"));
    } finally {
      setSavingValue("");
    }
  }

  return (
    <div id="city-admin" className="surface overflow-hidden border-none shadow-xl rounded-[2rem] bg-white flex flex-col">
      <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between shrink-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            {adminText.cityBannerEditor || "Edit city banners"}
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {adminText.availableCitiesLabel || `Available cities`}
          </h2>
        </div>
        <p className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full inline-flex self-start sm:self-auto">
          {cities.length} {adminText.cities || "cities"}
        </p>
      </div>

      <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh] no-scrollbar">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const isEditing = editingValue === city.value;
            const previewImage = isEditing ? draft.image || city.image || fallbackImage : city.image || fallbackImage;

            return (
              <article key={city.value} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-[16/9]">
                  <SafeImage src={previewImage} alt={city.label} fill className="object-cover" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="p-4">
                  {!isEditing ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-black text-slate-950">{city.label}</h4>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{city.region || "Albania"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCity(city.value, city.label)}
                          disabled={deletingValue === city.value}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                          aria-label={t.admin.deleteBtn || "Delete"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{city.description}</p>
                      <Button type="button" onClick={() => startEdit(city)} className="mt-4 w-full">
                        <Edit3 className="h-4 w-4" />
                        {adminText.editBanner || "Edit banner"}
                      </Button>
                    </>
                  ) : (
                    <form
                      className="space-y-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveCity(city);
                      }}
                    >
                      <Input label={t.admin.cityNameLabel || "City name"} value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} required />
                      <Input label={t.admin.regionLabel || "Region"} value={draft.region} onChange={(event) => setDraft((current) => ({ ...current, region: event.target.value }))} />
                      <Input label={t.admin.imageLabel || "Image URL"} value={draft.image} onChange={(event) => setDraft((current) => ({ ...current, image: event.target.value }))} placeholder="https://..." error={imageUrlError(draft.image, language === "en")} />
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          {selectedFile ? selectedFile.name : adminText.uploadBanner || "Upload banner"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                        />
                      </label>
                      <Textarea label={t.admin.descriptionLabel || "Description"} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={savingValue === city.value}>
                          <Save className="h-4 w-4" />
                          {savingValue === city.value ? (t.common.loading || "Saving...") : (adminText.saveChanges || "Save changes")}
                        </Button>
                        <Button type="button" variant="ghost" onClick={cancelEdit} disabled={savingValue === city.value}>
                          <X className="h-4 w-4" />
                          {commonText.cancel || "Cancel"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
