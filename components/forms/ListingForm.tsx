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
  Clock,
  Facebook,
  Globe,
  ImagePlus,
  Instagram,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Sparkles,
  Tag,
  Trash2,
  Wallet
} from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { categories } from "@/lib/constants";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";

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

const CATEGORY_DEFAULT_TAGS: Record<string, string[]> = {
  akomodim: ["Wifi", "AC", "Parking", "Kuzhinë", "TV"],
  restorante: ["Wifi", "Outdoor Seating", "Vegan Options", "Rezervime", "Parking"],
  atraksione: ["Entry Fee", "Family Friendly", "Guide Available", "Parking", "Pamje piktoreske"],
  evente: ["Tickets Needed", "Outdoor", "Indoor", "Parking", "Muzikë live"],
  "sherbime-turistike": ["English Speaking", "Licensed Guide", "Group Discount", "Tur privat", "Eksperiencë lokale"],
  "produkte-lokale": ["Handmade", "Organic", "Shipping Available", "Bio", "Tradicionale"],
  transport: ["AC", "English Speaking Driver", "Airport Pickup", "Shofer profesionist", "Taksi e licencuar"]
};

const SUBCATEGORY_DEFAULT_TAGS: Record<string, Record<string, string[]>> = {
  akomodim: {
    hotel: ["Wifi", "AC", "Mëngjesi", "Shërbim dhome", "Parking"],
    resort: ["Pishinë", "Pamje nga deti", "Spa", "Plazh privat", "Wifi"],
    vila: ["Pishinë", "Kopsht", "Kuzhinë", "AC", "Pamje nga mali"],
    apartament: ["Wifi", "AC", "Kuzhinë", "Lavatriçe", "Ballkon"],
    guesthouse: ["Mëngjesi", "Kopsht", "Mikpritje", "Parking", "Wifi"],
    hostel: ["Wifi", "Kuzhinë e përbashkët", "Zonë sociale", "Lokacion qendror", "Çmim ekonomik"],
    glamping: ["Natyre", "Barbecue", "Zonë jashtë", "Pamje piktoreske", "Flihet në çadër"],
    motel: ["Parking falas", "AC", "TV", "Recepsoin 24/7", "Pranë autostradës"]
  },
  restorante: {
    tradicional: ["Ushqim tradicional", "Zonë jashtë", "Rezervime", "Parking", "Muzikë live"],
    internacional: ["Menu moderne", "Pije alkoolike", "Zonë jashtë", "Wifi", "Rezervime"],
    "fast-food": ["Marrje me vete", "Ushqim i shpejtë", "WiFi", "Kënd lojërash", "AC"],
    "kafe-bar": ["Kafe", "Kokteje", "Zonë jashtë", "Wifi", "Muzikë e mirë"],
    pizzeria: ["Pica me dru", "Ushqim Italian", "Marrje me vete", "Dërgesa", "E përshtatshme për familje"],
    taverne: ["Muzikë live", "Ushqime deti", "Zonë tradicionale", "Rezervime", "Verë shtëpie"],
    "shisha-lounge": ["Shisha", "Kokteje", "Muzikë DJ", "Zonë VIP", "Udhëheqje nate"]
  },
  atraksione: {
    natyre: ["Pamje piktoreske", "E përshtatshme për familje", "Shtigje ecjeje", "Udhërrëfyes", "Falas"],
    historike: ["Vlerë historike", "Arkitekturë", "Udhërrëfyes", "Biletë hyrjeje", "Parking"],
    muze: ["Ekspozitë", "Udhërrëfyes audio", "E përshtatshme për fëmijë", "Biletë hyrjeje", "AC"],
    plazh: ["Rërë", "Shezlongë", "Pamje nga perëndimi", "Sportet e ujit", "Zonë për not"],
    adventure: ["Sporte ekstreme", "Adrenalinë", "Udhërrëfyes profesionist", "Pajisje të sigurisë", "Tur në grup"],
    arkeologji: ["Gërmime arkeologjike", "Histori e lashtë", "Udhërrëfyes", "Biletë hyrjeje", "Arkitekturë"],
    kulture: ["Ngjarje kulturore", "Teatër", "Punëtori arti", "Lokale", "E përshtatshme për të gjithë"]
  },
  evente: {
    koncerte: ["Muzikë live", "Biletë e nevojshme", "Skenë e hapur", "Parking", "Zonë VIP"],
    festivale: ["Festival", "Ushqim & Pije", "Zonë jashtë", "Biletë e nevojshme", "Muzikë"],
    panaire: ["Ekspozitë", "Falas", "Punime dore", "Zonë brenda", "Parking"],
    dasma: ["Dekorim", "Katering", "Muzikë", "Zonë jashtë", "Fotograf"],
    ekspozita: ["Punime arti", "Hyrje e lirë", "Zonë brenda", "Fotografi", "Pije mirëseardhjeje"],
    teater: ["Performancë live", "Aktorë profesionistë", "Biletë e nevojshme", "Zonë e mbyllur", "Drama & Komedi"],
    sportive: ["Gara", "Aktivitet fizik", "Pamje live", "Biletë e nevojshme", "Për të gjitha moshat"]
  },
  "sherbime-turistike": {
    guida: ["Anglisht folës", "Udhërrëfyes i licencuar", "Tur privat", "Eksperiencë lokale", "Mikpritës"],
    agjenci: ["Planifikim udhëtimi", "Bileta", "Transport i përfshirë", "Paketa turistike", "Mbështetje 24/7"],
    ekskursione: ["Tur ditor", "Udhërrëfyes", "Piknik", "Transport", "E përshtatshme për grupe"],
    rezervime: ["Konfirmim i shpejtë", "Asistencë", "Pa pagesë paraprake", "Fleksibël", "Mbështetje"],
    "rent-equipment": ["Pajisje cilësore", "Sporte ujore/malore", "Dorëzim i shpejtë", "Çmim ditor", "Asistencë teknike"],
    "foto-video": ["Fotograf profesionist", "Video me dron", "Redaktim profesional", "Portofolio e pasur", "Udhëtimes"],
    "tours-boat": ["Tur me varkë", "Pamje nga deti", "Kapiten i licencuar", "Kolete shpëtimi", "Eksplorim shpellash"]
  },
  "produkte-lokale": {
    artizanat: ["Punim dore", "Autentike", "Dhurata", "Unike", "Lokale"],
    ushqimore: ["Organike", "Bio", "Tradicionale", "E freskët", "Pa konservantë"],
    suvenire: ["Suvenire", "Lokale", "Dhurata", "Punim dore", "Çmime të arsyeshme"],
    agro: ["Nga ferma", "Organike", "E freskët", "Ekologjike", "Lokale"],
    veret: ["Degustim verash", "Vreshta", "Lokale", "Traditë familjare", "Dhurata"],
    "punime-druri": ["Punim dore", "Druri natyral", "Dekor shtëpie", "Unike", "Porosi speciale"],
    "kozmetike-natyrale": ["Bio", "Vegane", "Pa kimikate", "Vajra esenciale", "Punim dore"]
  },
  transport: {
    aeroport: ["Transfertë aeroporti", "Shofer profesionist", "Pritje me emër", "Bagazhe", "AC"],
    "makine-me-qira": ["Makina të reja", "Kasko e plotë", "Pa depozitë", "Kilometra pa limit", "AC"],
    varka: ["Tur me varkë", "Pamje nga deti", "Kolete shpëtimi", "Kapiten", "Muzikë në varkë"],
    taksi: ["Taksi e licencuar", "Shofer i shpejtë", "AC", "Çmim fiks", "Ndihmë me bagazhet"],
    bicikleta: ["Bicikleta cilësore", "Kaskë e përfshirë", "Çmim ekonomik", "Harta turistike", "Motorë elektrikë"],
    autobus: ["Udhëtim në grup", "Komoditet", "AC", "Linja të rregullta", "Bagazhe të mëdha"],
    helikopter: ["Fluturim panoramik", "Adrenalinë", "Pilot i certifikuar", "Siguri maksimale", "Pamje VIP"]
  }
};

