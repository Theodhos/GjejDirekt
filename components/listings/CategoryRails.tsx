"use client";

import { LayoutGrid } from "lucide-react";
import ScrollRail from "@/components/ui/ScrollRail";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryIcon } from "@/lib/category-icons";
import { categories, getCategoryByValue } from "@/lib/constants";

/**
 * The directory's menu: one row of pills with every category ("Të gjitha" first, the
 * picked one filled with its colour), and — once a category is picked — a second row
 * listing that category's own types (Ushqim & Pije → Restorante, Krepa, Fast Food, Pica...).
 * Both scroll sideways with arrows on a mouse. The parent owns the URL, so the buttons only
 * report what was pressed and the banner and the list follow.
 */
export default function CategoryRails({
  category,
  activeSubcategory,
  onCategorySelect,
  onSubcategorySelect
}: {
  category: string;
  activeSubcategory: string;
  onCategorySelect?: (value: string) => void;
  onSubcategorySelect?: (value: string) => void;
}) {
  const { language, t } = useLanguage();
  const en = language === "en";
  const definition = getCategoryByValue(category);
  const names = t.categories.names as Record<string, string>;
  const subLabels = (t.categories.subnames as Record<string, Record<string, string>>)[category] || {};

  const dark = { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" };

  return (
    <div className="space-y-3 pt-4">
      <ScrollRail label={en ? "Category" : "Kategoria"} focusKey={category} railClassName="px-4 lg:px-0">
        <button type="button" aria-pressed={!definition} onClick={() => onCategorySelect?.("")} className="gd-quick-pill" style={!definition ? dark : undefined}>
          <LayoutGrid className="h-4 w-4" />
          {en ? "All" : "Të gjitha"}
        </button>
        {categories.map((item) => {
          const Icon = getCategoryIcon(item.value);
          const active = item.value === definition?.value;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={active}
              onClick={() => onCategorySelect?.(item.value)}
              className="gd-quick-pill"
              style={active ? { background: item.color, color: "#fff", borderColor: item.color } : undefined}
            >
              <Icon className="h-4 w-4" style={{ color: active ? "#fff" : item.color }} />
              {names[item.value] || item.label}
            </button>
          );
        })}
      </ScrollRail>

      {definition && definition.subcategories.length > 0 && (
        <ScrollRail label={en ? "Type" : "Lloji"} focusKey={`${category}/${activeSubcategory}`} railClassName="px-4 lg:px-0">
          {[{ value: "", label: en ? "All" : "Të gjitha" }, ...definition.subcategories.map((sub) => ({ value: sub.value, label: subLabels[sub.value] || sub.label }))].map((sub) => {
            const active = sub.value === activeSubcategory;
            return (
              <button
                key={sub.value || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => onSubcategorySelect?.(sub.value)}
                className="gd-quick-pill"
                style={active ? dark : undefined}
              >
                {sub.label}
              </button>
            );
          })}
        </ScrollRail>
      )}
    </div>
  );
}
