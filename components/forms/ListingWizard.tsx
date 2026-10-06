"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  CalendarClock,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Crop,
  Facebook,
  FileText,
  FileType,
  Globe,
  ImagePlus,
  Instagram,
  Loader2,
  Lock,
  MapPin,
  Music,
  Play,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X
} from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import ImageCropper from "@/components/ui/ImageCropper";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import { categories, getCategoryActions, getCategoryFormValue, getSubcategoryActions, getSubcategoryFormValue } from "@/lib/constants";
import { PRICE_CURRENCY, startingPrice } from "@/lib/pricing";
import { compressImageFile, fileFromDataUrl, readFileAsDataUrl } from "@/lib/image-tools";
import { clearDraft, readDraft, writeDraft } from "@/lib/listing-draft";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";
import CatalogManager from "@/components/dashboard/CatalogManager";

export type WizardListing = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  /** Manual override of which WhatsApp flows this listing offers; empty/absent falls back to the category default. */
  actions?: string[];
  location?: string;
  country?: string;
  address?: string;
  currency?: string;
  price?: number;
  priceFrom?: number;
  priceRange?: string;
  duration?: string;
  difficulty?: string;
  season?: string;
  maxParticipants?: number;
  minAge?: number;
  childPrice?: number;
  whatToBring?: string[];
  cuisines?: string[];
  languages?: string[];
  tags?: string[];
  amenities?: string[];
  highlights?: string[];
  contactInfo?: { phone?: string; email?: string; website?: string };
  socialLinks?: { instagram?: string; facebook?: string; tiktok?: string; youtube?: string; x?: string };
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
  verified?: boolean;
  status?: string;
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

