"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * A one-line row that scrolls sideways. With a mouse it gets round arrows at the ends,
 * each shown only while there is more to see in that direction (a touch screen just
 * swipes). When `focusKey` changes the picked item (`aria-pressed="true"`) is brought
 * into view, so an option far along the row is never left hidden.
 */
export default function ScrollRail({
  label,
  focusKey,
  railClassName = "",
  children
}: {
  label: string;
  focusKey: string;
  /** Extra classes for the scrolling row itself (e.g. side padding). */
  railClassName?: string;
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const shown = useRef(edges);

  // Only touches state when an arrow really has to appear or go — a setState on every
  // measurement would keep re-rendering the rail.
  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    if (shown.current.left === left && shown.current.right === right) return;
    shown.current = { left, right };
    setEdges({ left, right });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  // Another category (or language) brings other items, so measure again when it changes.
  useEffect(measure, [measure, focusKey, language]);

  useEffect(() => {
    const el = rail.current;
    const picked = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && picked) {
      el.scrollTo({ left: Math.max(0, picked.offsetLeft - (el.clientWidth - picked.clientWidth) / 2), behavior: "smooth" });
    }
  }, [focusKey]);

  const scrollBy = (direction: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow =
    "pointer-events-auto flex h-9 min-h-0 w-9 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-neutral-50";
  const fade = "pointer-events-none absolute bottom-1 top-0 hidden w-20 items-center [@media(hover:hover)]:flex";

  return (
    <div className="relative">
      <div ref={rail} className={`gd-rail relative ${railClassName}`} role="group" aria-label={label}>
        {children}
      </div>
      {edges.left && (
        <div className={`${fade} left-0 justify-start bg-gradient-to-r from-white from-40% to-transparent`}>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={en ? "Scroll left" : "Lëviz majtas"}
            className={arrow}
            style={{ borderColor: "var(--border-medium)" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
      {edges.right && (
        <div className={`${fade} right-0 justify-end bg-gradient-to-l from-white from-40% to-transparent`}>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={en ? "Scroll right" : "Lëviz djathtas"}
            className={arrow}
            style={{ borderColor: "var(--border-medium)" }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
