"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * One-line text with a "See more" toggle — catalog cards site-wide show the item's
 * description collapsed to a single line until the visitor expands it.
 */
export default function ExpandableText({
  text,
  className = "",
  style
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  // Only text the single line actually cuts off earns the toggle.
  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <span className="block min-w-0">
      <p ref={ref} className={`${expanded ? "" : "line-clamp-1"} ${className}`} style={style}>
        {text}
      </p>
      {(clamped || expanded) && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
          className="mt-0.5 text-[11px] font-semibold underline underline-offset-2"
          style={{ color: "var(--brand-accent)" }}
        >
          {expanded ? (en ? "See less" : "Më pak") : en ? "See more" : "Shiko më shumë"}
        </button>
      )}
    </span>
  );
}