/** All wizard copy lives here so the whole flow can be re-worded in one place. */
const COPY = {
  al: {
    stepWord: "Hapi",
    ofWord: "nga",
    steps: [
      { title: "Informacioni bazë", desc: "Titulli, kategoria, qyteti dhe fotoja kryesore." },
      { title: "Kontakti", desc: "Si mund t'ju gjejnë dhe kontaktojnë turistët." },
      { title: "Detajet", desc: "Çmimi, orari dhe karakteristikat e shërbimit." },
      { title: "Opsione Verified", desc: "Funksione shtesë që aktivizohen pas verifikimit." }
    ],
    category: "Kategoria",
    categorySelected: "Kategoria e zgjedhur",
    changeCategory: "Ndrysho",
    selectCategory: "Zgjidhni një kategori",
    subcategory: "Nënkategoria",
    selectSubcategory: "Zgjidhni një nënkategori",
    title: "Titulli i listimit",
    titlePlaceholder: "p.sh. Vila Panorama — Dhërmi",
    titleHint: "Përdorni emrin e biznesit dhe zonën. Shmangni shkronjat e mëdha të tepërta.",
    city: "Qyteti",
    cityPlaceholder: "Tiranë",
    village: "Fshati / Zona",
    selectVillage: "Zgjidh fshatin (opsionale)",
    description: "Përshkrimi",
    descriptionPlaceholder:
      "Përshkruani shërbimin, çfarë e bën të veçantë, çfarë përfshihet dhe pse turistët duhet t'ju zgjedhin.",
    descriptionHint: "Minimumi 30 karaktere. Përshkrimet e detajuara marrin më shumë kontakte.",
    cover: "Cover foto (fotoja kryesore)",
    coverCta: "Kliko për të ngarkuar foton kryesore",
    coverHint: "JPG ose PNG · rekomandohet 1600×900 · maksimumi 5MB",
    coverReplace: "Ndrysho foton",
    coverRemove: "Hiq",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    whatsappHint: "Lëreni bosh nëse përdorni të njëjtin numër si telefoni.",
    address: "Adresa",
    addressPlaceholder: "Rruga, numri i ndërtesës, zona",
    maps: "Google Maps — linku i vendndodhjes",
    mapsPlaceholder: "https://maps.app.goo.gl/...",
    mapsHint: "Hapni Google Maps, gjeni vendin tuaj, shtypni «Share» → «Copy link» dhe ngjiteni këtu.",
    mapsOpen: "Hap Google Maps",
    price: "Çmimi",
    priceFrom: "Çmimi minimal",
    priceTo: "Çmimi maksimal",
    perPerson: "për person",
    currency: "Valuta",
    priceHint: "Opsionale — por listimet me çmim marrin dukshëm më shumë klikime.",
    checkTimes: "Check-in / Check-out",
    checkIn: "Check-in",
    checkOut: "Check-out",
    businessHours: "Orari i punës",
    eventDate: "Data e eventit",
    eventTime: "Ora e eventit",
    transportType: "Lloji i transportit",
    transportPlaceholder: "p.sh. Taksi, Varkë, Makinë me qira...",
    menuLink: "Linku i menusë (opsionale)",
    tips: "Këshilla / Informacion shtesë (opsionale)",
    tipsPlaceholder: "p.sh. Koha më e mirë për vizitë, biletat, parkimi...",
    features: "Karakteristikat",
    featuresHint: "Zgjidhni ato që ju përshtaten ose shtoni tuajat me Enter.",
    customTag: "Shto karakteristikë... (shtyp Enter)",
    verifiedTitle: "Opsione për Verified",
    verifiedSubtitle: "Këto fusha aktivizohen automatikisht kur listimi juaj verifikohet nga administratori.",
    website: "Website",
    bookNow: "Book Now — linku i rezervimit",
    instagram: "Instagram",
    facebook: "Facebook",
    gallery: "Galeria",
    galleryLocked: "Galeri deri në 10 foto",
    galleryFree: "Falas: 1 foto kryesore",
    galleryVerified: "Verified: deri në 10 foto",
    verifiedNote: "Bëhu Verified për të aktivizuar këto funksione.",
    verifiedCta: "Bëhu Verified",
    back: "Kthehu",
    next: "Vazhdo",
    publish: "Publiko Listimin",
    publishing: "Duke publikuar...",
    publishNote: "Mund ta përditësoni profilin tuaj në çdo kohë.",
    reviewNote: "Listimi shkon te administratori për miratim dhe publikohet pas aprovimit.",
    required: "Kjo fushë është e detyrueshme.",
    descriptionShort: "Përshkrimi duhet të ketë të paktën 30 karaktere.",
    coverRequired: "Fotoja kryesore është e detyrueshme.",
    invalidUrl: "Linku duhet të fillojë me http:// ose https://",
    invalidPriceRange: "Çmimi maksimal duhet të jetë më i madh se minimali.",
    fileTooLarge: "Fotoja është shumë e madhe (maksimumi 5MB).",
    fixErrors: "Ju lutem plotësoni fushat e detyrueshme.",
    success: "Listimi u dërgua për miratim",
    optional: "opsionale"
  },
  en: {
    stepWord: "Step",
    ofWord: "of",
    steps: [
      { title: "Basic information", desc: "Title, category, city and the cover photo." },
      { title: "Contact", desc: "How travellers find and reach you." },
      { title: "Details", desc: "Price, opening times and features." },
      { title: "Verified options", desc: "Extra features unlocked after verification." }
    ],
    category: "Category",
    categorySelected: "Selected category",
    changeCategory: "Change",
    selectCategory: "Select a category",
    subcategory: "Subcategory",
    selectSubcategory: "Select a subcategory",
    title: "Listing title",
    titlePlaceholder: "e.g. Villa Panorama — Dhermi",
    titleHint: "Use your business name and the area. Avoid ALL CAPS.",
    city: "City",
    cityPlaceholder: "Tirana",
    village: "Village / Area",
    selectVillage: "Select village (optional)",
    description: "Description",
    descriptionPlaceholder:
      "Describe the service, what makes it special, what is included and why travellers should choose you.",
    descriptionHint: "Minimum 30 characters. Detailed descriptions get more contacts.",
    cover: "Cover photo",
    coverCta: "Click to upload the main photo",
    coverHint: "JPG or PNG · 1600×900 recommended · max 5MB",
    coverReplace: "Replace photo",
    coverRemove: "Remove",
    phone: "Phone",
    whatsapp: "WhatsApp",
    whatsappHint: "Leave empty if it is the same as the phone number.",
    address: "Address",
    addressPlaceholder: "Street, building number, area",
    maps: "Google Maps — location link",
    mapsPlaceholder: "https://maps.app.goo.gl/...",
    mapsHint: "Open Google Maps, find your place, tap “Share” → “Copy link” and paste it here.",
    mapsOpen: "Open Google Maps",
    price: "Price",
    priceFrom: "Minimum price",
    priceTo: "Maximum price",
    perPerson: "per person",
    currency: "Currency",
    priceHint: "Optional — but listings with a price get noticeably more clicks.",
    checkTimes: "Check-in / Check-out",
    checkIn: "Check-in",
    checkOut: "Check-out",
    businessHours: "Opening hours",
    eventDate: "Event date",
    eventTime: "Event time",
    transportType: "Type of transport",
    transportPlaceholder: "e.g. Taxi, Boat, Rental car...",
    menuLink: "Menu link (optional)",
    tips: "Tips / Additional information (optional)",
    tipsPlaceholder: "e.g. Best time to visit, tickets, parking...",
    features: "Features",
    featuresHint: "Pick the ones that apply or add your own with Enter.",
    customTag: "Add a feature... (press Enter)",
    verifiedTitle: "Verified options",
    verifiedSubtitle: "These fields unlock automatically once an admin verifies your listing.",
    website: "Website",
    bookNow: "Book Now — booking link",
    instagram: "Instagram",
    facebook: "Facebook",
    gallery: "Gallery",
    galleryLocked: "Gallery up to 10 photos",
    galleryFree: "Free: 1 main photo",
    galleryVerified: "Verified: up to 10 photos",
    verifiedNote: "Become Verified to activate these features.",
    verifiedCta: "Get Verified",
    back: "Back",
    next: "Continue",
    publish: "Publish listing",
    publishing: "Publishing...",
    publishNote: "You can update your profile at any time.",
    reviewNote: "Your listing goes to an admin for approval and goes live once approved.",
    required: "This field is required.",
    descriptionShort: "The description needs at least 30 characters.",
    coverRequired: "The cover photo is required.",
    invalidUrl: "The link must start with http:// or https://",
    invalidPriceRange: "The maximum price must be higher than the minimum.",
    fileTooLarge: "The photo is too large (max 5MB).",
    fixErrors: "Please complete the required fields.",
    success: "Listing submitted for approval",
    optional: "optional"
  }
} as const;

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const MIN_DESCRIPTION = 30;
const STEP_ICONS = [MapPin, Phone, Wallet, Lock];
const TOTAL_STEPS = 4;

