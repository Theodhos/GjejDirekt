"use client";

import { useState } from "react";
import { CalendarDays, Home, Image as ImageIcon, MapPin, Package, Star } from "lucide-react";

/** Every section a tab can isolate. "Kreu" is the reset state that shows all of them. */
const MANAGED_SECTION_IDS = ["reviews", "primary", "gallery", "location", "overview"] as const;

export default function ListingUniversalNav({
  isHotel,
  hasCatalog,
  hasReservation
}: {
  isHotel: boolean;
  hasCatalog: boolean;
  hasReservation: boolean;
}) {
  const [activeTab, setActiveTab] = useState("kreu");

  const actionLabel = hasReservation ? "Rezervimi" : hasCatalog ? "Porosia" : "Kontakti";
  const actionTarget = hasCatalog ? "primary" : "contact";
  const items = [
    { key: "kreu", label: "Kreu", target: "overview", icon: Home },
    { key: "produktet", label: isHotel ? "Dhomat" : hasCatalog ? "Produktet" : "Shërbimet", target: "primary", icon: hasCatalog ? Package : CalendarDays },
    { key: "galeria", label: "Galeria", target: "gallery", icon: ImageIcon },
    { key: "porosia", label: actionLabel, target: actionTarget, icon: CalendarDays },
    { key: "vendodhja", label: "Vendndodhja", target: "location", icon: MapPin },
    { key: "vleresime", label: "Vlerësime", target: "reviews", icon: Star }
  ];

  const showTab = (key: string, target: string) => {
    setActiveTab(key);

    // "Kreu" and the sidebar-only "Kontakti" fallback aren't isolated sections —
    // everything else stays visible and we just scroll to them.
    const isolate = key !== "kreu" && MANAGED_SECTION_IDS.includes(target as typeof MANAGED_SECTION_IDS[number]);
    for (const id of MANAGED_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) el.style.display = isolate && id !== target ? "none" : "";
    }

    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-[56px] z-20 border-y bg-white/95 backdrop-blur-md" style={{ borderColor: "var(--border-soft)" }} aria-label="Navigimi i listing-ut">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between overflow-x-auto px-3 sm:px-6 lg:px-8">
        {items.map(({ key, label, target, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => showTab(key, target)}
            className="flex min-w-[78px] flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors"
            style={{ color: activeTab === key ? "var(--brand-accent)" : "var(--text-tertiary)" }}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{label}</span>
            <span
              className="mt-0.5 h-0.5 w-6 rounded-full transition-opacity"
              style={{ background: "var(--brand-accent)", opacity: activeTab === key ? 1 : 0 }}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
