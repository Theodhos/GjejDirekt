"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categories, getCategoryFormValue, getSubcategoryFormValue } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import LocationPicker from "@/components/forms/LocationPicker";

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
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  amenities?: string[];
  tags?: string[];
  highlights?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    x?: string;
  };
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
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFormValue(listing.category));
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    getSubcategoryFormValue(listing.category, listing.subcategory)
  );
  const [currentImages, setCurrentImages] = useState<string[]>(listing.images || []);

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const files = Array.from(formData.getAll("images")).filter(Boolean) as File[];
      const uploadedImages: string[] = [];

      for (const file of files) {
        try {
          uploadedImages.push(await uploadImage(file));
        } catch {
          // Continue with the rest of the update if one image fails.
        }
      }

      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(`/api/listings/${listing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          images: [...currentImages, ...uploadedImages]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      toast.success("Listing updated");
      router.push(`/listings/${data.listing.slug}`);
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
        <Input name="title" label="Title" defaultValue={listing.title} required />
        <Input name="country" label="Country" defaultValue={listing.country || ""} />
      </div>
      <LocationPicker
        defaultValue={listing.location}
        defaultCoordinates={listing.coordinates}
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="currency" label="Currency" defaultValue={listing.currency || "USD"} />
        <Input name="address" label="Street address" defaultValue={listing.address || ""} />
      </div>
      <Textarea name="description" label="Description" defaultValue={listing.description} required />
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          name="category"
          label="Category"
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setSelectedSubcategory("");
          }}
          options={[{ label: "Select a category", value: "" }, ...categories.map((item) => ({ label: item.label, value: item.value }))]}
        />
        <Select
          name="subcategory"
          label="Subcategory"
          value={selectedSubcategory}
          onChange={(event) => setSelectedSubcategory(event.target.value)}
          options={[{ label: "Select a subcategory", value: "" }, ...subcategories.map((item) => ({ label: item.label, value: item.value }))]}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="price" label="Price" type="number" defaultValue={listing.price || ""} />
        <Input name="priceFrom" label="Price From" type="number" defaultValue={listing.priceFrom || ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="amenities" label="Amenities" defaultValue={(listing.amenities || []).join(", ")} />
        <Input name="tags" label="Tags" defaultValue={(listing.tags || []).join(", ")} />
        <Input name="contactPhone" label="Phone" defaultValue={listing.contactInfo?.phone || ""} />
      </div>
      <Textarea name="highlights" label="Highlights" defaultValue={(listing.highlights || []).join(", ")} />
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="contactEmail" label="Email" type="email" defaultValue={listing.contactInfo?.email || ""} />
        <Input name="website" label="Website" defaultValue={listing.contactInfo?.website || ""} />
        <Input name="instagram" label="Instagram" defaultValue={listing.socialLinks?.instagram || ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="facebook" label="Facebook" defaultValue={listing.socialLinks?.facebook || ""} />
        <Input name="tiktok" label="TikTok" defaultValue={listing.socialLinks?.tiktok || ""} />
        <Input name="x" label="X / Twitter" defaultValue={listing.socialLinks?.x || ""} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Current images</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {currentImages.length ? (
            currentImages.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setCurrentImages((items) => items.filter((item) => item !== image))}
                className="group relative overflow-hidden rounded-3xl border border-slate-200"
                title="Click to remove"
              >
                <div className="relative h-32 w-full">
                  <Image src={image} alt="Current listing" fill className="object-cover" />
                </div>
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-white opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100">
                  Remove
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500">No current images.</p>
          )}
        </div>
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Add more images</span>
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
