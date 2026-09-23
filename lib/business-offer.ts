import { getCategoryByValue } from "@/lib/constants";

/**
 * What a business lets a visitor add to their order or booking, and what to call it.
 * The business page is one design for every category; only these words change — a
 * restaurant has a menu, a hotel has rooms, a shop has products, and a business that
 * lists its services has services.
 */
export type OfferKind = "menu" | "rooms" | "products" | "services";

type Copy = { sq: string; en: string };

export type OfferCopy = {
  /** Tab name. */
  tab: Copy;
  /** Button on each item before it is in the basket. */
  add: Copy;
  /** Heading of the preview on the Përmbledhje tab. */
  preview: Copy;
  /** Button under that preview. */
  seeAll: Copy;
  emptyTitle: Copy;
  emptyText: Copy;
  /** Prices are per night (rooms). */
  perNight?: boolean;
};

export const OFFER_COPY: Record<OfferKind, OfferCopy> = {
  menu: {
    tab: { sq: "Menu", en: "Menu" },
    add: { sq: "Shto", en: "Add" },
    preview: { sq: "Nga menuja", en: "From the menu" },
    seeAll: { sq: "Shiko të gjithë menunë", en: "See the full menu" },
    emptyTitle: { sq: "Menuja nuk është shtuar ende", en: "The menu hasn't been added yet" },
    emptyText: { sq: "Kontakto biznesin direkt për ushqimet dhe çmimet.", en: "Contact the business directly to ask about dishes and prices." }
  },
  rooms: {
    tab: { sq: "Dhomat", en: "Rooms" },
    add: { sq: "Rezervo", en: "Book" },
    preview: { sq: "Dhomat tona", en: "Our rooms" },
    seeAll: { sq: "Shiko të gjitha dhomat", en: "See all rooms" },
    emptyTitle: { sq: "Dhomat nuk janë shtuar ende", en: "The rooms haven't been added yet" },
    emptyText: { sq: "Kontakto biznesin direkt për disponueshmërinë dhe çmimet.", en: "Contact the business directly for availability and prices." },
    perNight: true
  },
  products: {
    tab: { sq: "Produktet", en: "Products" },
    add: { sq: "Shto", en: "Add" },
    preview: { sq: "Produktet", en: "Products" },
    seeAll: { sq: "Shiko të gjitha produktet", en: "See all products" },
    emptyTitle: { sq: "Produktet nuk janë shtuar ende", en: "The products haven't been added yet" },
    emptyText: { sq: "Kontakto biznesin direkt për produktet dhe çmimet.", en: "Contact the business directly to ask about products and prices." }
  },
  services: {
    tab: { sq: "Shërbimet", en: "Services" },
    add: { sq: "Shto", en: "Add" },
    preview: { sq: "Shërbimet", en: "Services" },
    seeAll: { sq: "Shiko të gjitha shërbimet", en: "See all services" },
    emptyTitle: { sq: "Shërbimet nuk janë shtuar ende", en: "The services haven't been added yet" },
    emptyText: { sq: "Kontakto biznesin direkt për shërbimet dhe çmimet.", en: "Contact the business directly to ask about services and prices." }
  }
};

/** Which words the business page uses for this listing's offer. */
export function getOfferKind(listing: { category?: string }, hasCatalog: boolean): OfferKind {
  const category = getCategoryByValue(listing.category)?.value;
  if (category === "ushqim-pije") return "menu";
  if (category === "hotele") return "rooms";
  return hasCatalog ? "products" : "services";
}