/** All wizard copy lives here so the whole flow can be re-worded in one place. */
const COPY = {
  al: {
    stepWord: "Hapi",
    ofWord: "nga",
    steps: [
      { title: "Profili i Biznesit", desc: "7 fushat universale: emri, përshkrimi, WhatsApp, kategoria, qyteti, harta dhe fotoja." },
      { title: "Katalogu", desc: "8 fushat universale të çdo artikulli, të grupuara sipas kategorive." },
      { title: "Opsione Verified", desc: "Funksione shtesë që aktivizohen pasi blihet paketa." }
    ],
    category: "Kategoria e Homepage",
    categorySelected: "Kategoria e zgjedhur",
    changeCategory: "Ndrysho",
    selectCategory: "Zgjidhni një kategori",
    subcategory: "Nënkategoria",
    subcategoryType: "Lloji",
    subcategoryCategory: "Kategoria",
    selectSubcategory: "Zgjidhni një opsion",
    actionsTitle: "Si e marrin klientët shërbimin",
    actionsHint: "Të para-zgjedhura sipas kategorisë — ndryshojini nëse biznesi juaj punon ndryshe.",
    enableOrders: "Mundëso Porosi Online (Shportë)",
    enableOrdersHint: "Klientët shtojnë artikuj dhe e dërgojnë porosinë në WhatsApp.",
    enableReservations: "Mundëso Rezervim me Datë/Orë",
    enableReservationsHint: "Klientët zgjedhin datë/orë dhe kërkojnë rezervim në WhatsApp.",
    actionsRequired: "Zgjidhni të paktën një mënyrë si klientët ju kontaktojnë.",
    title: "Emri i Biznesit",
    titleActivity: "Emri i aktivitetit / turit",
    titlePlaceholder: "p.sh. Bujtina Sophia",
    titleActivityPlaceholder: "p.sh. Tur me varkë në Ksamil",
    titleHint: "Emri publik i brandit, siç e njohin klientët.",
    city: "Qyteti",
    cityPlaceholder: "Tiranë",
    village: "Fshati / Zona",
    selectVillage: "Zgjidh fshatin (opsionale)",
    description: "Përshkrimi i Biznesit",
    descriptionPlaceholder: "Prezantim i shkurtër i biznesit: çfarë ofroni dhe çfarë ju bën të veçantë.",
    descriptionHint: "Në faqe shfaqet vetëm 1 rresht, me butonin «Shiko më shumë» për pjesën tjetër.",
    cover: "Foto Profili (opsionale)",
    coverCta: "Ngarko foto ose logo",
    coverHint: "Foto e ambientit ose logoja. Nëse lihet bosh, shfaqet një rreth elegant me shkronjat e para të emrit.",
    coverReplace: "Ndrysho foton",
    coverCrop: "Prit foton",
    coverRemove: "Hiq",
    coverCurrent: "Fotoja aktuale",
    phone: "Telefon",
    whatsapp: "Numri i WhatsApp-it",
    whatsappHint: "Në format ndërkombëtar, p.sh. +355 69 123 4567 — këtu shkojnë porositë dhe rezervimet.",
    address: "Adresa / Vendndodhja",
    addressPlaceholder: "Rruga, numri i ndërtesës, zona",
    maps: "Linku i Google Maps (opsionale)",
    mapsPlaceholder: "https://maps.app.goo.gl/...",
    mapsHint: "Kthehet në butonin «📍 Shiko vlerësimet dhe hartën». Në Google Maps: gjeni vendin tuaj → «Share» → «Copy link».",
    mapsOpen: "Hap Google Maps",
    price: "Nga çmimi",
    priceHint: "Opsionale — por listimet me çmim marrin dukshëm më shumë klikime. Çmimet janë gjithmonë në euro.",
    priceRange: "Interval çmimesh",
    priceRangeHint: "€ ekonomik · €€ mesatar · €€€ premium",
    cuisines: "Kuzhinat",
    cuisinesHint: "Zgjidhni llojet e kuzhinës që ofroni.",
    languagesLabel: "Gjuhët",
    languagesHint: "Gjuhët në të cilat ofrohet shërbimi.",
    duration: "Kohëzgjatja",
    durationVisit: "Kohëzgjatja e vizitës",
    durationPlaceholder: "p.sh. 2 orë",
    difficulty: "Vështirësia",
    selectDifficulty: "Zgjidhni nivelin",
    maxParticipants: "Numri maksimal i pjesëmarrësve",
    minAge: "Mosha minimale",
    season: "Sezoni",
    selectSeason: "Zgjidhni sezonin",
    guideLanguages: "Gjuha e guidës",
    childPrice: "Çmimi për fëmijë",
    whatToBring: "Çfarë duhet të marrë me vete?",
    whatToBringHint: "Zgjidhni çfarë duhet të sjellë vizitori.",
    email: "Email (opsionale)",
    checkTimes: "Check-in / Check-out",
    checkIn: "Check-in",
    checkOut: "Check-out",
    businessHours: "Orari",
    businessOpen: "Hapet",
    businessClose: "Mbyllet",
    eventDate: "Data e eventit",
    eventTime: "Ora e eventit",
    transportType: "Lloji i transportit",
    transportPlaceholder: "p.sh. Taksi, Varkë, Makinë me qira...",
    tips: "Këshilla / Informacion shtesë (opsionale)",
    tipsPlaceholder: "p.sh. Koha më e mirë për vizitë, biletat, parkimi...",
    features: "Karakteristikat",
    featuresHint: "Zgjidhni ato që ju përshtaten ose shkruani tuajat dhe shtypni +.",
    customTag: "Shto karakteristikë...",
    addTag: "Shto",
    verifiedTitle: "Opsione për Verified",
    verifiedSubtitle: "Këto fusha aktivizohen automatikisht kur listimi juaj verifikohet nga administratori.",
    verifiedActiveTitle: "Listimi juaj është Verified",
    verifiedActiveSubtitle: "Të gjitha opsionet e mëposhtme janë aktive — plotësojini për të marrë më shumë kontakte.",
    website: "Website",
    bookNow: "Book Now — linku i rezervimit",
    bookTable: "Book Table — rezervo tavolinë",
    bookTickets: "Link për bileta (Book Now)",
    bookShop: "Dyqan online",
    menuPdf: "Menu PDF / linku i menusë",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    gallery: "Galeria",
    galleryLocked: "Galeri deri në 10 foto",
    galleryFree: "Falas: 1 foto kryesore",
    galleryVerified: "Verified: deri në 10 foto",
    galleryAdd: "Shto foto",
    galleryCount: "foto nga 10",
    verifiedNote: "Bëhu Verified për të aktivizuar këto funksione.",
    verifiedCta: "Bëhu Verified",
    back: "Kthehu",
    next: "Vazhdo",
    publish: "Publiko Biznesin",
    saveAndContinue: "Ruaj dhe vazhdo te Katalogu",
    profileSaved: "Profili u ruajt — vazhdoni me katalogun",
    draftNote: "Profili ruhet si draft. Biznesi publikohet vetëm në hapin e fundit.",
    publishFinalNote: "Biznesi shkon te administratori për miratim dhe shfaqet publikisht pas aprovimit.",
    publishing: "Duke publikuar...",
    publishNote: "Mund ta përditësoni profilin tuaj në çdo kohë.",
    save: "Ruaj Ndryshimet",
    saving: "Duke ruajtur...",
    saveNote: "Mund ta përditësoni profilin tuaj në çdo kohë.",
    reviewNote: "Listimi shkon te administratori për miratim dhe publikohet pas aprovimit.",
    reviewNoteEdit: "Pas ruajtjes, ndryshimet kalojnë sërish në rishikim nga administratori.",
    required: "Kjo fushë është e detyrueshme.",
    descriptionShort: "Përshkrimi duhet të ketë të paktën 30 karaktere.",
    coverRequired: "Fotoja kryesore është e detyrueshme.",
    invalidUrl: "Linku duhet të fillojë me http:// ose https://",
    invalidEmail: "Email-i nuk është i vlefshëm.",
    invalidWhatsapp: "Shkruajeni në format ndërkombëtar, p.sh. +355 69 123 4567.",
    fileTooLarge: "Fotoja nuk u përpunua dot. Provoni një foto tjetër.",
    galleryFull: "Mund të ngarkoni maksimumi 10 foto në galeri.",
    fixErrors: "Ju lutem plotësoni fushat e detyrueshme.",
    draftRestored: "Vazhduam aty ku e latë — të dhënat tuaja u ruajtën.",
    success: "Listimi u dërgua për miratim",
    updated: "Shërbimi u përditësua",
    catalogLocked: "Plotësoni dhe ruani profilin më parë — hapat e tjerë hapen me radhë.",
    catalogPublishedTitle: "Profili u ruajt si draft",
    catalogPublishedText:
      "Tani shtoni kategoritë (p.sh. «Krepa të ëmbla») dhe poshtë tyre produktet. Çdo gjë ruhet menjëherë; biznesi publikohet në hapin e fundit.",
    catalogHint:
      "Çdo artikull ruhet menjëherë sapo e shtoni ose e ndryshoni. Vetëm ju dhe administratori mund t'i menaxhoni.",
    finish: "Përfundo — shko te paneli",
    viewListing: "Shiko listimin"
  },
  en: {
    stepWord: "Step",
    ofWord: "of",
    steps: [
      { title: "Business profile", desc: "The 7 universal fields: name, description, WhatsApp, category, city, map and photo." },
      { title: "Catalog", desc: "The 8 universal fields of every item, grouped by category." },
      { title: "Verified options", desc: "Extra features unlocked once a package is bought." }
    ],
    category: "Homepage category",
    categorySelected: "Selected category",
    changeCategory: "Change",
    selectCategory: "Select a category",
    subcategory: "Subcategory",
    subcategoryType: "Type",
    subcategoryCategory: "Category",
    selectSubcategory: "Select an option",
    actionsTitle: "How customers get this service",
    actionsHint: "Pre-selected from the category — change it if your business works differently.",
    enableOrders: "Enable Online Orders (Cart)",
    enableOrdersHint: "Customers add items and send the order on WhatsApp.",
    enableReservations: "Enable Date/Time Reservations",
    enableReservationsHint: "Customers pick a date/time and request a booking on WhatsApp.",
    actionsRequired: "Pick at least one way for customers to reach you.",
    title: "Business name",
    titleActivity: "Activity / tour name",
    titlePlaceholder: "e.g. Bujtina Sophia",
    titleActivityPlaceholder: "e.g. Boat tour in Ksamil",
    titleHint: "The public brand name, as customers know it.",
    city: "City",
    cityPlaceholder: "Tirana",
    village: "Village / Area",
    selectVillage: "Select village (optional)",
    description: "Business description",
    descriptionPlaceholder: "A short introduction: what you offer and what makes you special.",
    descriptionHint: "On the page only one line shows, with a “See more” button for the rest.",
    cover: "Profile photo (optional)",
    coverCta: "Upload a photo or logo",
    coverHint: "A photo of the place or your logo. If left empty, an elegant circle with the name's initials is shown.",
    coverReplace: "Replace photo",
    coverCrop: "Crop photo",
    coverRemove: "Remove",
    coverCurrent: "Current photo",
    phone: "Phone",
    whatsapp: "WhatsApp number",
    whatsappHint: "In international format, e.g. +355 69 123 4567 — orders and bookings are sent here.",
    address: "Address / Location",
    addressPlaceholder: "Street, building number, area",
    maps: "Google Maps link (optional)",
    mapsPlaceholder: "https://maps.app.goo.gl/...",
    mapsHint: "Becomes the “📍 See reviews and the map” button. In Google Maps: find your place → “Share” → “Copy link”.",
    mapsOpen: "Open Google Maps",
    price: "From price",
    priceHint: "Optional — but listings with a price get noticeably more clicks. Prices are always in euro.",
    priceRange: "Price range",
    priceRangeHint: "€ budget · €€ mid-range · €€€ premium",
    cuisines: "Cuisines",
    cuisinesHint: "Pick the cuisine types you serve.",
    languagesLabel: "Languages",
    languagesHint: "The languages this service is offered in.",
    duration: "Duration",
    durationVisit: "Visit duration",
    durationPlaceholder: "e.g. 2 hours",
    difficulty: "Difficulty",
    selectDifficulty: "Select a level",
    maxParticipants: "Maximum participants",
    minAge: "Minimum age",
    season: "Season",
    selectSeason: "Select a season",
    guideLanguages: "Guide language",
    childPrice: "Child price",
    whatToBring: "What should guests bring?",
    whatToBringHint: "Pick what the visitor needs to bring along.",
    email: "Email (optional)",
    checkTimes: "Check-in / Check-out",
    checkIn: "Check-in",
    checkOut: "Check-out",
    businessHours: "Opening hours",
    businessOpen: "Opens",
    businessClose: "Closes",
    eventDate: "Event date",
    eventTime: "Event time",
    transportType: "Type of transport",
    transportPlaceholder: "e.g. Taxi, Boat, Rental car...",
    tips: "Tips / Additional information (optional)",
    tipsPlaceholder: "e.g. Best time to visit, tickets, parking...",
    features: "Features",
    featuresHint: "Pick the ones that apply or type your own and press +.",
    customTag: "Add a feature...",
    addTag: "Add",
    verifiedTitle: "Verified options",
    verifiedSubtitle: "These fields unlock automatically once an admin verifies your listing.",
    verifiedActiveTitle: "Your listing is Verified",
    verifiedActiveSubtitle: "Every option below is active — fill them in to get more contacts.",
    website: "Website",
    bookNow: "Book Now — booking link",
    bookTable: "Book Table — table reservation",
    bookTickets: "Ticket link (Book Now)",
    bookShop: "Online shop",
    menuPdf: "Menu PDF / menu link",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    gallery: "Gallery",
    galleryLocked: "Gallery up to 10 photos",
    galleryFree: "Free: 1 main photo",
    galleryVerified: "Verified: up to 10 photos",
    galleryAdd: "Add photos",
    galleryCount: "photos of 10",
    verifiedNote: "Become Verified to activate these features.",
    verifiedCta: "Get Verified",
    back: "Back",
    next: "Continue",
    publish: "Publish business",
    saveAndContinue: "Save and continue to the catalog",
    profileSaved: "Profile saved — continue with the catalog",
    draftNote: "The profile is saved as a draft. The business is published only on the last step.",
    publishFinalNote: "The business goes to an admin for approval and goes live once approved.",
    publishing: "Publishing...",
    publishNote: "You can update your profile at any time.",
    save: "Save changes",
    saving: "Saving...",
    saveNote: "You can update your profile at any time.",
    reviewNote: "Your listing goes to an admin for approval and goes live once approved.",
    reviewNoteEdit: "After saving, the changes go back to an admin for review.",
    required: "This field is required.",
    descriptionShort: "The description needs at least 30 characters.",
    coverRequired: "The cover photo is required.",
    invalidUrl: "The link must start with http:// or https://",
    invalidEmail: "This email address is not valid.",
    invalidWhatsapp: "Use the international format, e.g. +355 69 123 4567.",
    fileTooLarge: "The photo could not be processed. Try another one.",
    galleryFull: "You can upload a maximum of 10 gallery photos.",
    fixErrors: "Please complete the required fields.",
    draftRestored: "Picked up where you left off — your details were kept.",
    success: "Listing submitted for approval",
    updated: "Listing updated",
    catalogLocked: "Fill in and save the profile first — the other steps open in order.",
    catalogPublishedTitle: "Profile saved as a draft",
    catalogPublishedText:
      "Now add your categories (e.g. “Sweet crêpes”) and the products under them. Everything saves instantly; the business is published on the last step.",
    catalogHint:
      "Every item saves instantly as you add or change it. Only you and the administrator can manage them.",
    finish: "Finish — go to dashboard",
    viewListing: "View listing"
  }
} as const;

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY = 10;
const STEP_ICONS = [FileText, ShoppingBag, Lock];
/** Create mode saves the listing as a draft at the end of this step — the catalog step right after it needs a real listing id. Publishing happens on the last step. */
const FORM_STEPS = 1;
const CATALOG_STEP = 2;
const VERIFIED_STEP = 3;
const TOTAL_STEPS = 3;

