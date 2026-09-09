import React from "react";
import {
  Bed,
  Briefcase,
  Building2,
  Car,
  Dumbbell,
  Factory,
  GraduationCap,
  Hammer,
  HeartPulse,
  Home,
  LayoutGrid,
  type LucideIcon,
  PartyPopper,
  PawPrint,
  Plane,
  Scissors,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
  Wrench
} from "lucide-react";

/**
 * One icon per top-level category. `categoryIconComponents` is the source of
 * truth — the home grid needs the component so it can size it itself, while the
 * listing forms keep consuming ready-made nodes through `categoryIcons`.
 */
export const categoryIconComponents: Record<string, LucideIcon> = {
  "ushqim-pije": UtensilsCrossed,
  hotele: Bed,
  shopping: ShoppingBag,
  supermarkete: ShoppingCart,
  bukuri: Scissors,
  shendet: HeartPulse,
  auto: Car,
  "shtepi-ndertim": Hammer,
  "sherbime-shtepi": Wrench,
  "sherbime-profesionale": Briefcase,
  evente: PartyPopper,
  turizem: Plane,
  arsim: GraduationCap,
  "sport-fitness": Dumbbell,
  kafshe: PawPrint,
  "biznese-industri": Factory
};

/**
 * Fallbacks for values still stored on older listings — both the original
 * tourism-directory ones and the nine category names that preceded this taxonomy.
 */
const legacyIcons: Record<string, LucideIcon> = {
  akomodim: Bed,
  atraksione: Plane,
  aktivitete: Plane,
  transport: Car,
  "produkte-lokale": ShoppingCart,
  "sherbime-turistike": Wrench,
  restorante: UtensilsCrossed,
  imobiliare: Building2,
  sherbime: Wrench
};

export function getCategoryIcon(value?: string): LucideIcon {
  if (!value) return Home;
  const key = value.toLowerCase();
  return categoryIconComponents[key] || legacyIcons[key] || LayoutGrid;
}

/** Icon per service category — shared by the add/edit listing pages. */
export const categoryIcons: Record<string, React.ReactNode> = Object.fromEntries(
  Object.entries({ ...legacyIcons, ...categoryIconComponents }).map(([value, Icon]) => [
    value,
    <Icon key={value} className="h-7 w-7" />
  ])
);
