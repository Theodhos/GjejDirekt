/**
 * What a visitor can do with a business.
 *
 * The rule that drives the whole taxonomy: sells things you can put in a basket
 * → "porosi"; has a time, date or seat that has to be held → "rezervim". A
 * business that does both activates both.
 */
export type ListingAction = "porosi" | "rezervim";

export type CategorySubcategory = {
  value: string;
  label: string;
  aliases?: string[];
  /**
   * Narrows the category default when a subcategory does not behave like its
   * siblings — a Pet Shop sells, a Veteriner books, and both sit under Kafshë
   * Shtëpiake. Omit to inherit the category's actions.
   */
  actions?: ListingAction[];
};

export type CategoryDefinition = {
  value: string;
  label: string;
  aliases: string[];
  image: string;
  /** CSS custom property holding the tile colour — see :root in app/globals.css. */
  color: string;
  /** Default actions for every listing in this category. */
  actions: ListingAction[];
  /**
   * Whether listings here get the products/menu catalog and the cart → WhatsApp
   * order flow (ListingProducts + ListingCart). Defaults to actions including
   * "porosi" — Hotele is the one rezervim-only category that overrides this to
   * true, since its "products" are room types booked through the same cart UI.
   */
  catalog?: boolean;
  tags?: string[];
  subcategories: CategorySubcategory[];
};

/**
 * GjejDirekt taxonomy — sixteen top-level categories, exactly the ones shown in
 * the home grid.
 *
 * Every value the platform has ever stored survives here as an alias, because the
 * listings in MongoDB still carry the original tourism-directory values
 * ("akomodim", "atraksione", "aktivitete", "evente", "transport",
 * "produkte-lokale", "restorante", "sherbime-turistike"). getCategoryByValue and
 * getSubcategoryLabel match on aliases, so an old row simply reads as its new
 * category instead of falling out of the site.
 *
 * Category-level aliases must stay globally unique — the first match wins.
 * Subcategory aliases are scoped to their category, so the same word may repeat
 * under different parents.
 */