/** "+355 69 123 4567" or "00355..." — a country code is required, a local "069..." is not enough. */
function isInternationalNumber(value: string) {
  return /^(\+|00)?[1-9]\d{7,14}$/.test(value.replace(/[\s().-]/g, ""));
}

const emptyForm = {
  title: "",
  location: "",
  village: "",
  description: "",
  contactPhone: "",
  whatsapp: "",
  contactEmail: "",
  address: "",
  googleMapsLink: "",
  priceFrom: "",
  priceRange: "",
  duration: "",
  difficulty: "",
  season: "",
  maxParticipants: "",
  minAge: "",
  childPrice: "",
  checkIn: "",
  checkOut: "",
  businessOpen: "",
  businessClose: "",
  eventDate: "",
  eventTime: "",
  transportType: "",
  tips: "",
  // Verified-only fields — editable once the listing is verified by an admin.
  website: "",
  bookingLink: "",
  menuLink: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: ""
};

type FormState = typeof emptyForm;
type FormKey = keyof FormState;
type NewPhoto = { id: string; file: File; preview: string };

/** Opening hours are stored as "08:00 - 22:00"; the wizard edits them as two time pickers. */
function parseBusinessHours(value?: string) {
  const [open = "", close = ""] = String(value || "").split("-").map((part) => part.trim());
  const asTime = (part: string) => (/^\d{1,2}:\d{2}$/.test(part) ? part.padStart(5, "0") : "");
  return { open: asTime(open), close: asTime(close) };
}

function formatBusinessHours(open: string, close: string) {
  if (open && close) return `${open} - ${close}`;
  return open || close || "";
}

function initialForm(listing?: WizardListing): FormState {
  if (!listing) return emptyForm;
  return {
    title: listing.title || "",
    location: listing.location || "",
    village: "",
    description: listing.description || "",
    contactPhone: listing.contactInfo?.phone || "",
    whatsapp: listing.whatsapp || listing.contactInfo?.phone || "",
    contactEmail: listing.contactInfo?.email || "",
    address: listing.address || "",
    googleMapsLink: listing.googleMapsLink || "",
    // Older listings could hold a min/max pair — the wizard now keeps only the starting price.
    priceFrom: String(startingPrice(listing) ?? ""),
    priceRange: listing.priceRange || "",
    duration: listing.duration || "",
    difficulty: listing.difficulty || "",
    season: listing.season || "",
    maxParticipants: listing.maxParticipants ? String(listing.maxParticipants) : "",
    minAge: listing.minAge ? String(listing.minAge) : "",
    childPrice: listing.childPrice ? String(listing.childPrice) : "",
    checkIn: listing.checkIn || "",
    checkOut: listing.checkOut || "",
    businessOpen: parseBusinessHours(listing.businessHours).open,
    businessClose: parseBusinessHours(listing.businessHours).close,
    eventDate: listing.eventDate || "",
    eventTime: listing.eventTime || "",
    transportType: listing.transportType || "",
    tips: listing.tips || "",
    website: listing.website || listing.contactInfo?.website || "",
    bookingLink: listing.bookingLink || "",
    menuLink: listing.menuLink || "",
    instagram: listing.socialLinks?.instagram || "",
    facebook: listing.socialLinks?.facebook || "",
    tiktok: listing.socialLinks?.tiktok || "",
    youtube: listing.socialLinks?.youtube || ""
  };
}

