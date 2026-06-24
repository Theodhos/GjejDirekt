"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminCityManager() {
  const { t } = useLanguage();
  const commonText = t.common as Record<string, string>;
  const [loading, setLoading] = useState(false);
  const [deletingValue, setDeletingValue] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [label, setLabel] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  async function loadCities() {
    const res = await fetch("/api/cities", { cache: "no-store" });
    const data = await res.json();
    setCities(data.cities || []);
  }

  async function deleteCity(value: string, label: string) {
    const confirmed = window.confirm(t.admin.confirmDeleteCity?.replace('{label}', label) || `Delete city "${label}" and all listings for this city?`);
    if (!confirmed) return;

    setDeletingValue(value);
    try {
      const res = await fetch(`/api/cities?value=${encodeURIComponent(value)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (t.admin.deleteCityFailed || "Failed to delete city"));
      toast.success((t.admin.cityDeleted || "City deleted.") + ` ${(data.deletedListings || 0)} ${t.admin.deletedListingsSuffix || 'listings.'}`);
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, region, image, description, country: "Albania" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (t.admin.addCityFailed || "Failed to add city"));
      toast.success(t.admin.cityAddedMessage || "City added. Home and city page will update automatically.");
      setLabel("");
      setRegion("");
      setImage("");
      setDescription("");
      await loadCities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (commonText.error || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="city-admin" className="surface p-6 sm:p-8">
      <h2 className="text-2xl font-black text-slate-950">{t.admin.addCityTitle || 'Add Albania City (Admin)'}</h2>
      <p className="mt-2 text-sm text-slate-600">{t.admin.addCityDesc || 'Only admin can add new Albania cities. They appear automatically on home and city pages.'}</p>

      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label={t.admin.cityNameLabel || 'City name'} value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t.admin.cityNamePlaceholder || 'p.sh. Himare'} required />
        <Input label={t.admin.regionLabel || 'Region'} value={region} onChange={(e) => setRegion(e.target.value)} placeholder={t.admin.regionPlaceholder || 'South coast'} />
        <Input label={t.admin.imageLabel || 'Image URL'} value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="md:col-span-2" />
        <Textarea label={t.admin.descriptionLabel || 'Description'} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.admin.descriptionPlaceholder || 'Short city description'} className="md:col-span-2" />
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading}>{loading ? (t.common.loading || 'Adding...') : (t.admin.addCityBtn || 'Add city')}</Button>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t.admin.availableCitiesLabel || `Available cities (${cities.length})`}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cities.map((city) => (
            <div key={city.value} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              <span>{city.label}</span>
              <button
                type="button"
                onClick={() => deleteCity(city.value, city.label)}
                disabled={deletingValue === city.value}
                className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-200 disabled:opacity-50"
              >
                {deletingValue === city.value ? (t.common.loading || 'Deleting...') : (t.admin.deleteBtn || 'Delete')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
