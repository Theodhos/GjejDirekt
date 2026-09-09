"use client";

import Link from "next/link";
import {
  ShoppingBag,
  UtensilsCrossed,
  Bed,
  Scissors,
  HeartPulse,
  Car,
  Building2,
  Wrench,
  Plane,
  LayoutGrid
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Saktësisht 10 kategori si në foton e dizajnit:
 * Rreshti 1: Shopping, Restorante, Hotele, Bukuri, Shëndet
 * Rreshti 2: Auto, Imobiliare, Shërbime, Turizëm, Të gjitha
 */
const HOME_CATEGORIES = [
  { value: "shopping",        labelSq: "Shopping",    labelEn: "Shopping",    icon: ShoppingBag,     color: "var(--cat-shopping)",       href: "/categories/shopping" },
  { value: "ushqim-pije",     labelSq: "Restorante",  labelEn: "Restaurants", icon: UtensilsCrossed, color: "var(--cat-ushqim-pije)",     href: "/categories/ushqim-pije" },
  { value: "hotele",          labelSq: "Hotele",      labelEn: "Hotels",      icon: Bed,             color: "var(--cat-hotele)",         href: "/categories/hotele" },
  { value: "bukuri",          labelSq: "Bukuri",      labelEn: "Beauty",      icon: Scissors,        color: "var(--cat-bukuri)",         href: "/categories/bukuri" },
  { value: "shendet",         labelSq: "Shëndet",     labelEn: "Health",      icon: HeartPulse,      color: "var(--cat-shendet)",        href: "/categories/shendet" },
  { value: "auto",            labelSq: "Auto",        labelEn: "Auto",        icon: Car,             color: "var(--cat-auto)",           href: "/categories/auto" },
  { value: "shtepi-ndertim",  labelSq: "Imobiliare",  labelEn: "Real Estate", icon: Building2,       color: "var(--cat-shtepi-ndertim)", href: "/categories/shtepi-ndertim" },
  { value: "sherbime-shtepi", labelSq: "Shërbime",    labelEn: "Services",    icon: Wrench,          color: "var(--cat-sherbime-shtepi)", href: "/categories/sherbime-shtepi" },
  { value: "turizem",         labelSq: "Turizëm",     labelEn: "Tourism",     icon: Plane,           color: "var(--cat-turizem)",        href: "/categories/turizem" }
];

export default function CategoryGrid() {
  const { language } = useLanguage();

  return (
    <nav aria-label={language === "en" ? "Categories" : "Kategoritë"}>
      <ul className="grid grid-cols-5 gap-x-1 gap-y-4 sm:gap-x-3 sm:gap-y-5">
        {HOME_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <li key={cat.value}>
              <Link href={cat.href} className="gd-cat-link flex flex-col items-center gap-1.5">
                <span className="gd-cat-tile" style={{ background: cat.color }}>
                  <Icon className="h-[22px] w-[22px] sm:h-6 sm:w-6" strokeWidth={2} />
                </span>
                <span
                  className="w-full text-center text-[10.5px] font-medium leading-tight sm:text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {language === "en" ? cat.labelEn : cat.labelSq}
                </span>
              </Link>
            </li>
          );
        })}

        {/* "Të gjitha" — lidhja me të gjitha bizneset */}
        <li>
          <Link href="/listings" className="gd-cat-link flex flex-col items-center gap-1.5">
            <span className="gd-cat-tile" style={{ background: "var(--cat-all)" }}>
              <LayoutGrid className="h-[22px] w-[22px] sm:h-6 sm:w-6" strokeWidth={2} />
            </span>
            <span
              className="w-full text-center text-[10.5px] font-medium leading-tight sm:text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {language === "en" ? "All" : "Të gjitha"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
