import fs from "node:fs";
import crypto from "node:crypto";
import mongoose from "mongoose";

const envText = fs.readFileSync(".env.local", "utf8");
for (const line of envText.split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
}

const categories = [
  ["ushqim-pije", "Ushqim & Pije", ["Restorante", "Fast Food", "Pica", "Kafene", "Pastiçeri"] , "🍽️"],
  ["hotele", "Hotele & Akomodim", ["Hotele", "Bujtina", "Apartamente", "Vila", "Camping"], "🏨"],
  ["shopping", "Shopping", ["Veshje", "Këpucë", "Bizhuteri", "Kozmetikë", "Elektronikë"], "🛍️"],
  ["supermarkete", "Supermarkete", ["Supermarkete", "Minimarkete", "Produkte Ushqimore", "Produkte Bio", "Pije"], "🛒"],
  ["bukuri", "Bukuri & Wellness", ["Parukeri", "Berber", "SPA", "Estetikë", "Masazh"], "💆"],
  ["shendet", "Shëndet", ["Klinika", "Dentistë", "Laboratorë", "Fizioterapi", "Okulistë"], "🩺"],
  ["auto", "Automjete", ["Rent a Car", "Servis", "Lavazh", "Gomisteri", "Auto Salon"], "🚗"],
  ["shtepi-ndertim", "Shtëpi & Ndërtim", ["Mobilim", "Elektroshtepiake", "Materiale Ndërtimi", "Kuzhina", "Dyer & Dritare"], "🏠"],
  ["sherbime-shtepi", "Shërbime për Shtëpinë", ["Hidraulik", "Elektricist", "Bojaxhi", "Pastrim", "Kondicionerë"], "🔧"],
  ["sherbime-profesionale", "Shërbime Profesionale", ["Avokat", "Noter", "Kontabilist", "Marketing", "IT"], "👨‍💼"],
  ["evente", "Evente & Dasma", ["Salla Eventesh", "Fotograf", "Videograf", "DJ", "Dekor"], "🎉"],
  ["turizem", "Turizëm & Aktivitete", ["Agjenci Turistike", "Guida", "Ture", "Aktivitete", "Sporte Aventurë"], "✈️"],
  ["arsim", "Arsim & Trajnime", ["Kurse", "Gjuhë të Huaja", "Trajnime", "Mësim Privat", "Akademi"], "🎓"],
  ["sport-fitness", "Sport & Fitness", ["Palestër", "Yoga", "Pilates", "Pishinë", "Tenis"], "🏋️"],
  ["kafshe", "Kafshë Shtëpiake", ["Pet Shop", "Veteriner", "Grooming", "Pet Shop", "Veteriner"], "🐶"],
  ["biznese-industri", "Biznese & Industri", ["Materiale Ndërtimi", "Pajisje Profesionale", "Prodhues", "Shitje me Shumicë", "Makineri"], "🏭"]
];

const names = [
  ["Sofra Shqiptare", "Buka & Shija", "Tavolina Jonë", "Kuzhina Qytetare", "Pjatë e Artë"],
  ["Vila Dardha", "Hotel Panorama", "Bujtina e Malit", "Apartamente Lura", "Camping Drini"],
  ["Style House", "Urban Look", "Moda Center", "Elegance Store", "Tech Point"],
  ["Market Plus", "Familja Market", "Bio Corner", "Fresh Basket", "City Supermarket"],
  ["Studio Elegance", "Beauty Line", "Relax Spa", "Glow Center", "Gentlemen Barber"],
  ["Medika Center", "Klinika Vita", "Smile Dental", "Lab Plus", "Fizio Care"],
  ["Auto Rent Albania", "Servis Pro", "Lavazh Express", "Goma Center", "Auto Premium"],
  ["Home Design", "Electro House", "Build Market", "Kuzhina Moderna", "Dyer Elite"],
  ["Usta Hidraulik", "Elektrik Pro", "Color Home", "Clean House", "Klima Expert"],
  ["Studio Ligjore Alba", "Noter Center", "Financa Plus", "Digital Growth", "Code Studio"],
  ["Event Palace", "Foto Moment", "Vision Films", "DJ Celebration", "Decor Art"],
  ["Albania Travel", "Guide Korça", "Explore Albania", "Adventure Point", "Mountain Tours"],
  ["Academy Plus", "Lingua Center", "Pro Training", "Tutor House", "Future School"],
  ["Fit Zone", "Yoga Life", "Pilates Studio", "Blue Pool", "Tennis Club"],
  ["Pet World", "Vet Care", "Happy Paws", "Animal House", "Pet Friends"],
  ["Industrial Hub", "Pro Equipment", "Alba Factory", "Wholesale Center", "Machine Works"]
];

const images = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
];

const listingSchema = new mongoose.Schema({}, { strict: false });
const userSchema = new mongoose.Schema({}, { strict: false });
const Listing = mongoose.models.DemoListing || mongoose.model("DemoListing", listingSchema, "listings");
const User = mongoose.models.DemoUser || mongoose.model("DemoUser", userSchema, "users");

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in .env.local");
await mongoose.connect(process.env.MONGODB_URI);

let owner = await User.findOne({ email: "demo@gjejdirekt.com" });
if (!owner) {
  owner = await User.create({
    name: "GjejDirekt Demo",
    email: "demo@gjejdirekt.com",
    password: crypto.randomBytes(32).toString("hex"),
    phone: "+355691000000",
    role: "admin",
    favorites: []
  });
}

let created = 0;
for (let c = 0; c < categories.length; c += 1) {
  const [value, label, subcategories, emoji] = categories[c];
  for (let i = 0; i < 5; i += 1) {
    const title = names[c][i];
    const slug = `demo-${value}-${i + 1}`;
    await Listing.updateOne(
      { slug },
      { $set: {
        owner: owner._id, title, slug,
        description: `${emoji} ${title} ofron shërbim cilësor dhe përvojë të besueshme në ${label.toLowerCase()}. Kontakto direkt për informacion dhe ofertë.`,
        category: value, subcategory: subcategories[i],
        actions: ["ushqim-pije", "shopping", "supermarkete", "shtepi-ndertim", "kafshe"].includes(value) ? ["porosi"] : ["rezervim"],
        location: ["Tiranë", "Durrës", "Korçë", "Shkodër", "Vlorë"][i], country: "Shqipëri",
        address: `Rruga kryesore, ${["Tiranë", "Durrës", "Korçë", "Shkodër", "Vlorë"][i]}`,
        bannerImage: images[c % images.length], photos: images, images,
        price: 1500 + c * 250 + i * 300, priceFrom: 1500 + c * 250,
        currency: "Lekë", contactInfo: { phone: "+355691000000", email: "demo@gjejdirekt.com" },
        whatsapp: "+355691000000", tags: ["I verifikuar", "Kontakt direkt", "Shërbim cilësor"],
        amenities: ["Wi-Fi", "Rezervim online", "Mbështetje direkte"], ratingAverage: 4.6 + (i % 4) / 10,
        reviewCount: 24 + i * 17, businessHours: "Hapur çdo ditë 08:00–22:00",
        status: "approved", verified: true, featured: i === 0, seedSource: "demo-v1"
      } },
      { upsert: true }
    );
    created += 1;
  }
}

console.log(`Seeded ${created} demo listings across ${categories.length} categories.`);
await mongoose.disconnect();
