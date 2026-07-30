import React from "react";
import { Briefcase, Calendar, Car, Compass, Home, Mountain, ShoppingBag, UtensilsCrossed } from "lucide-react";

/** Icon per service category — shared by the add/edit listing pages. */
export const categoryIcons: Record<string, React.ReactNode> = {
  akomodim: <Home className="h-7 w-7" />,
  restorante: <UtensilsCrossed className="h-7 w-7" />,
  atraksione: <Compass className="h-7 w-7" />,
  aktivitete: <Mountain className="h-7 w-7" />,
  evente: <Calendar className="h-7 w-7" />,
  "sherbime-turistike": <Briefcase className="h-7 w-7" />,
  "produkte-lokale": <ShoppingBag className="h-7 w-7" />,
  transport: <Car className="h-7 w-7" />
};