export default function ListingWizard({ listing }: { listing?: WizardListing }) {
  const { language, t } = useLanguage();
  const c = COPY[language];
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEdit = Boolean(listing?._id);
  /** Verified is granted by an admin, so it only ever unlocks the last step while editing. */
  const verifiedUnlocked = isEdit && Boolean(listing?.verified);

  /** Free-text hours from older listings survive until the owner picks real times. */
  const legacyBusinessHours = useMemo(() => {
    const raw = listing?.businessHours || "";
    const parsed = parseBusinessHours(raw);
    return parsed.open || parsed.close ? "" : raw;
  }, [listing?.businessHours]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // Create mode: the listing saved as a draft at the end of step 1, so the catalog step can
  // add items against a real listing id. Once set, the field steps lock — further
  // changes go through the edit page.
  const [createdListing, setCreatedListing] = useState<WizardListing | null>(null);
  const [form, setForm] = useState<FormState>(() => initialForm(listing));
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const [selectedCategory, setSelectedCategory] = useState(
    listing ? getCategoryFormValue(listing.category) : ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    listing ? getSubcategoryFormValue(listing.category, listing.subcategory) : ""
  );

  // Order/reservation toggles — pre-filled from the category+subcategory default,
  // but the owner can flip either one by hand (a hair salon that also sells
  // products, an auto shop that only takes appointments).
  const [allowOrders, setAllowOrders] = useState(() =>
    listing?.actions?.length
      ? listing.actions.includes("porosi")
      : getSubcategoryActions(selectedCategory, selectedSubcategory).includes("porosi")
  );
  const [allowReservations, setAllowReservations] = useState(() =>
    listing?.actions?.length
      ? listing.actions.includes("rezervim")
      : getSubcategoryActions(selectedCategory, selectedSubcategory).includes("rezervim")
  );
  // Once the owner touches a toggle by hand, category/subcategory changes stop overwriting it.
  const [actionsTouched, setActionsTouched] = useState(Boolean(listing?.actions?.length));

  const [activeTags, setActiveTags] = useState<string[]>(listing?.tags || []);
  const [cuisines, setCuisines] = useState<string[]>(listing?.cuisines || []);
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>(listing?.languages || []);
  const [whatToBring, setWhatToBring] = useState<string[]>(listing?.whatToBring || []);
  // Edit mode keeps the saved tags; create mode seeds them from the category.
  const [tagsTouched, setTagsTouched] = useState(isEdit);

  const existingImages = useMemo(() => {
    if (!listing) return [] as string[];
    if (listing.images?.length) return listing.images;
    return [listing.bannerImage, ...(listing.photos || [])].filter((item): item is string => Boolean(item));
  }, [listing]);

  const [coverUrl, setCoverUrl] = useState(listing?.bannerImage || existingImages[0] || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  // The freshly picked file waiting to be cropped, and the cropped result inlined in the draft.
  const [cropSource, setCropSource] = useState<File | null>(null);
  const [coverDataUrl, setCoverDataUrl] = useState("");

  const [galleryUrls, setGalleryUrls] = useState<string[]>(() =>
    listing ? (listing.photos?.length ? listing.photos : existingImages.slice(1)) : []
  );
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [cities, setCities] = useState<any[]>(albaniaCities);
  const topRef = useRef<HTMLDivElement>(null);

  // A category passed through the URL (?category=...) locks the choice for the whole flow.
  const lockedCategoryParam = searchParams.get("category");
  const categoryLocked =
    !isEdit && Boolean(lockedCategoryParam && categories.some((item) => item.value === lockedCategoryParam));

  useEffect(() => {
    if (isEdit) return;
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    if (categoryParam && categories.some((item) => item.value === categoryParam)) {
      setSelectedCategory(categoryParam);
      const subs = categories.find((item) => item.value === categoryParam)?.subcategories || [];
      if (subcategoryParam && subs.some((item) => item.value === subcategoryParam)) {
        setSelectedSubcategory(subcategoryParam);
      }
    }
  }, [searchParams, isEdit]);

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
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // The cropped cover is small enough to travel with the draft, so it survives too.
  useEffect(() => {
    if (!coverFile) {
      setCoverDataUrl("");
      return;
    }
    let cancelled = false;
    readFileAsDataUrl(coverFile)
      .then((url) => {
        if (!cancelled) setCoverDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [coverFile]);

  /**
   * Draft — leaving the wizard (most often through "Get Verified") or refreshing the page
   * must never wipe what the owner already filled in.
   */
  const draftKey = isEdit ? `edit:${listing!._id}` : "new";
  const [draftReady, setDraftReady] = useState(false);
  const draftLoaded = useRef(false);

  useEffect(() => {
    if (draftLoaded.current) return;
    draftLoaded.current = true;

    const draft = readDraft<Record<string, any>>(draftKey);
    if (!draft) {
      setDraftReady(true);
      return;
    }

    // A draft started for another category belongs to another listing.
    const urlCategory = searchParams.get("category");
    if (urlCategory && draft.selectedCategory && draft.selectedCategory !== urlCategory) {
      clearDraft(draftKey);
      setDraftReady(true);
      return;
    }

    if (draft.form) setForm((prev) => ({ ...prev, ...draft.form }));
    if (draft.selectedCategory) setSelectedCategory(draft.selectedCategory);
    if (draft.selectedSubcategory) setSelectedSubcategory(draft.selectedSubcategory);
    if (Array.isArray(draft.activeTags)) setActiveTags(draft.activeTags);
    if (Array.isArray(draft.cuisines)) setCuisines(draft.cuisines);
    if (Array.isArray(draft.spokenLanguages)) setSpokenLanguages(draft.spokenLanguages);
    if (Array.isArray(draft.whatToBring)) setWhatToBring(draft.whatToBring);
    if (Array.isArray(draft.galleryUrls)) setGalleryUrls(draft.galleryUrls);
    if (draft.coverUrl) setCoverUrl(draft.coverUrl);
    // In create mode the catalog step only exists after publishing, so a draft can
    // never land there directly.
    if (typeof draft.step === "number") setStep(Math.min(Math.max(draft.step, 1), isEdit ? TOTAL_STEPS : FORM_STEPS));
    setTagsTouched(Boolean(draft.tagsTouched));

    if (draft.coverDataUrl) {
      fileFromDataUrl(draft.coverDataUrl, draft.coverName || "cover.jpg")
        .then(setCoverFile)
        .catch(() => {});
    }

    toast.success(c.draftRestored);
    setDraftReady(true);
  }, [draftKey, searchParams, c.draftRestored]);

  useEffect(() => {
    if (!draftReady) return;
    // Published: the draft was already cleared — writing again would resurrect it.
    if (createdListing) return;
    // Debounced: the inlined cover photo makes every write worth a few milliseconds.
    const timer = setTimeout(
      () =>
        writeDraft(draftKey, {
          step,
          form,
          selectedCategory,
          selectedSubcategory,
          activeTags,
          cuisines,
          spokenLanguages,
          whatToBring,
          tagsTouched,
          coverUrl,
          coverDataUrl,
          coverName: coverFile?.name || "",
          galleryUrls
        }),
      500
    );
    return () => clearTimeout(timer);
  }, [
    draftReady,
    draftKey,
    createdListing,
    step,
    form,
    selectedCategory,
    selectedSubcategory,
    activeTags,
    cuisines,
    spokenLanguages,
    whatToBring,
    tagsTouched,
    coverUrl,
    coverDataUrl,
    coverFile,
    galleryUrls
  ]);

  const categoryDef = useMemo(
    () => categories.find((item) => item.value === selectedCategory),
    [selectedCategory]
  );

  const categoryLabel =
    (selectedCategory && t.categories.names[selectedCategory as keyof typeof t.categories.names]) ||
    categoryDef?.label ||
    "";

  // The link label follows what the business actually takes: a table, a ticket, an
  // order, or a plain appointment.
  const bookingFieldLabel =
    selectedCategory === "ushqim-pije"
      ? c.bookTable
      : selectedCategory === "evente"
        ? c.bookTickets
        : !getCategoryActions(selectedCategory).includes("rezervim")
          ? c.bookShop
          : c.bookNow;

  // Re-derive the order/reservation toggles from the taxonomy default whenever the
  // category or subcategory changes, unless the owner has already flipped one by hand.
  useEffect(() => {
    if (actionsTouched) return;
    if (!selectedCategory) {
      setAllowOrders(false);
      setAllowReservations(false);
      return;
    }
    const defaults = getSubcategoryActions(selectedCategory, selectedSubcategory);
    setAllowOrders(defaults.includes("porosi"));
    setAllowReservations(defaults.includes("rezervim"));
  }, [selectedCategory, selectedSubcategory, actionsTouched]);

  const showMenuLink = selectedCategory === "ushqim-pije";
  const galleryTotal = galleryUrls.length + newPhotos.length;

  const update = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  // Any picked photo goes through the in-app cropper, so an oversized camera shot is
  // cropped and compressed here instead of being rejected.
  const pickCover = (file?: File | null) => {
    if (!file) return;
    setCropSource(file);
  };

  const applyCroppedCover = (file: File) => {
    setCoverFile(file);
    setCoverUrl("");
    setCropSource(null);
    setErrors((prev) => ({ ...prev, cover: "" }));
  };

  const pickGallery = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX_GALLERY - galleryTotal;
    if (room <= 0) {
      toast.error(c.galleryFull);
      return;
    }
    const picked = Array.from(files);
    const accepted: NewPhoto[] = [];
    for (const file of picked.slice(0, room)) {
      try {
        // Gallery photos keep their framing — only oversized ones are downscaled.
        const prepared =
          file.size > MAX_COVER_SIZE ? await compressImageFile(file, { maxBytes: MAX_COVER_SIZE }) : file;
        accepted.push({
          id: `${prepared.name}-${prepared.size}-${accepted.length}`,
          file: prepared,
          preview: URL.createObjectURL(prepared)
        });
      } catch {
        toast.error(c.fileTooLarge);
      }
    }
    if (picked.length > room) toast.error(c.galleryFull);
    setNewPhotos((prev) => [...prev, ...accepted]);
  };

  const removeNewPhoto = (id: string) => {
    setNewPhotos((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  function validateStep(target: number) {
    const next: Record<string, string> = {};

    // The universal profile: name, description, WhatsApp, category and city are
    // required; the Google Maps link and the photo are optional.
    if (target === 1) {
      if (!form.title.trim()) next.title = c.required;
      if (!form.description.trim()) next.description = c.required;
      if (!form.whatsapp.trim()) next.whatsapp = c.required;
      else if (!isInternationalNumber(form.whatsapp)) next.whatsapp = c.invalidWhatsapp;
      if (!selectedCategory) next.category = c.required;
      if (!form.location.trim()) next.location = c.required;
      if (form.googleMapsLink.trim() && !/^https?:\/\//i.test(form.googleMapsLink.trim())) {
        next.googleMapsLink = c.invalidUrl;
      }
    }

    if (target === VERIFIED_STEP && verifiedUnlocked) {
      (["website", "bookingLink", "menuLink", "instagram", "facebook", "tiktok", "youtube"] as const).forEach((key) => {
        if (form[key].trim() && !/^https?:\/\//i.test(form[key].trim())) next[key] = c.invalidUrl;
      });
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToStep = (target: number) => {
    if (target === step) return;
    if (!isEdit) {
      if (createdListing) {
        // Published: the profile step is frozen — the catalog and what follows stay live.
        if (target < CATALOG_STEP) return;
      } else if (target > FORM_STEPS) {
        // The catalog needs a real listing id, so it only opens after publishing.
        toast(c.catalogLocked);
        return;
      }
    }
    // Moving forward always validates every step in between.
    if (target > step) {
      for (let current = step; current < target; current += 1) {
        if (!validateStep(current)) {
          setStep(current);
          toast.error(c.fixErrors);
          scrollToTop();
          return;
        }
      }
    }
    setErrors({});
    setStep(target);
    scrollToTop();
  };

  /** Create mode, last step: hands the draft (profile + catalog) over for approval. */
  async function publishDraft() {
    if (!createdListing || loading) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/listings/${createdListing._id}/publish`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      toast.success(c.success);
      router.push(createdListing.slug ? `/listings/${createdListing.slug}` : "/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    // Create mode once the draft exists: the catalog items save themselves, so the
    // steps in between only move forward — the last one publishes.
    if (!isEdit && createdListing) {
      if (step < TOTAL_STEPS) goToStep(step + 1);
      else await publishDraft();
      return;
    }

    // Enter inside a field must move the wizard forward, never save early. Create
    // mode publishes at the end of the field steps so the catalog step that follows
    // has a real listing to attach items to; edit mode saves on the last step.
    const submitStep = isEdit ? TOTAL_STEPS : FORM_STEPS;
    if (step < submitStep) {
      goToStep(step + 1);
      return;
    }

    for (let current = 1; current <= submitStep; current += 1) {
      if (!validateStep(current)) {
        setStep(current);
        toast.error(c.fixErrors);
        scrollToTop();
        return;
      }
    }

    setLoading(true);
    try {
      const bannerUrl = coverFile ? await uploadImage(coverFile) : coverUrl;

      let gallery = galleryUrls;
      if (verifiedUnlocked && newPhotos.length) {
        const uploaded: string[] = [];
        for (const item of newPhotos) {
          uploaded.push(await uploadImage(item.file));
        }
        gallery = [...galleryUrls, ...uploaded].slice(0, MAX_GALLERY);
      }

      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: selectedCategory,
        subcategory: selectedSubcategory,
        // Each catalog item says whether it is ordered or booked, so a business offering
        // both gets both buttons on its own. Only a saved manual override is kept.
        actions: actionsTouched
          ? [...(allowOrders ? ["porosi"] : []), ...(allowReservations ? ["rezervim"] : [])]
          : [],
        location: form.location.trim(),
        village: form.village,
        country: listing?.country || "Albania",
        address: form.address.trim(),
        contactPhone: form.contactPhone.trim() || form.whatsapp.trim(),
        contactEmail: form.contactEmail.trim(),
        whatsapp: form.whatsapp.trim(),
        googleMapsLink: form.googleMapsLink.trim(),
        priceFrom: form.priceFrom,
        // Same value on both fields: listings show a starting price, while the search
        // filters still query `price`.
        price: form.priceFrom,
        currency: PRICE_CURRENCY,
        priceRange: form.priceRange,
        duration: form.duration.trim(),
        difficulty: form.difficulty,
        season: form.season,
        maxParticipants: form.maxParticipants,
        minAge: form.minAge,
        childPrice: form.childPrice,
        whatToBring,
        cuisines,
        languages: spokenLanguages,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        // Free-text hours from older listings are kept until the owner picks real times.
        businessHours: formatBusinessHours(form.businessOpen, form.businessClose) || legacyBusinessHours,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        transportType: form.transportType.trim(),
        tips: form.tips.trim(),
        // Verified-only values: editable when unlocked, sent unchanged otherwise.
        website: form.website.trim(),
        bookingLink: form.bookingLink.trim(),
        menuLink: form.menuLink.trim(),
        instagram: form.instagram.trim(),
        instagramLink: form.instagram.trim(),
        facebook: form.facebook.trim(),
        facebookLink: form.facebook.trim(),
        tiktok: form.tiktok.trim(),
        youtube: form.youtube.trim(),
        bannerImage: bannerUrl,
        photos: gallery,
        images: [bannerUrl, ...gallery].filter(Boolean),
        tags: activeTags,
        amenities: activeTags
      };

      // Create mode: saved now so the catalog has a listing to attach to, published
      // only on the last step.
      if (!isEdit) payload.draft = true;

      if (isEdit && listing) {
        // Fields the wizard does not expose must be echoed back or PATCH clears them.
        payload.x = listing.socialLinks?.x || "";
        payload.highlights = listing.highlights || [];
      }

      const response = await fetch(isEdit ? `/api/listings/${listing!._id}` : "/api/listings", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      clearDraft(draftKey);

      if (isEdit) {
        toast.success(c.updated);
        router.push(`/listings/${data.listing?.slug || listing!.slug || ""}`);
      } else {
        toast.success(c.profileSaved);
        // Straight into the catalog step (categories, then the items under them) as
        // the natural last step of "adding a business" — the dashboard comes after.
        if (data.listing?._id) {
          setCreatedListing(data.listing);
          setStep(CATALOG_STEP);
          scrollToTop();
        } else {
          router.push("/dashboard");
        }
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // 16px text on phones — smaller fonts make iOS zoom the whole page on focus.
  const inputClass = "rounded-xl py-2.5 text-base sm:text-sm";
  const showCoverPreview = coverPreview || coverUrl;

  // The business whose catalog the last step manages: the listing being edited, or
  // the one just published by this very flow.
  const catalogListing = isEdit ? listing ?? null : createdListing;

  const stepperTotal = TOTAL_STEPS;
  const stepperSteps = c.steps;

  return (
    <form onSubmit={submit} className="space-y-4 sm:space-y-6">
      <div ref={topRef} className="scroll-mt-28" />

      {/* ---------- Stepper ---------- */}
      <div
        className="rounded-2xl border bg-white p-4 sm:p-5"
        style={{ borderColor: "var(--border-soft)", boxShadow: "var(--shadow-card)" }}
      >
        {/* Compact bar — every screen too narrow to fit all the steps with a readable
            label (phones through small/medium laptops) gets this instead of bare,
            unlabeled icons; the rich labeled row below only takes over once there is
            room for it. One breakpoint, no in-between range stuck with neither. */}
        <div className="flex items-center justify-between gap-3 xl:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
            >
              {(() => {
                const Icon = STEP_ICONS[step - 1];
                return <Icon className="h-4 w-4" />;
              })()}
            </span>
            <p className="truncate text-sm font-semibold sm:text-base" style={{ color: "var(--text-primary)" }}>
              {c.steps[step - 1].title}
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold sm:text-sm" style={{ color: "var(--brand-accent)" }}>
            {c.stepWord} {step} {c.ofWord} {stepperTotal}
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full xl:hidden" style={{ background: "var(--surface-subtle)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / stepperTotal) * 100}%`, background: "var(--brand-accent)" }}
          />
        </div>

        <ol className="hidden xl:flex xl:items-center">
          {stepperSteps.map((item, index) => {
            const number = index + 1;
            const Icon = STEP_ICONS[index];
            const done = number < step;
            const active = number === step;
            return (
              <li key={item.title} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => goToStep(number)}
                  className="group flex items-center gap-2 text-left"
                  title={item.title}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200"
                    style={{
                      background: done || active ? "var(--brand-accent)" : "var(--surface-white)",
                      borderColor: done || active ? "var(--brand-accent)" : "var(--border-medium)",
                      color: done || active ? "#fff" : "var(--text-tertiary)"
                    }}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="block">
                    <span
                      className="block text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: active ? "var(--brand-accent)" : "var(--text-tertiary)" }}
                    >
                      {c.stepWord} {number}
                    </span>
                    <span
                      className="block text-xs font-semibold leading-tight"
                      style={{ color: active || done ? "var(--text-primary)" : "var(--text-tertiary)" }}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
                {number < stepperTotal && (
                  <span
                    className="mx-2 h-px flex-1 transition-colors duration-300"
                    style={{ background: done ? "var(--brand-accent)" : "var(--border-soft)" }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------- Step card ---------- */}
      <div
        className="rounded-2xl border bg-white"
        style={{ borderColor: "var(--border-soft)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="border-b px-5 py-4 sm:px-7 sm:py-5" style={{ borderColor: "var(--border-soft)" }}>
          <p className="eyebrow mb-2">
            {c.stepWord} {step} {c.ofWord} {stepperTotal}
          </p>
          <h3 className="text-lg font-bold sm:text-xl" style={{ color: "var(--text-primary)" }}>
            {c.steps[step - 1].title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            {c.steps[step - 1].desc}
          </p>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-7">
          {/* ===================== 1 · PROFILI I BIZNESIT — 7 fushat universale ===================== */}
          {step === 1 && (
            <>
              {/* 1 · Emri i Biznesit */}
              <div>
                <Input
                  name="title"
                  label={`${c.title} *`}
                  className={inputClass}
                  placeholder={c.titlePlaceholder}
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  error={errors.title}
                  maxLength={90}
                />
                {!errors.title && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {c.titleHint}
                  </p>
                )}
              </div>

              {/* 2 · Përshkrimi i Biznesit */}
              <div>
                <Textarea
                  name="description"
                  label={`${c.description} *`}
                  className="rounded-xl text-base sm:text-sm"
                  placeholder={c.descriptionPlaceholder}
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  error={errors.description}
                />
                <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {c.descriptionHint}
                </p>
              </div>

              {/* 3 · Numri i WhatsApp-it */}
              <div>
                <Input
                  name="whatsapp"
                  label={`${c.whatsapp} *`}
                  className={inputClass}
                  placeholder="+355 69 123 4567"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.whatsapp}
                  onChange={(event) => update("whatsapp", event.target.value)}
                  error={errors.whatsapp}
                />
                {!errors.whatsapp && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {c.whatsappHint}
                  </p>
                )}
              </div>

              {/* 4 · Kategoria e Homepage */}
              {categoryLocked ? (
                <div
                  className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                  style={{ borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: "var(--brand-accent)" }}
                    >
                      <Tag className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-accent)" }}>
                        {c.category}
                      </span>
                      <span className="block truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {categoryLabel}
                      </span>
                    </span>
                  </div>
                  <Link
                    href="/create-listing"
                    className="shrink-0 text-xs font-semibold underline underline-offset-4"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {c.changeCategory}
                  </Link>
                </div>
              ) : (
                <div>
                  <Select
                    name="category"
                    label={`${c.category} *`}
                    className={inputClass}
                    options={[
                      { label: c.selectCategory, value: "" },
                      ...categories.map((item) => ({
                        label: t.categories.names[item.value as keyof typeof t.categories.names] || item.label,
                        value: item.value
                      }))
                    ]}
                    value={selectedCategory}
                    onChange={(event) => {
                      setSelectedCategory(event.target.value);
                      setSelectedSubcategory("");
                      setActionsTouched(false);
                      setErrors((prev) => ({ ...prev, category: "" }));
                    }}
                  />
                  {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
                </div>
              )}

              {/* 5 · Qyteti */}
              <div>
                <Input
                  name="location"
                  label={`${c.city} *`}
                  className={inputClass}
                  placeholder={c.cityPlaceholder}
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  list="city-list"
                  error={errors.location}
                  autoComplete="off"
                />
                <datalist id="city-list">
                  {cities.map((item) => (
                    <option key={item.value} value={item.label} />
                  ))}
                </datalist>
              </div>

              {/* 6 · Linku i Google Maps */}
              <div>
                <Input
                  name="googleMapsLink"
                  label={c.maps}
                  className={inputClass}
                  placeholder={c.mapsPlaceholder}
                  value={form.googleMapsLink}
                  onChange={(event) => update("googleMapsLink", event.target.value)}
                  error={errors.googleMapsLink}
                  inputMode="url"
                />
                <div
                  className="mt-2 flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderColor: "var(--border-soft)", background: "var(--surface-cream)" }}
                >
                  <p className="flex items-start gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                    {c.mapsHint}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(
                      `${form.title} ${form.location}`.trim() || "Albania"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs font-semibold underline underline-offset-4"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {c.mapsOpen}
                  </a>
                </div>
              </div>

              {/* 7 · Foto Profili */}
              <div className="space-y-2">
                <span className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.cover}
                </span>
                <div
                  className="flex flex-col items-start gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center"
                  style={{ borderColor: "var(--border-soft)", background: "var(--surface-cream)" }}
                >
                  {/* Exactly what the business page shows: the photo, or the initials circle. */}
                  <div
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-white shadow-md"
                    style={{ background: "var(--surface-white)" }}
                  >
                    {showCoverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverPreview || coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <InitialsAvatar name={form.title} className="text-2xl" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={{ borderColor: "var(--border-medium)", color: "var(--text-secondary)" }}
                      >
                        <Camera className="h-3.5 w-3.5" />
                        {showCoverPreview ? c.coverReplace : c.coverCta}
                      </button>
                      {coverFile && (
                        <button
                          type="button"
                          onClick={() => setCropSource(coverFile)}
                          className="flex items-center gap-1 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition-colors"
                          style={{ borderColor: "var(--brand-border)", color: "var(--brand-accent)" }}
                        >
                          <Crop className="h-3.5 w-3.5" />
                          {c.coverCrop}
                        </button>
                      )}
                      {showCoverPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setCoverFile(null);
                            setCoverUrl("");
                          }}
                          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {c.coverRemove}
                        </button>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {c.coverHint}
                    </p>
                  </div>
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    pickCover(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </div>
            </>
          )}

          {/* ===================== 3 · OPSIONET VERIFIED ===================== */}
          {step === VERIFIED_STEP && (
            <div className="space-y-5">
              <div
                className="flex items-start gap-3 rounded-2xl border px-4 py-4"
                style={{ borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
              >
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {verifiedUnlocked ? c.verifiedActiveTitle : c.verifiedTitle}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {verifiedUnlocked ? c.verifiedActiveSubtitle : c.verifiedSubtitle}
                  </p>
                </div>
              </div>

              {verifiedUnlocked ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <UnlockedField
                      icon={Globe}
                      label={c.website}
                      placeholder="https://..."
                      value={form.website}
                      error={errors.website}
                      onChange={(value) => update("website", value)}
                    />
                    <UnlockedField
                      icon={CalendarClock}
                      label={bookingFieldLabel}
                      placeholder="https://..."
                      value={form.bookingLink}
                      error={errors.bookingLink}
                      onChange={(value) => update("bookingLink", value)}
                    />
                    {showMenuLink && (
                      <UnlockedField
                        icon={FileType}
                        label={c.menuPdf}
                        placeholder="https://..."
                        value={form.menuLink}
                        error={errors.menuLink}
                        onChange={(value) => update("menuLink", value)}
                      />
                    )}
                    <UnlockedField
                      icon={Instagram}
                      label={c.instagram}
                      placeholder="https://instagram.com/..."
                      value={form.instagram}
                      error={errors.instagram}
                      onChange={(value) => update("instagram", value)}
                    />
                    <UnlockedField
                      icon={Facebook}
                      label={c.facebook}
                      placeholder="https://facebook.com/..."
                      value={form.facebook}
                      error={errors.facebook}
                      onChange={(value) => update("facebook", value)}
                    />
                    <UnlockedField
                      icon={Music}
                      label={c.tiktok}
                      placeholder="https://tiktok.com/@..."
                      value={form.tiktok}
                      error={errors.tiktok}
                      onChange={(value) => update("tiktok", value)}
                    />
                    <UnlockedField
                      icon={Play}
                      label={c.youtube}
                      placeholder="https://youtube.com/@..."
                      value={form.youtube}
                      error={errors.youtube}
                      onChange={(value) => update("youtube", value)}
                    />
                  </div>

                  {/* Gallery manager — up to 10 photos next to the cover. */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        <ImagePlus className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                        {c.gallery}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
                        {galleryTotal} {c.galleryCount}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {galleryUrls.map((url) => (
                        <div
                          key={url}
                          className="group relative aspect-square overflow-hidden rounded-xl border"
                          style={{ borderColor: "var(--border-soft)" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="gallery" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGalleryUrls((prev) => prev.filter((item) => item !== url))}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm transition-transform hover:scale-105"
                            title={c.coverRemove}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      {newPhotos.map((item) => (
                        <div
                          key={item.id}
                          className="group relative aspect-square overflow-hidden rounded-xl border"
                          style={{ borderColor: "var(--brand-border)" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.preview} alt="new" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewPhoto(item.id)}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm transition-transform hover:scale-105"
                            title={c.coverRemove}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      {galleryTotal < MAX_GALLERY && (
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed transition-colors hover:bg-[var(--brand-light)]"
                          style={{ borderColor: "var(--border-medium)", background: "var(--surface-cream)" }}
                        >
                          <Plus className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                          <span className="text-[10px] font-semibold" style={{ color: "var(--text-tertiary)" }}>
                            {c.galleryAdd}
                          </span>
                        </button>
                      )}
                    </div>

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        pickGallery(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Locked fields — kept visually muted so the limit is obvious at a glance. */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <LockedField icon={Globe} label={c.website} placeholder="https://..." />
                    <LockedField icon={CalendarClock} label={bookingFieldLabel} placeholder="https://..." />
                    {showMenuLink && <LockedField icon={FileType} label={c.menuPdf} placeholder="https://..." />}
                    <LockedField icon={Instagram} label={c.instagram} placeholder="https://instagram.com/..." />
                    <LockedField icon={Facebook} label={c.facebook} placeholder="https://facebook.com/..." />
                    <LockedField icon={Music} label={c.tiktok} placeholder="https://tiktok.com/@..." />
                    <LockedField icon={Play} label={c.youtube} placeholder="https://youtube.com/@..." />
                  </div>

                  <div className="space-y-2 opacity-60">
                    <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      <ImagePlus className="h-4 w-4" />
                      {c.galleryLocked}
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                      {Array.from({ length: MAX_GALLERY }).map((_, index) => (
                        <div
                          key={index}
                          className="flex aspect-square items-center justify-center rounded-lg border border-dashed"
                          style={{ borderColor: "var(--border-medium)", background: "var(--surface-cream)" }}
                        >
                          <Lock className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-xl border px-4 py-3"
                    style={{ borderColor: "var(--border-soft)", background: "var(--surface-cream)" }}
                  >
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {c.gallery}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5" style={{ color: "var(--brand-accent)" }} />
                        {c.galleryFree}
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                        {c.galleryVerified}
                      </li>
                    </ul>
                  </div>

                  <div
                    className="flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      <Lock className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                      {c.verifiedNote}
                    </p>
                    <Link href="/packet" className="btn-primary shrink-0 text-xs">
                      <BadgeCheck className="h-4 w-4" />
                      {c.verifiedCta}
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===================== 2 · KATALOGU — 8 fushat universale, sipas kategorive ===================== */}
          {step === CATALOG_STEP && catalogListing && (
            <div className="space-y-5">
              {!isEdit && (
                <div
                  className="flex items-start gap-3 rounded-2xl border px-4 py-4"
                  style={{ borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
                >
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {c.catalogPublishedTitle}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {c.catalogPublishedText}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {c.catalogHint}
              </p>

              <CatalogManager
                embedded
                listing={{
                  _id: catalogListing._id,
                  slug: catalogListing.slug,
                  category: catalogListing.category,
                  subcategory: catalogListing.subcategory,
                  actions: catalogListing.actions
                }}
              />
            </div>
          )}
        </div>

        {/* ---------- Navigation ---------- */}
        <div
          className="flex flex-col gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {/* On mobile "Continue" comes first — going forward is the common move. */}
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            disabled={step === 1 || loading || (!isEdit && Boolean(createdListing) && step === CATALOG_STEP)}
            className="order-2 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:order-1"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-secondary)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            {c.back}
          </button>

          {(isEdit || createdListing) && step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => goToStep(step + 1)}
              className="btn-primary order-1 w-full sm:order-2 sm:w-auto"
            >
              {c.next}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <span className="order-1 hidden text-xs sm:order-2 sm:block" style={{ color: "var(--text-tertiary)" }}>
              {isEdit ? c.reviewNoteEdit : c.reviewNote}
            </span>
          )}
        </div>
      </div>

      {/* ---------- Publish / Save ---------- */}
      {((isEdit && step === TOTAL_STEPS) || (!isEdit && step === FORM_STEPS && !createdListing)) && (
        <div className="space-y-3 text-center">
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--brand-accent)", boxShadow: "0 6px 20px rgba(225, 29, 46, 0.28)" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {c.saving}
              </>
            ) : isEdit ? (
              c.save
            ) : (
              <>
                {c.saveAndContinue}
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {isEdit ? c.saveNote : c.draftNote}
          </p>
        </div>
      )}

      {/* ---------- Publish (create mode, on the last step) ---------- */}
      {!isEdit && step === TOTAL_STEPS && createdListing && (
        <div className="space-y-3 text-center">
          <button
            type="button"
            onClick={publishDraft}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--brand-accent)", boxShadow: "0 6px 20px rgba(225, 29, 46, 0.28)" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {c.publishing}
              </>
            ) : (
              c.publish
            )}
          </button>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {c.publishFinalNote}
          </p>
        </div>
      )}

      {cropSource && (
        <ImageCropper
          file={cropSource}
          maxBytes={MAX_COVER_SIZE}
          onCancel={() => setCropSource(null)}
          onSave={applyCroppedCover}
        />
      )}
    </form>
  );
}

function LockedField({
  icon: Icon,
  label,
  placeholder
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block space-y-1.5 opacity-60">
      <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        <Icon className="h-4 w-4" />
        {label}
        <Lock className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
      </span>
      <input
        type="text"
        disabled
        placeholder={placeholder}
        className="w-full cursor-not-allowed rounded-xl border px-4 py-2.5 text-sm font-medium"
        style={{
          borderColor: "var(--border-soft)",
          background: "var(--surface-cream)",
          color: "var(--text-tertiary)"
        }}
      />
    </label>
  );
}

function UnlockedField({
  icon: Icon,
  label,
  placeholder,
  value,
  error,
  onChange
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        <Icon className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
        {label}
        <BadgeCheck className="h-3.5 w-3.5" style={{ color: "var(--brand-accent)" }} />
      </span>
      <Input
        className="rounded-xl py-2.5 text-base sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
        inputMode="url"
      />
    </div>
  );
}
