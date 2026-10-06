/** "Bujtina Sophia" → "BS" — the first letters of the first two words. */
export function businessInitials(name?: string | null) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "?";
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
}

/**
 * What a business without a profile photo shows instead: its initials on the brand
 * tint. Fills its parent, so the parent decides the shape (a circle for the logo,
 * the photo frame on a card).
 */
export default function InitialsAvatar({ name, className = "" }: { name?: string | null; className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex h-full w-full select-none items-center justify-center font-bold tracking-wide ${className}`}
      style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
    >
      {businessInitials(name)}
    </span>
  );
}
