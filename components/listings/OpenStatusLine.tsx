"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getOpenStatus, type OpenStatus } from "@/lib/listing-display";

/**
 * Open/closed state for a business, worked out on the device rather than at build
 * time — these pages are cached for a minute at a time and the answer changes by
 * the minute. Stays null until mounted so the server HTML and the first client
 * render always agree.
 */
export function useOpenStatus(hours?: string): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(hours));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [hours]);

  return status;
}

/**
 * `Hapur • Mbyllet në 23:00` — in a results row the state word is brand red; on the
 * business page it gets a green dot instead. Renders an empty, fixed-height line
 * while the status is unknown so nothing jumps when it appears.
 */
export default function OpenStatusLine({
  hours,
  variant = "row",
  className = ""
}: {
  hours?: string;
  variant?: "row" | "detail";
  className?: string;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const status = useOpenStatus(hours);

  if (!status || status.kind === "unknown") {
    return <span className={`block min-h-[18px] ${className}`} aria-hidden />;
  }

  const isOpen = status.kind === "open";
  const label = isOpen ? (en ? "Open" : "Hapur") : en ? "Closed" : "Mbyllur";
  const detail =
    status.kind === "open"
      ? status.allDay
        ? en
          ? "24 hours"
          : "24 orë"
        : en
        ? `Closes at ${status.closesAt}`
        : `Mbyllet në ${status.closesAt}`
      : en
      ? `Opens at ${status.opensAt}`
      : `Hapet në ${status.opensAt}`;

  const stateColor = isOpen
    ? variant === "detail"
      ? "#16A34A"
      : "var(--brand-accent)"
    : "var(--text-tertiary)";

  return (
    <span className={`flex min-h-[18px] items-center gap-1.5 ${variant === "detail" ? "text-[12px]" : "text-[12.5px]"} ${className}`}>
      {variant === "detail" && (
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: isOpen ? "#22C55E" : "#9CA3AF" }} />
      )}
      <span className="font-bold" style={{ color: stateColor }}>
        {label}
      </span>
      <span style={{ color: "var(--text-secondary)" }}>
        {variant === "detail" ? "·" : "•"} {detail}
      </span>
    </span>
  );
}