const emptyForm = {
  title: "",
  location: "",
  village: "",
  description: "",
  contactPhone: "",
  whatsapp: "",
  address: "",
  googleMapsLink: "",
  priceFrom: "",
  price: "",
  currency: "€",
  checkIn: "",
  checkOut: "",
  businessHours: "",
  eventDate: "",
  eventTime: "",
  transportType: "",
  menuLink: "",
  tips: ""
};

type FormState = typeof emptyForm;
type FormKey = keyof FormState;

export default function ListingForm() {
  const { language, t } = useLanguage();
  const c = COPY[language];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [cities, setCities] = useState<any[]>(albaniaCities);
  const [villages, setVillages] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // A category passed through the URL (?category=...) locks the choice for the whole flow.
  const lockedCategoryParam = searchParams.get("category");
  const categoryLocked = Boolean(
    lockedCategoryParam && categories.some((item) => item.value === lockedCategoryParam)
  );

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    if (categoryParam && categories.some((item) => item.value === categoryParam)) {
      setSelectedCategory(categoryParam);
      const subs = categories.find((item) => item.value === categoryParam)?.subcategories || [];
      if (subcategoryParam && subs.some((item) => item.value === subcategoryParam)) {
        setSelectedSubcategory(subcategoryParam);
      }
    }
  }, [searchParams]);

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
    const found = cities.find((item) => String(item.label).toLowerCase() === form.location.toLowerCase());
    const nextVillages: string[] = found?.villages || [];
    setVillages(nextVillages);
    setForm((prev) => (nextVillages.includes(prev.village) ? prev : { ...prev, village: "" }));
  }, [form.location, cities]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const categoryDef = useMemo(
    () => categories.find((item) => item.value === selectedCategory),
    [selectedCategory]
  );

  const subcategories = categoryDef?.subcategories || [];

  const categoryLabel =
    (selectedCategory && t.categories.names[selectedCategory as keyof typeof t.categories.names]) ||
    categoryDef?.label ||
    "";

  const subcategoryLabel = (value: string) => {
    const names = (t.categories.subnames as Record<string, Record<string, string>>)[selectedCategory];
    return names?.[value] || subcategories.find((item) => item.value === value)?.label || value;
  };

  const suggestedTags = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedSubcategory && SUBCATEGORY_DEFAULT_TAGS[selectedCategory]?.[selectedSubcategory]) {
      return SUBCATEGORY_DEFAULT_TAGS[selectedCategory][selectedSubcategory];
    }
    return categoryDef?.tags || [];
  }, [selectedCategory, selectedSubcategory, categoryDef]);

  // Pre-select the five most relevant features whenever the category/subcategory changes.
  useEffect(() => {
    if (!selectedCategory) {
      setActiveTags([]);
      return;
    }
    if (selectedSubcategory && SUBCATEGORY_DEFAULT_TAGS[selectedCategory]?.[selectedSubcategory]) {
      setActiveTags(SUBCATEGORY_DEFAULT_TAGS[selectedCategory][selectedSubcategory].slice(0, 5));
    } else if (CATEGORY_DEFAULT_TAGS[selectedCategory]) {
      setActiveTags(CATEGORY_DEFAULT_TAGS[selectedCategory].slice(0, 5));
    } else {
      setActiveTags((categories.find((item) => item.value === selectedCategory)?.tags || []).slice(0, 5));
    }
  }, [selectedCategory, selectedSubcategory]);

  const isPerPersonCategory = selectedCategory === "akomodim" || selectedCategory === "restorante";
  const showCheckTimes = selectedCategory === "akomodim";
  const showBusinessHours = selectedCategory !== "akomodim" && selectedCategory !== "evente";
  const showEventFields = selectedCategory === "evente";

  const update = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const addCustomTag = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = customTag.trim();
    if (!value) return;
    if (!activeTags.includes(value)) setActiveTags((prev) => [...prev, value]);
    setCustomTag("");
  };

  const pickCover = (file?: File | null) => {
    if (!file) return;
    if (file.size > MAX_COVER_SIZE) {
      toast.error(c.fileTooLarge);
      return;
    }
    setCoverFile(file);
    setErrors((prev) => ({ ...prev, cover: "" }));
  };

  function validateStep(target: number) {
    const next: Record<string, string> = {};

    if (target === 1) {
      if (!form.title.trim()) next.title = c.required;
      if (!selectedCategory) next.category = c.required;
      if (!selectedSubcategory) next.subcategory = c.required;
      if (!form.location.trim()) next.location = c.required;
      if (form.description.trim().length < MIN_DESCRIPTION) next.description = c.descriptionShort;
      if (!coverFile) next.cover = c.coverRequired;
    }

    if (target === 2) {
      if (!form.contactPhone.trim()) next.contactPhone = c.required;
      if (!form.address.trim()) next.address = c.required;
      if (form.googleMapsLink.trim() && !/^https?:\/\//i.test(form.googleMapsLink.trim())) {
        next.googleMapsLink = c.invalidUrl;
      }
    }

    if (target === 3) {
      if (showEventFields) {
        if (!form.eventDate) next.eventDate = c.required;
        if (!form.eventTime) next.eventTime = c.required;
      }
      if (selectedCategory === "transport" && !form.transportType.trim()) {
        next.transportType = c.required;
      }
      if (form.priceFrom && form.price && Number(form.price) < Number(form.priceFrom)) {
        next.price = c.invalidPriceRange;
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToStep = (target: number) => {
    if (target === step) return;
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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    // Enter inside a field must move the wizard forward, never publish early.
    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
      return;
    }

    for (let current = 1; current <= 3; current += 1) {
      if (!validateStep(current)) {
        setStep(current);
        toast.error(c.fixErrors);
        scrollToTop();
        return;
      }
    }

    setLoading(true);
    try {
      const bannerUrl = await uploadImage(coverFile as File);

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: selectedCategory,
          subcategory: selectedSubcategory,
          location: form.location.trim(),
          village: form.village,
          country: "Albania",
          address: form.address.trim(),
          contactPhone: form.contactPhone.trim(),
          whatsapp: form.whatsapp.trim(),
          googleMapsLink: form.googleMapsLink.trim(),
          priceFrom: form.priceFrom,
          price: form.price,
          currency: form.currency,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          businessHours: form.businessHours.trim(),
          eventDate: form.eventDate,
          eventTime: form.eventTime,
          transportType: form.transportType.trim(),
          menuLink: form.menuLink.trim(),
          tips: form.tips.trim(),
          bannerImage: bannerUrl,
          // Gallery, website and social links stay empty until the listing is verified.
          photos: [],
          images: [bannerUrl],
          tags: activeTags
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create listing");

      toast.success(c.success);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "rounded-xl py-2.5";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div ref={topRef} className="scroll-mt-28" />

      {/* ---------- Stepper ---------- */}
      <div
        className="rounded-2xl border bg-white p-4 sm:p-5"
        style={{ borderColor: "var(--border-soft)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="mb-3 flex items-center justify-between sm:hidden">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {c.steps[step - 1].title}
          </p>
          <span className="text-xs font-semibold" style={{ color: "var(--brand-accent)" }}>
            {c.stepWord} {step} {c.ofWord} {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full sm:hidden" style={{ background: "var(--surface-subtle)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: "var(--brand-accent)" }}
          />
        </div>

        <ol className="hidden sm:flex sm:items-center">
          {c.steps.map((item, index) => {
            const number = index + 1;
            const Icon = STEP_ICONS[index];
            const done = number < step;
            const active = number === step;
            return (
              <li key={item.title} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => goToStep(number)}
                  className="group flex items-center gap-3 text-left"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200"
                    style={{
                      background: done || active ? "var(--brand-accent)" : "var(--surface-white)",
                      borderColor: done || active ? "var(--brand-accent)" : "var(--border-medium)",
                      color: done || active ? "#fff" : "var(--text-tertiary)"
                    }}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="hidden lg:block">
                    <span
                      className="block text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: active ? "var(--brand-accent)" : "var(--text-tertiary)" }}
                    >
                      {c.stepWord} {number}
                    </span>
                    <span
                      className="block text-sm font-semibold leading-tight"
                      style={{ color: active || done ? "var(--text-primary)" : "var(--text-tertiary)" }}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
                {number < TOTAL_STEPS && (
                  <span
                    className="mx-3 h-px flex-1 transition-colors duration-300"
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
        <div className="border-b px-5 py-5 sm:px-7" style={{ borderColor: "var(--border-soft)" }}>
          <p className="eyebrow mb-2">
            {c.stepWord} {step} {c.ofWord} {TOTAL_STEPS}
          </p>
          <h3 className="text-lg font-bold sm:text-xl" style={{ color: "var(--text-primary)" }}>
            {c.steps[step - 1].title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            {c.steps[step - 1].desc}
          </p>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-7">
          {/* ===================== STEP 1 ===================== */}
          {step === 1 && (
            <>
              {categoryLocked ? (
                <div
                  className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                  style={{ borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                      style={{ background: "var(--brand-accent)" }}
                    >
                      <Tag className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-accent)" }}>
                        {c.categorySelected}
                      </span>
                      <span className="block text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {categoryLabel}
                      </span>
                    </span>
                  </div>
                  <Link
                    href="/create-listing"
                    className="text-xs font-semibold underline underline-offset-4"
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
                      setErrors((prev) => ({ ...prev, category: "" }));
                    }}
                  />
                  {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
                </div>
              )}

              <div>
                <Select
                  name="subcategory"
                  label={`${c.subcategory} *`}
                  className={inputClass}
                  disabled={!selectedCategory}
                  options={[
                    { label: c.selectSubcategory, value: "" },
                    ...subcategories.map((item) => ({ label: subcategoryLabel(item.value), value: item.value }))
                  ]}
                  value={selectedSubcategory}
                  onChange={(event) => {
                    setSelectedSubcategory(event.target.value);
                    setErrors((prev) => ({ ...prev, subcategory: "" }));
                  }}
                />
                {errors.subcategory && <p className="mt-1 text-xs text-rose-600">{errors.subcategory}</p>}
              </div>

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

              <div className="grid gap-4 sm:grid-cols-2">
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
                {villages.length > 0 ? (
                  <Select
                    name="village"
                    label={c.village}
                    className={inputClass}
                    options={[
                      { label: c.selectVillage, value: "" },
                      ...villages.map((item) => ({ label: item, value: item }))
                    ]}
                    value={form.village}
                    onChange={(event) => update("village", event.target.value)}
                  />
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>

              <datalist id="city-list">
                {cities.map((item) => (
                  <option key={item.value} value={item.label} />
                ))}
              </datalist>

              <div>
                <Textarea
                  name="description"
                  label={`${c.description} *`}
                  className="rounded-xl"
                  placeholder={c.descriptionPlaceholder}
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  error={errors.description}
                />
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {c.descriptionHint}
                  </p>
                  <span
                    className="shrink-0 text-xs font-semibold"
                    style={{
                      color:
                        form.description.trim().length >= MIN_DESCRIPTION
                          ? "var(--brand-accent)"
                          : "var(--text-tertiary)"
                    }}
                  >
                    {form.description.trim().length}/{MIN_DESCRIPTION}
                  </span>
                </div>
              </div>

              {/* Cover photo */}
              <div className="space-y-2">
                <span className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.cover} *
                </span>

                {coverPreview ? (
                  <div
                    className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverPreview} alt="cover" className="h-48 w-full object-cover sm:h-60" />
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {coverFile?.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
                          style={{ borderColor: "var(--border-medium)", color: "var(--text-secondary)" }}
                        >
                          {c.coverReplace}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverFile(null)}
                          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {c.coverRemove}
                        </button>
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors hover:bg-[var(--brand-light)]"
                    style={{
                      borderColor: errors.cover ? "#fda4af" : "var(--border-medium)",
                      background: "var(--surface-cream)"
                    }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
                    >
                      <Camera className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {c.coverCta}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {c.coverHint}
                    </span>
                  </button>
                )}

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
                {errors.cover && <p className="text-xs text-rose-600">{errors.cover}</p>}
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {c.galleryFree} · {c.galleryVerified}
                </p>
              </div>
            </>
          )}

          {/* ===================== STEP 2 ===================== */}
          {step === 2 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="contactPhone"
                  label={`${c.phone} *`}
                  className={inputClass}
                  placeholder="+355 69 ..."
                  inputMode="tel"
                  value={form.contactPhone}
                  onChange={(event) => update("contactPhone", event.target.value)}
                  error={errors.contactPhone}
                />
                <div>
                  <Input
                    name="whatsapp"
                    label={c.whatsapp}
                    className={inputClass}
                    placeholder="+355 69 ..."
                    inputMode="tel"
                    value={form.whatsapp}
                    onChange={(event) => update("whatsapp", event.target.value)}
                  />
                  <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {c.whatsappHint}
                  </p>
                </div>
              </div>

              <Input
                name="address"
                label={`${c.address} *`}
                className={inputClass}
                placeholder={c.addressPlaceholder}
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                error={errors.address}
              />

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
                      `${form.address} ${form.location}`.trim() || "Albania"
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
            </>
          )}

          {/* ===================== STEP 3 ===================== */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <span className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.price}
                  {isPerPersonCategory ? ` (${c.perPerson})` : ""}
                </span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_140px]">
                  <Input
                    name="priceFrom"
                    type="number"
                    min={0}
                    className={inputClass}
                    label={c.priceFrom}
                    placeholder="50"
                    value={form.priceFrom}
                    onChange={(event) => update("priceFrom", event.target.value)}
                  />
                  <Input
                    name="price"
                    type="number"
                    min={0}
                    className={inputClass}
                    label={c.priceTo}
                    placeholder="150"
                    value={form.price}
                    onChange={(event) => update("price", event.target.value)}
                    error={errors.price}
                  />
                  <Select
                    name="currency"
                    label={c.currency}
                    className={`${inputClass} col-span-2 sm:col-span-1`}
                    options={[
                      { label: "€", value: "€" },
                      { label: "LEK", value: "LEK" },
                      { label: "$", value: "$" }
                    ]}
                    value={form.currency}
                    onChange={(event) => update("currency", event.target.value)}
                  />
                </div>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {c.priceHint}
                </p>
              </div>

              {showCheckTimes && (
                <div className="space-y-2">
                  <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    <Clock className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                    {c.checkTimes}
                  </span>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      name="checkIn"
                      type="time"
                      label={c.checkIn}
                      className={inputClass}
                      value={form.checkIn}
                      onChange={(event) => update("checkIn", event.target.value)}
                    />
                    <Input
                      name="checkOut"
                      type="time"
                      label={c.checkOut}
                      className={inputClass}
                      value={form.checkOut}
                      onChange={(event) => update("checkOut", event.target.value)}
                    />
                  </div>
                </div>
              )}

              {showBusinessHours && (
                <Input
                  name="businessHours"
                  label={c.businessHours}
                  className={inputClass}
                  placeholder="08:00 - 22:00"
                  value={form.businessHours}
                  onChange={(event) => update("businessHours", event.target.value)}
                />
              )}

              {showEventFields && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    name="eventDate"
                    type="date"
                    label={`${c.eventDate} *`}
                    className={inputClass}
                    value={form.eventDate}
                    onChange={(event) => update("eventDate", event.target.value)}
                    error={errors.eventDate}
                  />
                  <Input
                    name="eventTime"
                    type="time"
                    label={`${c.eventTime} *`}
                    className={inputClass}
                    value={form.eventTime}
                    onChange={(event) => update("eventTime", event.target.value)}
                    error={errors.eventTime}
                  />
                </div>
              )}

              {selectedCategory === "transport" && (
                <Input
                  name="transportType"
                  label={`${c.transportType} *`}
                  className={inputClass}
                  placeholder={c.transportPlaceholder}
                  value={form.transportType}
                  onChange={(event) => update("transportType", event.target.value)}
                  error={errors.transportType}
                />
              )}

              {selectedCategory === "restorante" && (
                <Input
                  name="menuLink"
                  label={c.menuLink}
                  className={inputClass}
                  placeholder="https://..."
                  value={form.menuLink}
                  onChange={(event) => update("menuLink", event.target.value)}
                />
              )}

              {selectedCategory === "atraksione" && (
                <Textarea
                  name="tips"
                  label={c.tips}
                  className="rounded-xl"
                  placeholder={c.tipsPlaceholder}
                  value={form.tips}
                  onChange={(event) => update("tips", event.target.value)}
                />
              )}

              {/* Features */}
              <div className="space-y-2">
                <span className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.features}
                </span>
                <div
                  className="rounded-2xl border p-4"
                  style={{ borderColor: "var(--border-soft)", background: "var(--surface-cream)" }}
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => {
                      const isActive = activeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                          style={{
                            background: isActive ? "var(--brand-accent)" : "var(--surface-white)",
                            borderColor: isActive ? "var(--brand-accent)" : "var(--border-soft)",
                            color: isActive ? "#fff" : "var(--text-secondary)"
                          }}
                        >
                          {isActive && <Check className="h-3 w-3" />}
                          {tag}
                        </button>
                      );
                    })}
                    {activeTags
                      .filter((tag) => !suggestedTags.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                          style={{ background: "var(--text-primary)" }}
                        >
                          {tag}
                          <span className="text-sm leading-none">×</span>
                        </button>
                      ))}
                  </div>
                  <div className="relative">
                    <Sparkles
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: "var(--brand-accent)" }}
                    />
                    <input
                      type="text"
                      value={customTag}
                      onChange={(event) => setCustomTag(event.target.value)}
                      onKeyDown={addCustomTag}
                      placeholder={c.customTag}
                      className="input-base pl-9"
                    />
                  </div>
                  <p className="mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {c.featuresHint}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ===================== STEP 4 ===================== */}
          {step === 4 && (
            <div className="space-y-5">
              <div
                className="flex items-start gap-3 rounded-2xl border px-4 py-4"
                style={{ borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
              >
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {c.verifiedTitle}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {c.verifiedSubtitle}
                  </p>
                </div>
              </div>

              {/* Locked fields — kept visually muted so the limit is obvious at a glance. */}
              <div className="grid gap-4 sm:grid-cols-2">
                <LockedField icon={Globe} label={c.website} placeholder="https://..." />
                <LockedField icon={CalendarClock} label={c.bookNow} placeholder="https://..." />
                <LockedField icon={Instagram} label={c.instagram} placeholder="https://instagram.com/..." />
                <LockedField icon={Facebook} label={c.facebook} placeholder="https://facebook.com/..." />
              </div>

              <div className="space-y-2 opacity-60">
                <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  <ImagePlus className="h-4 w-4" />
                  {c.galleryLocked}
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {Array.from({ length: 10 }).map((_, index) => (
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
            </div>
          )}
        </div>

        {/* ---------- Navigation ---------- */}
        <div
          className="flex flex-col gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            disabled={step === 1 || loading}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-secondary)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            {c.back}
          </button>

          {step < TOTAL_STEPS ? (
            <button type="button" onClick={() => goToStep(step + 1)} className="btn-primary w-full sm:w-auto">
              {c.next}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden text-xs sm:block" style={{ color: "var(--text-tertiary)" }}>
              {c.reviewNote}
            </span>
          )}
        </div>
      </div>

      {/* ---------- Publish ---------- */}
      {step === TOTAL_STEPS && (
        <div className="space-y-3 text-center">
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--brand-accent)", boxShadow: "0 6px 20px rgba(31, 138, 112, 0.28)" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {c.publishing}
              </>
            ) : (
              <>
                <span aria-hidden>🟢</span>
                {c.publish}
              </>
            )}
          </button>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {c.publishNote}
          </p>
        </div>
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
