import { CalendarDays, Home, Image as ImageIcon, MapPin, Package, Star } from "lucide-react";

export default function ListingUniversalNav({
  isHotel,
  hasCatalog,
  hasReservation,
  externalMapUrl
}: {
  isHotel: boolean;
  hasCatalog: boolean;
  hasReservation: boolean;
  externalMapUrl: string;
}) {
  const actionLabel = hasReservation ? "Rezervimi" : hasCatalog ? "Porosia" : "Kontakti";
  const actionHref = hasCatalog ? "#primary" : "#contact";
  const items = [
    { label: "Kreu", href: "#overview", icon: Home },
    { label: isHotel ? "Dhomat" : hasCatalog ? "Produktet" : "Shërbimet", href: "#primary", icon: hasCatalog ? Package : CalendarDays },
    { label: "Galeria", href: "#gallery", icon: ImageIcon },
    { label: actionLabel, href: actionHref, icon: CalendarDays },
    { label: "Vendndodhja", href: externalMapUrl, icon: MapPin, external: true },
    { label: "Vlerësime", href: "#business-details", icon: Star }
  ];

  return (
    <nav className="sticky top-[56px] z-20 border-y bg-white/95 backdrop-blur-md" style={{ borderColor: "var(--border-soft)" }} aria-label="Navigimi i listing-ut">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between overflow-x-auto px-3 sm:px-6 lg:px-8">
        {items.map(({ label, href, icon: Icon, external }) => (
          <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="flex min-w-[78px] flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand-accent)]">
            <Icon className="h-4 w-4" />
            <span className="truncate">{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
