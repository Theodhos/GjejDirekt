"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { MapPinned, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useLanguage } from "@/context/LanguageContext";

const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Upload failed");
  return String(data.url || "");
}

export default function CityStudio() {
  const { t } = useLanguage();
  const adminText = t.admin as Record<string, string>;
  const commonText = t.common as Record<string, string>;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const previewImage = selectedFile ? URL.createObjectURL(selectedFile) : fallbackImage;

  function reset() {
    setLabel("");
    setRegion("");
    setDescription("");
    setSelectedFile(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const nextImage = selectedFile ? await uploadImage(selectedFile) : "";
      const response = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label.trim(),
          region: region.trim(),
          description: description.trim(),
          image: nextImage
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (adminText.addCityFailed || "Failed to add city"));

      toast.success(adminText.cityAdded || "City added.");
      reset();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (commonText.error || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="city-studio" className="surface scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow inline-flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-teal-600" />
            {adminText.cityStudio || "City studio"}
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
            {adminText.cityPublishTitle || "Add a new city directly from admin"}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            {adminText.cityPublishDesc ||
              "Create a destination with a title, description, and banner photo. New cities appear in the cities list where you can edit them anytime."}
          </p>
        </div>
        <div className="lg:min-w-[320px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-50">
            <SafeImage src={previewImage} alt={label || "City banner"} fill className="object-cover" sizes="320px" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={adminText.cityNameLabel || "City title"}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder={adminText.cityNamePlaceholder || "e.g. Sarandë"}
              required
            />
            <Input
              label={adminText.regionLabel || "Region"}
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder={adminText.regionPlaceholder || "e.g. Albanian Riviera"}
            />
          </div>

          <Textarea
            label={adminText.descriptionLabel || "Description"}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={adminText.cityDescPlaceholder || "Short description shown on the city banner..."}
          />

          <div>
            <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {adminText.bannerPhotoLabel || "Banner photo"}
            </span>
            {selectedFile ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Upload className="h-4 w-4 shrink-0" />
                  <span className="truncate">{selectedFile.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 hover:text-rose-600"
                  aria-label={commonText.cancel || "Remove"}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                <Upload className="h-4 w-4" />
                {adminText.chooseFile || "Choose a photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                />
              </label>
            )}
            <p className="mt-1.5 text-xs text-slate-500">
              {adminText.bannerPhotoHint || "Only a banner photo is used for the city."}
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (commonText.loading || "Saving...") : (adminText.addCityBtn || "Add city")}
          </Button>
        </form>
      </div>
    </section>
  );
}
