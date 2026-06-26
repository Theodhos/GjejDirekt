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
  const [cities, setCities] = useState<any[]>(albaniaCities);
  const [villages, setVillages] = useState<string[]>([]);
  const [selectedVillage, setSelectedVillage] = useState("");

  // When a category is passed via the URL (?category=...), lock it and only show the subcategory selector.
  const lockedCategoryParam = searchParams.get("category");
  const categoryLocked = Boolean(
    lockedCategoryParam && categories.some((item) => item.value === lockedCategoryParam)
  );

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  const suggestedTags = useMemo(() => {
    if (selectedCategory) {
      if (selectedSubcategory && SUBCATEGORY_DEFAULT_TAGS[selectedCategory]?.[selectedSubcategory]) {
        return SUBCATEGORY_DEFAULT_TAGS[selectedCategory][selectedSubcategory];
      }
      return categories.find((item) => item.value === selectedCategory)?.tags || [];
    }
    return [];
  }, [selectedCategory, selectedSubcategory]);

  // Set default 5 tags dynamically depending on selected Category and Subcategory
  useEffect(() => {
    if (selectedCategory) {
      if (selectedSubcategory && SUBCATEGORY_DEFAULT_TAGS[selectedCategory]?.[selectedSubcategory]) {
        setActiveTags(SUBCATEGORY_DEFAULT_TAGS[selectedCategory][selectedSubcategory].slice(0, 5));
      } else if (CATEGORY_DEFAULT_TAGS[selectedCategory]) {
        setActiveTags(CATEGORY_DEFAULT_TAGS[selectedCategory].slice(0, 5));
      } else {
        const standardTags = categories.find((item) => item.value === selectedCategory)?.tags || [];
        setActiveTags(standardTags.slice(0, 5));
      }
    } else {
      setActiveTags([]);
    }
  }, [selectedCategory, selectedSubcategory]);

  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");

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
    const found = cities.find((c) => String(c.label).toLowerCase() === location.toLowerCase());
    const nextVillages = found?.villages || [];
    setVillages(nextVillages);
    if (!nextVillages.includes(selectedVillage)) setSelectedVillage("");
  }, [location, cities, selectedVillage]);

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

  const isPerPersonCategory = selectedCategory === "akomodim" || selectedCategory === "restorante";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const bannerFile = formData.get("bannerImage") as File | null;
      const galleryFiles = Array.from(formData.getAll("galleryImages")).filter((item): item is File => item instanceof File && item.size > 0).slice(0, 5);

      if (!bannerFile || bannerFile.size === 0) {
        throw new Error(t.forms.listing.bannerRequired);
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

      toast.success(t.forms.listing.submittedForApproval);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 text-sm">
      <div className="grid gap-3 lg:grid-cols-2">
        <Input
          name="title"
          label={t.common.title || (language === 'en' ? 'Title' : 'Titulli')}
          placeholder={t.forms.listing.titlePlaceholder}
          required
        />
        <Input
          name="location"
          label={t.common.city || (language === 'en' ? 'City' : 'Qyteti')}
          placeholder={t.forms.listing.locationPlaceholder}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          list="city-list"
          required
        />
      </div>

      <Textarea
        name="description"
        label={t.common.description || (language === 'en' ? 'Description' : 'Përshkrimi')}
        placeholder={t.common.descriptionPlaceholder || (language === 'en' ? 'Describe the experience, highlights and what makes this listing special.' : 'Përshkruani përvojën, pikat kryesore dhe çfarë e bën këtë vend unik.')}
        required
      />

      <datalist id="city-list">
        {cities.map((item) => (
          <option key={item.value} value={item.label} />
        ))}
      </datalist>

      {villages.length > 0 && (
        <Select
          name="village"
          label={t.forms.listing.villageLabel}
          options={[
            { label: t.forms.listing.villageSelectPlaceholder, value: "" },
            ...villages.map((v) => ({ label: v, value: v }))
          ]}
          value={selectedVillage}
          onChange={(event) => setSelectedVillage(event.target.value)}
        />
      )}

      {categoryLocked && <input type="hidden" name="category" value={selectedCategory} />}
      <div className={categoryLocked ? "grid gap-4" : "grid gap-4 lg:grid-cols-2"}>
        {!categoryLocked && (
          <Select
            name="category"
            label={t.common.category}
            options={[
              { label: t.common.selectCategory || (language === 'en' ? 'Select a category' : 'Zgjidhni një kategori'), value: '' },
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
        )}
        <Select
          name="subcategory"
          label={t.common.subcategory}
          options={[
            { label: t.common.selectSubcategory || (language === 'en' ? 'Select a subcategory' : 'Zgjidhni një nënkategori'), value: '' },
            ...subcategories.map((item) => ({ label: item.label, value: item.value }))
          ]}
          value={selectedSubcategory}
          onChange={(event) => setSelectedSubcategory(event.target.value)}
          required
        />
      </div>

      {/* Tags Section */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
          {t.forms.listing.featuresAmenities}
        </label>
        <div className="p-4 rounded-md bg-slate-50 border border-slate-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedTags.map(tag => {
              const isActive = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    isActive 
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <span>{tag}</span>
                  {isActive && (
                    <span className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[10px] leading-none transition-colors font-black">
                      ×
                    </span>
                  )}
                </button>
              );
            })}
            {activeTags.filter(t => !suggestedTags.includes(t)).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white shadow flex items-center gap-1"
              >
                <span>{tag}</span>
                <span className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[10px] leading-none transition-colors font-black">
                  ×
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={addCustomTag}
              placeholder={t.forms.listing.addCustomTagPlaceholder}
              className="w-full h-10 pl-10 pr-3 rounded-md bg-white border border-slate-200 focus:border-brand-500 outline-none text-xs font-medium text-slate-950"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Input
          name="contactPhone"
          label={language === 'en' ? 'Contact Phone' : 'Telefoni i Kontaktit'}
          placeholder="+355 69 ..."
          required={selectedCategory !== "atraksione"}
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

      {/* WhatsApp & Website (available for all except Atraksione) */}
      {selectedCategory && selectedCategory !== "atraksione" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Input
            name="whatsapp"
            label="WhatsApp"
            placeholder="+355 69 ..."
          />
          <Input
            name="website"
            label="Website"
            placeholder="https://..."
          />
        </div>
      )}

      {/* Check-in / Check-out (only for Akomodim) */}
      {selectedCategory === "akomodim" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Input
            name="checkIn"
            label={language === 'en' ? 'Check-in Time (optional)' : 'Check-in (opsionale)'}
            placeholder="14:00"
          />
          <Input
            name="checkOut"
            label={language === 'en' ? 'Check-out Time (optional)' : 'Check-out (opsionale)'}
            placeholder="11:00"
          />
        </div>
      )}

      {/* Menu Link (only for Restorante) */}
      {selectedCategory === "restorante" && (
        <Input
          name="menuLink"
          label={language === 'en' ? 'Menu Link (optional)' : 'Linku i Menusë (opsionale)'}
          placeholder="https://..."
        />
      )}

      {/* Event Details (only for Evente) */}
      {selectedCategory === "evente" && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Input
              name="eventDate"
              type="date"
              label={language === 'en' ? 'Event Date' : 'Data e Eventit'}
              required
            />
            <Input
              name="eventTime"
              type="time"
              label={language === 'en' ? 'Event Time' : 'Ora e Eventit'}
              required
            />
          </div>
          <Input
            name="bookingLink"
            label={language === 'en' ? 'Booking Link (optional)' : 'Linku i Rezervimit (opsionale)'}
            placeholder="https://..."
          />
        </>
      )}

      {/* Transport Type (only for Transport) */}
      {selectedCategory === "transport" && (
        <Input
          name="transportType"
          label={language === 'en' ? 'Type of Transport' : 'Lloji i Transportit'}
          placeholder={language === 'en' ? 'e.g. Taxi, Boat, Rental Car...' : 'p.sh. Taksi, Varkë, Makinë me Qira...'}
          required
        />
      )}

      {/* Tips / Additional Info (only for Atraksione) */}
      {selectedCategory === "atraksione" && (
        <Textarea
          name="tips"
          label={language === 'en' ? 'Tips / Additional Information (optional)' : 'Këshilla / Informacion shtesë (opsionale)'}
          placeholder={language === 'en' ? 'e.g. Best time to visit, tickets info...' : 'p.sh. Koha më e mirë për vizitë, biletat...'}
        />
      )}

      {/* Conditionally Render Business Hours & Price Fields */}
      {(selectedCategory === "restorante" ||
        selectedCategory === "sherbime-turistike" ||
        selectedCategory === "transport" ||
        selectedCategory === "atraksione" ||
        selectedCategory === "akomodim" ||
        selectedCategory === "produkte-lokale") && (
        <div className="grid gap-4 lg:grid-cols-2">
          {(selectedCategory === "restorante" ||
            selectedCategory === "sherbime-turistike" ||
            selectedCategory === "transport" ||
            selectedCategory === "atraksione") ? (
            <Input
              name="businessHours"
              label={language === 'en' ? 'Opening Hours' : 'Orari i punës'}
              placeholder="08:00 - 22:00"
            />
          ) : (
            <div />
          )}

          {(selectedCategory === "akomodim" ||
            selectedCategory === "sherbime-turistike" ||
            selectedCategory === "produkte-lokale" ||
            selectedCategory === "transport" ||
            selectedCategory === "atraksione") ? (
            <div className="grid grid-cols-[1fr_1fr_160px] gap-2">
              <Input
                name="priceFrom"
                type="number"
                label={
                  isPerPersonCategory
                    ? (language === 'en' ? 'Min Price (per person)' : 'Çmimi Min (për person)')
                    : (language === 'en' ? 'Min Price' : 'Çmimi Minimal')
                }
                placeholder="50"
              />
              <Input
                name="price"
                type="number"
                label={
                  isPerPersonCategory
                    ? (language === 'en' ? 'Max Price (per person)' : 'Çmimi Max (për person)')
                    : (language === 'en' ? 'Max Price' : 'Çmimi Maksimal')
                }
                placeholder="150"
              />
              <Select
                name="currency"
                label={language === 'en' ? 'Currency' : 'Valuta'}
                options={[
                  { label: "LEK", value: "LEK" },
                  { label: "€", value: "€" },
                  { label: "$", value: "$" }
                ]}
              />
            </div>
          ) : (
            <div />
          )}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
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
        <label className="block space-y-2 rounded-md border border-slate-200 bg-white p-4 group hover:border-brand-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">{t.forms.listing.mainBannerPhoto}</span>
            <Camera className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <input
            name="bannerImage"
            type="file"
            accept="image/*"
            className="w-full text-xs text-slate-500"
            required
          />
          <p className="text-[11px] text-slate-400">{t.forms.listing.mainBannerNote}</p>
        </label>

        <label className="block space-y-2 rounded-md border border-slate-200 bg-white p-4 group hover:border-brand-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">{t.forms.listing.galleryLabel}</span>
            <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <input
            name="galleryImages"
            type="file"
            accept="image/*"
            multiple
            className="w-full text-xs text-slate-500"
            required
          />
          <p className="text-[11px] text-slate-400">{t.forms.listing.galleryNote}</p>
        </label>
      </div>

      <input type="hidden" name="country" value="Albania" />

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-14 text-base font-bold uppercase shadow-md"
        >
          {loading ? t.forms.listing.creatingService : t.forms.listing.launchListing}
        </Button>
      </div>
    </form>
  );
}
