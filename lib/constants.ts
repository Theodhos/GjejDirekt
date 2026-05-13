export type CategorySubcategory = {
  value: string;
  label: string;
  aliases?: string[];
};

export type CategoryDefinition = {
  value: string;
  label: string;
  aliases: string[];
  image: string;
  subcategories: CategorySubcategory[];
};

export const categories: CategoryDefinition[] = [
  {
    value: "akomodim",
    label: "Akomodim",
    aliases: ["stays", "stay", "accommodation", "hotel", "hotels", "resort", "resorts", "villa", "villas", "homestays"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    tags: ["Wifi", "AC", "Parking", "Kuzhinë", "TV", "Pishinë", "Pamje nga deti"],
    subcategories: [
      { value: "hotel", label: "Hotel", aliases: ["hotels"] },
      { value: "resort", label: "Resort", aliases: ["resorts"] },
      { value: "vila", label: "Vila", aliases: ["villa", "villas"] },
      { value: "apartament", label: "Apartament", aliases: ["apartments", "apartment"] },
      { value: "guesthouse", label: "Guesthouse", aliases: ["homestays", "home stay"] }
    ]
  },
  {
    value: "restorante",
    label: "Restorante",
    aliases: ["restaurants", "restaurant", "food", "dining", "cafe", "bar"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    tags: ["Wifi", "Outdoor Seating", "Vegan Options", "Rezervime", "Parking", "Live Music"],
    subcategories: [
      { value: "tradicional", label: "Tradicional" },
      { value: "internacional", label: "Internacional" },
      { value: "fast-food", label: "Fast Food", aliases: ["fast food"] },
      { value: "kafe-bar", label: "Kafe & Bar", aliases: ["cafe", "bar"] }
    ]
  },
  {
    value: "atraksione",
    label: "Atraksione",
    aliases: ["attractions", "attraction", "things to do", "things-to-do", "experience", "experiences", "tour", "tours"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Entry Fee", "Family Friendly", "Guide Available", "Parking"],
    subcategories: [
      { value: "natyre", label: "Natyrë", aliases: ["nature"] },
      { value: "historike", label: "Historike", aliases: ["historical"] },
      { value: "muze", label: "Muze", aliases: ["museum"] },
      { value: "plazh", label: "Plazh", aliases: ["beach"] }
    ]
  },
  {
    value: "evente",
    label: "Evente",
    aliases: ["events", "event", "festival", "concerts", "concert"],
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    tags: ["Tickets Needed", "Outdoor", "Indoor", "Parking"],
    subcategories: [
      { value: "koncerte", label: "Koncerte", aliases: ["concerts"] },
      { value: "festivale", label: "Festivale", aliases: ["festivals"] },
      { value: "panaire", label: "Panaire", aliases: ["fairs"] },
      { value: "dasma", label: "Dasma", aliases: ["weddings"] }
    ]
  },
  {
    value: "sherbime-turistike",
    label: "Shërbime Turistike",
    aliases: ["tourism services", "services", "tour services", "travel services", "travel agencies", "guide"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["English Speaking", "Licensed Guide", "Group Discount"],
    subcategories: [
      { value: "guida", label: "Guida", aliases: ["guides"] },
      { value: "agjenci", label: "Agjenci", aliases: ["agency", "agencies"] },
      { value: "ekskursione", label: "Ekskursione", aliases: ["excursions"] },
      { value: "rezervime", label: "Rezervime", aliases: ["bookings"] }
    ]
  },
  {
    value: "produkte-lokale",
    label: "Produkte Lokale",
    aliases: ["local products", "products", "souvenirs", "artisan", "handmade"],
    image: "https://images.unsplash.com/photo-1516685018646-549d9f3a1f7f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Handmade", "Organic", "Shipping Available"],
    subcategories: [
      { value: "artizanat", label: "Artizanat", aliases: ["handmade"] },
      { value: "ushqimore", label: "Ushqimore", aliases: ["groceries"] },
      { value: "suvenire", label: "Suvenire", aliases: ["souvenirs"] },
      { value: "agro", label: "Agro-Produkte", aliases: ["agriculture", "farm"] }
    ]
  },
  {
    value: "transport",
    label: "Transport",
    aliases: ["transportation", "transfers", "car rental", "transfer", "taxi", "boat"],
    image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80",
    tags: ["AC", "English Speaking Driver", "Airport Pickup"],
    subcategories: [
      { value: "aeroport", label: "Aeroport", aliases: ["airport transfer", "airport"] },
      { value: "makine-me-qira", label: "Makina me Qira", aliases: ["car rental"] },
      { value: "varka", label: "Varka", aliases: ["boat ride", "boat"] },
      { value: "taksi", label: "Taksi", aliases: ["taxi"] }
    ]
  }
];

export const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected"
} as const;

export const allSubcategories = categories.flatMap((category) => category.subcategories);

export function getCategoryByValue(value?: string) {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  return categories.find(
    (category) =>
      category.value === normalized ||
      category.label.toLowerCase() === normalized ||
      category.aliases.includes(normalized)
  );
}

export function getCategoryLabel(value?: string) {
  return getCategoryByValue(value)?.label || value || "";
}

export function getSubcategoryLabel(categoryValue?: string, subcategoryValue?: string) {
  if (!subcategoryValue) return "";
  const category = getCategoryByValue(categoryValue);
  const normalized = subcategoryValue.toLowerCase();
  const subcategory = category?.subcategories.find(
    (item) => item.value === normalized || item.label.toLowerCase() === normalized || item.aliases?.includes(normalized)
  );
  return subcategory?.label || subcategoryValue;
}

export function getCategorySearchValues(value: string) {
  const category = getCategoryByValue(value);
  if (!category) return [value];
  return Array.from(new Set([category.value, category.label.toLowerCase(), ...category.aliases]));
}

export function getSubcategorySearchValues(categoryValue: string | undefined, subcategoryValue: string) {
  const category = getCategoryByValue(categoryValue);
  if (!category) return [subcategoryValue];

  const subcategory = category.subcategories.find(
    (item) =>
      item.value === subcategoryValue.toLowerCase() ||
      item.label.toLowerCase() === subcategoryValue.toLowerCase() ||
      item.aliases?.includes(subcategoryValue.toLowerCase())
  );

  if (!subcategory) return [subcategoryValue];

  return Array.from(new Set([subcategory.value, subcategory.label.toLowerCase(), ...(subcategory.aliases || [])]));
}

export function getCategoryFormValue(value?: string) {
  return getCategoryByValue(value)?.value || value || "";
}

export function getSubcategoryFormValue(categoryValue?: string, subcategoryValue?: string) {
  if (!subcategoryValue) return "";
  const category = getCategoryByValue(categoryValue);
  const normalized = subcategoryValue.toLowerCase();
  const subcategory = category?.subcategories.find(
    (item) => item.value === normalized || item.label.toLowerCase() === normalized || item.aliases?.includes(normalized)
  );
  return subcategory?.value || subcategoryValue;
}