export const categories: CategoryDefinition[] = [
  {
    value: "ushqim-pije",
    label: "Ushqim & Pije",
    aliases: [
      "ushqim", "food", "restorante", "restaurants", "restaurant", "dining",
      "cafe", "kafe", "bar", "gastronomi"
    ],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-ushqim-pije)",
    // Sells food and holds tables, so both.
    actions: ["porosi", "rezervim"],
    tags: ["Porosi në WhatsApp", "Dërgesa", "Merr me vete", "Ulje jashtë", "Wi-Fi", "Parkim", "Rezervime", "Opsione vegane", "Muzikë live"],
    subcategories: [
      { value: "restorante", label: "Restorante", aliases: ["restorant", "restaurant", "tradicional", "traditional", "internacional", "international", "delivery", "dergesa", "takeaway"] },
      { value: "krepa", label: "Krepa", aliases: ["creperi", "creperie", "crepe", "crepes", "palacinka", "palacinke"] },
      { value: "fast-food", label: "Fast Food", aliases: ["fast food", "burger", "kebab"] },
      { value: "pica", label: "Pica", aliases: ["pizzeri", "pizzeria", "pizza"] },
      { value: "kafene", label: "Kafene", aliases: ["coffee", "kafe-bar", "bar-lounge", "lounge", "pub", "verari", "winery", "wine bar"] },
      { value: "pasticeri", label: "Pastiçeri", aliases: ["embeltore", "pastry", "patisserie", "embelsira", "sweets", "desserts"] },
      { value: "furra-buke", label: "Furra Buke", aliases: ["byrektore", "byrek", "bakery", "furre", "furra"] },
      { value: "catering", label: "Catering", aliases: ["katering"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "hotele",
    label: "Hotele & Akomodim",
    aliases: [
      "akomodim", "accommodation", "stays", "stay", "hotel", "hotels", "resort", "resorts",
      "villa", "villas", "homestays", "fjetje", "lodging"
    ],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-hotele)",
    actions: ["rezervim"],
    // Rooms are still "products" added through the same catalog + cart flow as a
    // shop, just requested with dates instead of a straight order.
    catalog: true,
    tags: ["Wi-Fi", "Ajër i kondicionuar", "Parkim", "Mëngjes i përfshirë", "Pishinë", "Pamje nga deti", "Kuzhinë", "Lejohen kafshët"],
    subcategories: [
      { value: "hotele", label: "Hotele", aliases: ["hotel", "hotels", "motel", "motels", "hostel", "hostels", "resort", "resorts"] },
      { value: "bujtina", label: "Bujtina", aliases: ["guesthouse", "guest house", "bujtine", "homestays", "home stay", "agroturizem", "agrotourism", "farm stay"] },
      { value: "apartamente", label: "Apartamente", aliases: ["apartament", "apartments", "apartment"] },
      { value: "vila", label: "Vila", aliases: ["villa", "villas"] },
      { value: "camping", label: "Camping", aliases: ["camp", "kamping", "glamping"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "shopping",
    label: "Shopping",
    aliases: [
      "products", "produkte", "shop", "shops", "store", "stores", "dyqan", "dyqane",
      "retail", "souvenirs", "artisan", "handmade"
    ],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-shopping)",
    actions: ["porosi"],
    tags: ["Dërgesa në shtëpi", "Pagesa me kartë", "Porosi në WhatsApp", "Kthim i mallit", "Garanci", "Artizanal"],
    subcategories: [
      { value: "veshje", label: "Veshje", aliases: ["clothing", "fashion", "rroba"] },
      { value: "kepuce", label: "Këpucë", aliases: ["shoes", "kepuce-canta", "bags", "canta"] },
      { value: "bizhuteri", label: "Bizhuteri", aliases: ["jewelry", "aksesore", "accessories"] },
      { value: "kozmetike", label: "Kozmetikë", aliases: ["cosmetics", "parfume", "perfume"] },
      { value: "elektronike", label: "Elektronikë", aliases: ["electronics"] },
      { value: "telefona", label: "Telefona", aliases: ["phones", "mobile", "celular"] },
      { value: "kompjutere", label: "Kompjuterë", aliases: ["computers", "laptop", "pc"] },
      { value: "mobilje", label: "Mobilje", aliases: ["furniture"] },
      { value: "dekor", label: "Dekor", aliases: ["decor", "decoration", "dekorim"] },
      { value: "lodra", label: "Lodra", aliases: ["toys", "lodra-femije", "kids", "femije"] },
      { value: "librari", label: "Librari", aliases: ["libraria", "books", "bookstore", "stationery", "kancelari"] },
      { value: "dhurata", label: "Dhurata", aliases: ["gifts", "lule-dhurata", "flowers", "lule", "artizanat", "suvenire", "souvenirs", "handmade", "sport-hobi", "hobby"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "supermarkete",
    label: "Supermarkete",
    aliases: ["supermarket", "market", "grocery", "groceries", "produkte-lokale", "local products", "minimarket"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-supermarkete)",
    actions: ["porosi"],
    tags: ["Dërgesa në shtëpi", "Porosi në WhatsApp", "Pagesa me kartë", "Produkte bio", "Hapur 24/7"],
    subcategories: [
      { value: "supermarkete", label: "Supermarkete", aliases: ["supermarket"] },
      { value: "minimarkete", label: "Minimarkete", aliases: ["minimarket", "market i vogel"] },
      { value: "produkte-ushqimore", label: "Produkte Ushqimore", aliases: ["ushqimore", "food products", "djathe-bulmet", "djathe", "cheese", "dairy", "bulmet"] },
      { value: "produkte-bio", label: "Produkte Bio", aliases: ["bio", "organic", "mjalte", "honey", "agro"] },
      { value: "pije", label: "Pije", aliases: ["drinks", "vere-raki", "vere", "wine", "raki", "birra", "beer"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "bukuri",
    label: "Bukuri & Wellness",
    aliases: ["beauty", "wellness", "salon", "sallon", "hair", "estetike", "barber"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-bukuri)",
    actions: ["rezervim"],
    tags: ["Rezervo takim", "Parkim", "Produkte profesionale", "Hapur të dielën"],
    subcategories: [
      { value: "parukeri", label: "Parukeri", aliases: ["hairdresser", "hair salon", "floktari"] },
      { value: "berber", label: "Berber", aliases: ["barbershop"] },
      { value: "spa", label: "SPA", aliases: ["spa-masazh", "wellness center"] },
      { value: "estetike", label: "Estetikë", aliases: ["kozmetike", "cosmetics", "facial", "makeup", "make up", "grim", "vetulla-qerpik", "brows", "lashes", "qerpike", "epilim", "waxing", "laser", "depilim", "solarium", "tanning", "tatuazh-piercing", "tattoo", "piercing"] },
      { value: "masazh", label: "Masazh", aliases: ["massage"] },
      { value: "thonj", label: "Thonj", aliases: ["nails", "manicure", "manikyr", "pedikyr"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "shendet",
    label: "Shëndet",
    aliases: ["health", "shendetesi", "medical", "clinic", "mjek", "doctor", "healthcare", "pharmacy"],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-shendet)",
    actions: ["rezervim"],
    tags: ["Rezervo takim", "Urgjencë 24/7", "Kontratë me sigurimet", "Parkim", "Vizitë në shtëpi"],
    subcategories: [
      { value: "klinika", label: "Klinika", aliases: ["klinike", "poliklinike", "farmaci", "barnatore", "psikolog", "psychologist", "therapy", "psikoterapi", "nutricionist", "nutritionist", "diet"] },
      { value: "dentiste", label: "Dentistë", aliases: ["dentist", "dental", "stomatolog"] },
      { value: "laboratore", label: "Laboratorë", aliases: ["laborator", "laboratory", "analiza"] },
      { value: "fizioterapi", label: "Fizioterapi", aliases: ["physiotherapy", "rehabilitim"] },
      { value: "okuliste", label: "Okulistë", aliases: ["optike", "optics", "syze", "optician", "okulist"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "auto",
    label: "Automjete",
    aliases: [
      "automjete", "transport", "transportation", "transfers", "transfer", "taxi",
      "car rental", "cars", "makina", "vehicles", "car", "boat"
    ],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-auto)",
    actions: ["rezervim"],
    tags: ["Servis 24/7", "Karro-atrezzo", "Garanci", "Pjesë origjinale", "Ndërrim vaji", "Diagnostikim"],
    subcategories: [
      { value: "rent-a-car", label: "Rent a Car", aliases: ["makine-me-qira", "car rental", "rent a car", "motocikleta-me-qira", "motorbike rental", "scooter", "bike rental", "bicikleta-me-qira", "bicycle"] },
      { value: "servis", label: "Servis", aliases: ["servis-auto", "car service", "mechanic", "mekanik", "elektroauto", "auto electric", "ac service", "karro-atrezzo", "towing", "tow truck"] },
      { value: "lavazh", label: "Lavazh", aliases: ["car wash", "larje makinash"] },
      { value: "gomisteri", label: "Gomisteri", aliases: ["gomiste", "tires", "goma", "tyre"] },
      // Also sells spare parts as physical stock, unlike the rest of the category (booked services).
      { value: "auto-salon", label: "Auto Salon", aliases: ["shitje-makinash", "car dealer", "auto sales", "shitje auto", "pjese-kembimi", "spare parts", "auto parts"], actions: ["rezervim", "porosi"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other", "taksi", "taxi", "shuttle", "aeroport", "airport transfer", "minibus", "van", "furgon", "transport-mallrash", "cargo", "logistics", "varka", "ferry", "autoshkolle", "driving school"] }
    ]
  },
  {
    value: "shtepi-ndertim",
    label: "Shtëpi & Ndërtim",
    aliases: [
      "shtepi", "ndertim", "construction", "home", "imobiliare", "real estate",
      "realestate", "property", "properties", "prona", "estate"
    ],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-shtepi-ndertim)",
    actions: ["porosi"],
    tags: ["Dërgesa", "Montim i përfshirë", "Garanci", "Me porosi", "Matje falas"],
    subcategories: [
      { value: "mobilim", label: "Mobilim", aliases: ["furnishing", "mobilieri", "marangoz", "carpenter", "zdrukthtar"] },
      { value: "elektroshtepiake", label: "Elektroshtëpiake", aliases: ["appliances", "pajisje shtepiake", "elektro-shtepiake"] },
      { value: "materiale-ndertimi", label: "Materiale Ndërtimi", aliases: ["building materials", "materiale", "hidrosanitare"] },
      { value: "kuzhina", label: "Kuzhina", aliases: ["kitchens", "kuzhine"] },
      { value: "dyer-dritare", label: "Dyer & Dritare", aliases: ["doors", "windows", "dyer", "dritare"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other", "apartament-shitje", "apartament-qira", "shtepi-vila", "ambiente-biznesi", "toka", "truall", "garazh-magazine", "agjenci-imobiliare", "real estate agency"] }
    ]
  },
  {
    value: "sherbime-shtepi",
    label: "Shërbime për Shtëpinë",
    aliases: ["sherbime", "services", "service", "mjeshter", "riparime", "repairs", "home services"],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-sherbime-shtepi)",
    actions: ["rezervim"],
    tags: ["Vjen në adresë", "Urgjencë 24/7", "Ofertë falas", "Garanci pune", "Faturë tatimore"],
    subcategories: [
      { value: "hidraulik", label: "Hidraulik", aliases: ["plumber", "idraulik"] },
      { value: "elektricist", label: "Elektricist", aliases: ["electrician"] },
      { value: "bojaxhi", label: "Bojaxhi", aliases: ["bojatisje", "painting", "painter", "suvatim"] },
      { value: "pastrim", label: "Pastrim", aliases: ["cleaning", "pastrues", "dezinfektim", "lavanderi", "laundry", "pastrim kimik"] },
      { value: "kondicionere", label: "Kondicionerë", aliases: ["kondicioner", "ac", "hvac", "klime", "ngrohje"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other", "transport-mobiljesh", "moving", "zhvendosje"] }
    ]
  },
  {
    value: "sherbime-profesionale",
    label: "Shërbime Profesionale",
    aliases: ["profesionist", "professional", "professional services"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-sherbime-profesionale)",
    actions: ["rezervim"],
    tags: ["Konsultë falas", "Online", "Faturë tatimore", "Kontratë", "Në adresë"],
    subcategories: [
      { value: "avokat", label: "Avokat", aliases: ["lawyer", "avokat-noter", "juridik", "legal"] },
      { value: "noter", label: "Noter", aliases: ["notary"] },
      { value: "kontabilist", label: "Kontabilist", aliases: ["accountant", "finance", "kontabilitet", "financa"] },
      { value: "marketing", label: "Marketing", aliases: ["reklama", "advertising", "social media"] },
      { value: "it", label: "IT", aliases: ["it-web", "web", "software", "programim", "development"] },
      { value: "dizajn", label: "Dizajn", aliases: ["design", "grafik", "graphic design"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other", "perkthyes", "translator", "translation", "sigurime", "insurance", "sigurime-udhetimi"] }
    ]
  },
  {
    value: "evente",
    label: "Evente & Dasma",
    aliases: ["events", "event", "dasma", "dasem", "wedding", "weddings"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-evente)",
    actions: ["rezervim"],
    tags: ["Rezervim i nevojshëm", "Paketë e plotë", "Provë falas", "Transport i përfshirë"],
    subcategories: [
      { value: "salla-eventesh", label: "Salla Eventesh", aliases: ["salla", "sallë", "venue", "event hall", "restorant dasmash"] },
      { value: "fotograf", label: "Fotograf", aliases: ["foto-video", "photographer", "foto", "photography"] },
      { value: "videograf", label: "Videograf", aliases: ["videographer", "video"] },
      { value: "dj", label: "DJ", aliases: ["muzike", "music", "muzikë live", "band"] },
      { value: "dekor", label: "Dekor", aliases: ["decor", "dekorim", "decoration", "lule dasme"] },
      // Sells food for the event, same as Catering under Ushqim & Pije, so it keeps porosi too.
      { value: "catering", label: "Catering", aliases: ["katering"], actions: ["porosi", "rezervim"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other", "organizim-eventesh", "event organisation", "event planning", "koncerte", "concert", "concerts", "festivale", "festival", "festivals", "feste-tradicionale", "panaire", "fair", "ekspozite", "exhibition", "event-kulturor", "event-sportiv", "event-gastronomik"] }
    ]
  },
  {
    value: "turizem",
    label: "Turizëm & Aktivitete",
    aliases: [
      "tourism", "atraksione", "attractions", "attraction", "aktivitete", "activities",
      "activity", "tours", "tour", "excursions", "things to do", "experiences",
      "sherbime-turistike", "tourism services", "travel services"
    ],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-turizem)",
    actions: ["rezervim"],
    tags: ["Guidë e certifikuar", "Transport i përfshirë", "Pajisjet përfshihen", "Për familje", "Rezervim i nevojshëm", "Biletë hyrjeje"],
    subcategories: [
      { value: "agjenci-turistike", label: "Agjenci Turistike", aliases: ["agjenci-udhetimi", "travel agency", "agjenci", "agency", "rezervime", "bookings"] },
      { value: "guida", label: "Guida", aliases: ["guide-turistik", "guide", "guides", "tour guide"] },
      { value: "ture", label: "Ture", aliases: ["tur-ditor", "day tour", "ekskursione", "excursions", "tur-kulturor", "cultural tour", "boat-tour", "boat", "boat tour", "tur me varke", "tur-gastronomik", "food tour", "gastronomy", "tur-me-vere", "wine tour", "wine tasting"] },
      { value: "aktivitete", label: "Aktivitete", aliases: ["atraksione-natyrore", "natyre", "nature", "park", "plazh", "beach", "liqen", "lake", "ujevare", "waterfall", "kanion", "canyon", "shpelle", "cave", "pike-panoramike", "viewpoint", "muze-kala", "muze", "museum", "kala", "castle", "historike", "historical", "kulturore", "cultural", "fetare", "religious"] },
      { value: "sporte-aventure", label: "Sporte Aventurë", aliases: ["hiking", "trekking", "ecje", "mountain", "rafting-kayak", "rafting", "raft", "kayak", "kayaking", "kajak", "zhytje", "diving", "scuba", "snorkeling", "atv-zipline", "atv", "buggy", "quad", "zipline", "zip line", "paragliding", "parapente", "ski-kalerim", "ski", "skiing", "snowboard", "kalerim", "horse riding"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "arsim",
    label: "Arsim & Trajnime",
    aliases: ["education", "courses", "kurse", "school", "trajnime", "training", "shkolle"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-arsim)",
    actions: ["rezervim"],
    tags: ["Online", "Certifikatë", "Grupe të vogla", "Provë falas", "Në adresë"],
    subcategories: [
      { value: "kurse", label: "Kurse", aliases: ["arsim-kurse", "course", "kurs"] },
      { value: "gjuhe-huaja", label: "Gjuhë të Huaja", aliases: ["languages", "gjuhe", "anglisht", "english", "italisht", "gjermanisht"] },
      { value: "trajnime", label: "Trajnime", aliases: ["workshop", "seminar"] },
      { value: "mesim-privat", label: "Mësim Privat", aliases: ["meditime", "private lessons", "tutor", "repetitor"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "sport-fitness",
    label: "Sport & Fitness",
    aliases: ["sport", "sports", "fitness", "gym", "palester"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-sport-fitness)",
    actions: ["rezervim"],
    tags: ["Abonim mujor", "Trajner personal", "Dushe", "Parkim", "Hapur 24/7"],
    subcategories: [
      { value: "palester", label: "Palestër", aliases: ["palestra", "gym", "fitnes", "fitness"] },
      { value: "yoga", label: "Yoga", aliases: ["joga"] },
      { value: "pilates", label: "Pilates" },
      { value: "pishine", label: "Pishinë", aliases: ["pool", "swimming", "not"] },
      { value: "tenis", label: "Tenis", aliases: ["tennis", "padel"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "kafshe",
    label: "Kafshë Shtëpiake",
    aliases: ["pets", "pet", "animals", "veteriner", "vet", "veterinary", "pet shop"],
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-kafshe)",
    // Shops sell, clinics and groomers book — the subcategories below narrow it.
    actions: ["porosi", "rezervim"],
    tags: ["Dërgesa", "Porosi në WhatsApp", "Rezervo takim", "Urgjencë", "Ushqim premium"],
    subcategories: [
      { value: "pet-shop", label: "Pet Shop", aliases: ["petshop", "dyqan kafshesh", "ushqim kafshesh"], actions: ["porosi"] },
      { value: "veteriner", label: "Veteriner", aliases: ["vet", "veterinary", "klinike veterinare"], actions: ["rezervim"] },
      { value: "grooming", label: "Grooming", aliases: ["tozime", "larje kafshesh", "pet grooming"], actions: ["rezervim"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  },
  {
    value: "biznese-industri",
    label: "Biznese & Industri",
    aliases: ["industri", "industry", "biznes", "business", "wholesale", "shumice", "prodhues", "manufacturing", "b2b"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    color: "var(--cat-biznese-industri)",
    actions: ["porosi"],
    tags: ["Shitje me shumicë", "Faturë tatimore", "Transport i përfshirë", "Me porosi", "Garanci"],
    subcategories: [
      { value: "materiale-ndertimi", label: "Materiale Ndërtimi", aliases: ["building materials", "materiale", "inerte", "hekur", "cimento"] },
      { value: "pajisje-profesionale", label: "Pajisje Profesionale", aliases: ["professional equipment", "pajisje", "pajisje hoteleri", "equipment"] },
      { value: "prodhues", label: "Prodhues", aliases: ["manufacturer", "fabrike", "factory", "prodhim"] },
      { value: "shitje-shumice", label: "Shitje me Shumicë", aliases: ["wholesale", "shumice", "distributor", "distribucion"] },
      { value: "makineri", label: "Makineri", aliases: ["machinery", "machines", "makina industriale", "qira pajisjesh", "qira-pajisjesh"] },
      { value: "te-tjera", label: "Tjetër", aliases: ["others", "other"] }
    ]
  }
];

export const statusLabels = {
  pending: "Në pritje",
  approved: "Miratuar",
  rejected: "Refuzuar"
} as const;

/** Copy for each action, in both languages the UI ships. */
export const actionLabels: Record<ListingAction, { sq: string; en: string; sqShort: string; enShort: string }> = {
  porosi: { sq: "Porosit në WhatsApp", en: "Order on WhatsApp", sqShort: "Porosit", enShort: "Order" },
  rezervim: { sq: "Rezervo në WhatsApp", en: "Book on WhatsApp", sqShort: "Rezervo", enShort: "Book" }
};

/**
 * Opening line for the WhatsApp hand-off. The verb has to match the action —
 * "dua të porosis" reads wrong to a hotel, "dua të rezervoj" reads wrong to a shop.
 */
export function whatsappMessage(action: ListingAction, title: string, language: "sq" | "en" = "sq") {
  if (language === "en") {
    return action === "rezervim"
      ? `Hello, I would like to book at ${title} (GjejDirekt).`
      : `Hello, I would like to order from ${title} (GjejDirekt).`;
  }
  return action === "rezervim"
    ? `Përshëndetje, dua të rezervoj te ${title} (GjejDirekt).`
    : `Përshëndetje, dua të porosis te ${title} (GjejDirekt).`;
}

export function whatsappHrefFor(
  action: ListingAction,
  phoneDigits: string,
  title: string,
  language: "sq" | "en" = "sq"
) {
  if (!phoneDigits) return "";
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage(action, title, language))}`;
}

/** One entry per action a listing supports, ready for the contact buttons. */
export function buildWhatsappActions(
  listing: { title?: string; category?: string; subcategory?: string; actions?: string[] | null } | undefined,
  phoneDigits: string,
  language: "sq" | "en" = "sq"
): { action: ListingAction; href: string }[] {
  if (!phoneDigits || !listing) return [];
  return getListingActions(listing).map((action) => ({
    action,
    href: whatsappHrefFor(action, phoneDigits, listing.title || "", language)
  }));
}

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

/** Tile colour for a category, falling back to the brand red for unknown values. */
export function getCategoryColor(value?: string) {
  return getCategoryByValue(value)?.color || "var(--brand-accent)";
}

function findSubcategory(categoryValue?: string, subcategoryValue?: string) {
  if (!subcategoryValue) return undefined;
  const category = getCategoryByValue(categoryValue);
  const normalized = subcategoryValue.toLowerCase();
  return category?.subcategories.find(
    (item) =>
      item.value === normalized ||
      item.label.toLowerCase() === normalized ||
      item.aliases?.includes(normalized)
  );
}

export function getSubcategoryLabel(categoryValue?: string, subcategoryValue?: string) {
  if (!subcategoryValue) return "";
  return findSubcategory(categoryValue, subcategoryValue)?.label || subcategoryValue;
}

/**
 * What a visitor can do with this category — "porosi", "rezervim", or both.
 * Unknown categories fall back to ordering, which is the safer default: it never
 * promises an availability slot the business does not keep.
 */
export function getCategoryActions(categoryValue?: string): ListingAction[] {
  return getCategoryByValue(categoryValue)?.actions || ["porosi"];
}

/** Subcategory actions when it overrides its parent, otherwise the category's. */
export function getSubcategoryActions(categoryValue?: string, subcategoryValue?: string): ListingAction[] {
  return findSubcategory(categoryValue, subcategoryValue)?.actions || getCategoryActions(categoryValue);
}

/**
 * Whether this specific listing gets the products/menu catalog and cart →
 * WhatsApp order flow. A category explicitly marked `catalog: true` (Hotele —
 * rooms are still "products") always keeps it; every other category follows the
 * listing's resolved actions — the owner's manual toggle first, category/
 * subcategory default otherwise, same precedence as getListingActions.
 */
export function getListingHasCatalog(listing?: {
  category?: string;
  subcategory?: string;
  actions?: string[] | null;
}): boolean {
  if (getCategoryByValue(listing?.category)?.catalog) return true;
  return getListingActions(listing).includes("porosi");
}

/**
 * Actions for one listing, most specific source first: what the business chose,
 * then its subcategory, then its category. A business that offers both keeps both
 * — the taxonomy only supplies the starting point.
 */
export function getListingActions(listing?: {
  category?: string;
  subcategory?: string;
  actions?: string[] | null;
}): ListingAction[] {
  const chosen = (listing?.actions || []).filter(
    (action): action is ListingAction => action === "porosi" || action === "rezervim"
  );
  if (chosen.length) return Array.from(new Set(chosen));
  return getSubcategoryActions(listing?.category, listing?.subcategory);
}

export function getCategorySearchValues(value: string) {
  const category = getCategoryByValue(value);
  if (!category) return [value];
  return Array.from(new Set([category.value, category.label.toLowerCase(), ...category.aliases]));
}

export function getSubcategorySearchValues(categoryValue: string | undefined, subcategoryValue: string) {
  const category = getCategoryByValue(categoryValue);
  if (!category) return [subcategoryValue];

  const subcategory = findSubcategory(categoryValue, subcategoryValue);
  if (!subcategory) return [subcategoryValue];

  return Array.from(new Set([subcategory.value, subcategory.label.toLowerCase(), ...(subcategory.aliases || [])]));
}

export function getCategoryFormValue(value?: string) {
  return getCategoryByValue(value)?.value || value || "";
}

export function getSubcategoryFormValue(categoryValue?: string, subcategoryValue?: string) {
  if (!subcategoryValue) return "";
  return findSubcategory(categoryValue, subcategoryValue)?.value || subcategoryValue;
}
