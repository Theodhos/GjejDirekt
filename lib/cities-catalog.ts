import { albaniaCities } from "@/lib/albania-cities";

export type ManagedCity = {
  value: string;
  label: string;
  region: string;
  description: string;
  image: string;
  country: "Albania" | "North Macedonia";
  villages: string[];
  source?: "seed" | "admin";
};

const albaniaVillageMap: Record<string, string[]> = {
  Tirane: ["Dajt", "Petrele", "Baldushk", "Kashar", "Farke"],
  Durres: ["Spitalle", "Rrashbull", "Shenavlash", "Ishëm", "Sukth"],
  Vlore: ["Orikum", "Radhime", "Dhermi", "Palase", "Tragjas"],
  Sarande: ["Ksamil", "Borsh", "Qeparo", "Lukove", "Shen Vasil"],
  Shkoder: ["Velipoje", "Shiroke", "Theth", "Razem", "Dajç"],
  Korce: ["Dardhe", "Voskopoje", "Mborje", "Zvezde", "Bulgarec"],
  Berat: ["Roshnik", "Duhanas", "Otllak", "Sinje", "Poshnje"],
  Gjirokaster: ["Lazarat", "Libohove", "Antigone", "Asim Zeneli", "Dropull"],
  Elbasan: ["Labinot", "Bradashesh", "Shushice", "Gjinar", "Tregan"],
  Fier: ["Mbrostar", "Levan", "Cakran", "Dermenaz", "Frakull"],
  Lezhe: ["Shengjin", "Kallmet", "Balldre", "Ishull Shëngjin", "Zejen"],
  Pogradec: ["Tushemisht", "Memelisht", "Udënisht", "Buçimas", "Cerrave"],
  Kukes: ["Bicaj", "Shishtavec", "Surroj", "Kolsh", "Shtiqen"],
  Kruje: ["Fushe-Kruje", "Nikël", "Bubq", "Thumane", "Halil"],
  Lushnje: ["Divjake", "Krutje", "Kolonje", "Karbunarë", "Plug"],
  Himare: ["Vuno", "Pilur", "Qeparo", "Kudhes", "Palase"],
  Kavaje: ["Golem", "Synej", "Helmas", "Luz i Vogel", "Rrogozhine"],
  Librazhd: ["Hotolisht", "Qukes", "Stebleve", "Stravaj", "Polis"],
  Gramsh: ["Sotire", "Kuker", "Poroçan", "Kodovjat", "Lenie"],
  Tepelene: ["Memaliaj", "Buz", "Lopës", "Krahës", "Qesarat"]
};

const northMacedoniaCities: ManagedCity[] = [
  { value: "skopje", label: "Skopje", region: "Capital", description: "City stays, tours, and transport connections.", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Gorno Nerezi", "Kuchkovo", "Dolno Sonje", "Brazda", "Saraj"], source: "seed" },
  { value: "tetovo", label: "Tetovo", region: "Polog", description: "Mountain gateway, food, and local culture.", image: "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Shipkovica", "Poroj", "Reçica e Vogel", "Gajre", "Sellce"], source: "seed" },
  { value: "gostivar", label: "Gostivar", region: "Polog", description: "Business and family-friendly services.", image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Negotino", "Forino", "Çegran", "Raven", "Vrapçisht"], source: "seed" },
  { value: "kumanovo", label: "Kumanovo", region: "Northeast", description: "Transit and city services hub.", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Matejce", "Romanovce", "Lopate", "Orizare", "Pçinja"], source: "seed" },
  { value: "bitola", label: "Bitola", region: "Pelagonia", description: "Historic streets and culture-focused travel.", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Bistrica", "Trnovo", "Magarevo", "Capari", "Bratin Dol"], source: "seed" },
  { value: "ohrid", label: "Ohrid", region: "Lake", description: "Lakefront stays and heritage experiences.", image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Pestani", "Trpejca", "Velgoshti", "Kosel", "Leskoec"], source: "seed" },
  { value: "struga", label: "Struga", region: "Lake", description: "Lakeside recreation and summer tourism.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Vevçani", "Radozhda", "Kalishta", "Frangovo", "Labunista"], source: "seed" },
  { value: "prilep", label: "Prilep", region: "Pelagonia", description: "Outdoor adventures and regional trips.", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Varosh", "Topolcani", "Kanatlarci", "Malo Konjari", "Alinci"], source: "seed" },
  { value: "veles", label: "Veles", region: "Central", description: "Transport node and local services.", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Buzalkovo", "Mamutçevo", "Sopot", "Karaslari", "Ivankovci"], source: "seed" },
  { value: "stip", label: "Stip", region: "East", description: "University city with business travel demand.", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80", country: "North Macedonia", villages: ["Karbinci", "Novo Selo", "Tri Cesmi", "Lakavica", "Leskovica"], source: "seed" }
];

export const seedCities: ManagedCity[] = [
  ...albaniaCities.map((city) => ({
    ...city,
    country: "Albania" as const,
    villages: albaniaVillageMap[city.label] || [],
    source: "seed" as const
  })),
  ...northMacedoniaCities
];

export function normalizeCityName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getVillagesForCity(label: string, country: "Albania" | "North Macedonia") {
  const exact = seedCities.find(
    (c) => c.country === country && c.label.toLowerCase() === label.toLowerCase()
  );
  if (exact?.villages?.length) return exact.villages;

  if (country === "Albania") {
    return albaniaVillageMap[label] || [];
  }
  return [];
}

