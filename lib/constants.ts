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
  tags?: string[];
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
      { value: "guesthouse", label: "Bujtinë", aliases: ["homestays", "home stay", "bujtine", "guest house"] },
      { value: "vila", label: "Vila", aliases: ["villa", "villas"] },
      { value: "apartament", label: "Apartament", aliases: ["apartments", "apartment"] },
      { value: "hostel", label: "Hostel", aliases: ["hostels"] },
      { value: "resort", label: "Resort", aliases: ["resorts"] },
      { value: "agroturizem", label: "Agroturizëm", aliases: ["agrotourism", "agroturizem", "farm stay"] },
      { value: "camping", label: "Camping", aliases: ["camp", "kamping", "glamping"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "restorante",
    label: "Restorante",
    aliases: ["restaurants", "restaurant", "food", "dining", "cafe", "bar"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    tags: ["Wi-Fi", "Ulje jashtë", "Opsione vegane", "Rezervime", "Parkim", "Muzikë live"],
    subcategories: [
      { value: "tradicional", label: "Restorant Tradicional", aliases: ["traditional"] },
      { value: "restorant", label: "Restorant", aliases: ["restaurant"] },
      { value: "internacional", label: "Internacional", aliases: ["international"] },
      { value: "fast-food", label: "Fast Food", aliases: ["fast food"] },
      { value: "pizzeri", label: "Pizzeri", aliases: ["pizzeria", "pizza"] },
      { value: "kafene", label: "Kafene", aliases: ["cafe", "coffee"] },
      { value: "bar-lounge", label: "Bar / Lounge", aliases: ["bar", "lounge", "pub"] },
      { value: "kafe-bar", label: "Kafe & Bar" },
      { value: "embeltore", label: "Ëmbëltore", aliases: ["pastry", "bakery", "embeltore"] },
      { value: "verari", label: "Verari", aliases: ["winery", "wine bar"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "atraksione",
    label: "Atraksione",
    aliases: ["attractions", "attraction", "things to do", "things-to-do", "experience", "experiences", "tour", "tours"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Biletë hyrjeje", "Përshtatshëm për familje", "Udhëzues i disponueshëm", "Parkim"],
    subcategories: [
      { value: "natyre", label: "Natyrore", aliases: ["nature", "natyrore"] },
      { value: "historike", label: "Historike", aliases: ["historical", "history"] },
      { value: "kulturore", label: "Kulturore", aliases: ["cultural", "culture"] },
      { value: "fetare", label: "Fetare", aliases: ["religious", "church", "mosque"] },
      { value: "muze", label: "Muze", aliases: ["museum"] },
      { value: "kala", label: "Kala", aliases: ["castle", "fortress"] },
      { value: "park", label: "Park", aliases: ["parks", "national park"] },
      { value: "plazh", label: "Plazh", aliases: ["beach"] },
      { value: "liqen", label: "Liqen", aliases: ["lake"] },
      { value: "ujevare", label: "Ujëvarë", aliases: ["waterfall", "ujevare"] },
      { value: "kanion", label: "Kanion", aliases: ["canyon"] },
      { value: "shpelle", label: "Shpellë", aliases: ["cave", "shpelle"] },
      { value: "pike-panoramike", label: "Pikë Panoramike", aliases: ["viewpoint", "panorama"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "aktivitete",
    label: "Aktivitete & Ture",
    aliases: ["activities", "activity", "tours", "tour", "aktivitete", "adventure", "excursions"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
    tags: ["Guide i certifikuar", "Pajisjet përfshihen", "Transport i përfshirë", "Ushqim i përfshirë", "I përshtatshëm për familje", "Lejohen kafshët", "Parkim", "Rezervim i nevojshëm"],
    subcategories: [
      { value: "hiking", label: "Hiking", aliases: ["trekking", "ecje"] },
      { value: "atv-buggy", label: "ATV / Buggy", aliases: ["atv", "buggy", "quad"] },
      { value: "zipline", label: "Zipline", aliases: ["zip line"] },
      { value: "rafting", label: "Rafting", aliases: ["raft"] },
      { value: "kayak", label: "Kayak", aliases: ["kayaking", "kajak"] },
      { value: "boat-tour", label: "Boat Tour", aliases: ["boat", "tur me varke"] },
      { value: "zhytje", label: "Zhytje", aliases: ["diving", "scuba", "snorkeling"] },
      { value: "kalerim", label: "Kalërim", aliases: ["horse riding", "kalerim"] },
      { value: "ski", label: "Ski", aliases: ["skiing", "snowboard"] },
      { value: "paragliding", label: "Paragliding", aliases: ["parapente"] },
      { value: "guide-turistik", label: "Guide Turistik", aliases: ["guide", "guida", "tour guide"] },
      { value: "tur-kulturor", label: "Tur Kulturor", aliases: ["cultural tour"] },
      { value: "tur-gastronomik", label: "Tur Gastronomik", aliases: ["food tour", "gastronomy"] },
      { value: "tur-me-vere", label: "Tur me Verë", aliases: ["wine tour", "wine tasting"] },
      { value: "tur-me-biciklete", label: "Tur me Biçikletë", aliases: ["bike tour", "cycling"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "evente",
    label: "Evente",
    aliases: ["events", "event", "festival", "concerts", "concert"],
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    tags: ["Nevojiten bileta", "Në natyrë", "Brenda", "Parkim"],
    subcategories: [
      { value: "festivale", label: "Festival", aliases: ["festivals", "festival"] },
      { value: "koncerte", label: "Koncert", aliases: ["concerts", "concert"] },
      { value: "feste-tradicionale", label: "Festë Tradicionale", aliases: ["traditional feast", "feste"] },
      { value: "event-gastronomik", label: "Event Gastronomik", aliases: ["food event", "gastronomy"] },
      { value: "event-kulturor", label: "Event Kulturor", aliases: ["cultural event"] },
      { value: "event-sportiv", label: "Event Sportiv", aliases: ["sports event", "sportive"] },
      { value: "panaire", label: "Panair", aliases: ["fairs", "fair"] },
      { value: "workshop", label: "Workshop", aliases: ["workshops", "punetori"] },
      { value: "ekspozite", label: "Ekspozitë", aliases: ["exhibition", "ekspozita"] },
      { value: "dasma", label: "Dasma", aliases: ["weddings", "wedding"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "transport",
    label: "Transport",
    aliases: ["transportation", "transfers", "car rental", "transfer", "taxi", "boat"],
    image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80",
    tags: ["AC", "Shofer që flet anglisht", "Marrje në aeroport"],
    subcategories: [
      { value: "makine-me-qira", label: "Makina me Qira", aliases: ["car rental", "rent a car"] },
      { value: "motocikleta-me-qira", label: "Motoçikleta me Qira", aliases: ["motorbike rental", "scooter"] },
      { value: "bicikleta-me-qira", label: "Biçikleta me Qira", aliases: ["bike rental", "bicycle"] },
      { value: "taksi", label: "Taksi", aliases: ["taxi"] },
      { value: "shuttle", label: "Shuttle", aliases: ["shuttle bus"] },
      { value: "aeroport", label: "Transfer Aeroporti", aliases: ["airport transfer", "airport"] },
      { value: "minibus", label: "Minibus", aliases: ["van", "furgon"] },
      { value: "varka", label: "Transport Detar", aliases: ["boat ride", "boat", "varka", "ferry"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "produkte-lokale",
    label: "Shopping & Produkte Lokale",
    aliases: ["local products", "products", "souvenirs", "artisan", "handmade", "shopping"],
    image: "https://images.unsplash.com/photo-1516685018646-549d9f3a1f7f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Artizanal", "Organik", "Transport i disponueshëm"],
    subcategories: [
      { value: "ushqimore", label: "Ushqime Tradicionale", aliases: ["groceries", "food", "ushqime"] },
      { value: "djathe-bulmet", label: "Djathë & Bulmet", aliases: ["cheese", "dairy", "djathe"] },
      { value: "mjalte", label: "Mjaltë", aliases: ["honey", "mjalte"] },
      { value: "vere-raki", label: "Verë & Raki", aliases: ["wine", "raki", "vere"] },
      { value: "embelsira-tradicionale", label: "Ëmbëlsira Tradicionale", aliases: ["sweets", "desserts", "embelsira"] },
      { value: "artizanat", label: "Artizanat", aliases: ["handmade", "artisan"] },
      { value: "suvenire", label: "Suvenire", aliases: ["souvenirs"] },
      { value: "agro", label: "Produkte Bio", aliases: ["agriculture", "farm", "organic", "bio"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "sherbime-turistike",
    label: "Shërbime Turistike",
    aliases: ["tourism services", "services", "tour services", "travel services", "travel agencies", "guide"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Flet anglisht", "Udhëzues i licencuar", "Zbritje për grupe"],
    subcategories: [
      { value: "agjenci", label: "Agjenci Turistike", aliases: ["agency", "agencies", "travel agency"] },
      { value: "organizim-eventesh", label: "Organizim Eventesh", aliases: ["event organisation", "event planning"] },
      { value: "foto-video", label: "Fotograf / Videograf", aliases: ["photographer", "videographer", "foto"] },
      { value: "exchange-office", label: "Exchange Office", aliases: ["exchange", "kembim valutor"] },
      { value: "lavanderi", label: "Lavanderi", aliases: ["laundry"] },
      { value: "ruajtje-bagazhesh", label: "Ruajtje Bagazhesh", aliases: ["luggage storage", "bagazhe"] },
      { value: "qira-pajisjesh", label: "Qira Pajisjesh", aliases: ["equipment rental", "rent equipment"] },
      { value: "perkthyes", label: "Përkthyes", aliases: ["translator", "perkthyes"] },
      { value: "concierge", label: "Concierge", aliases: ["concierge service"] },
      { value: "sim-card", label: "SIM Card / eSIM", aliases: ["sim", "esim"] },
      { value: "sigurime-udhetimi", label: "Sigurime Udhëtimi", aliases: ["travel insurance", "sigurime"] },
      { value: "guida", label: "Guida", aliases: ["guides"] },
      { value: "ekskursione", label: "Ekskursione", aliases: ["excursions"] },
      { value: "rezervime", label: "Rezervime", aliases: ["bookings"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  }
];

export const statusLabels = {
  pending: "Në pritje",
  approved: "Miratuar",
  rejected: "Refuzuar"
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
