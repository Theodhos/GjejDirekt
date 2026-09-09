import { MapPin } from "lucide-react";

/**
 * GjejDirekt wordmark: red pin + "Gjej" in ink and "Direkt" in brand red.
 * Drawn rather than shipped as an image so it stays crisp at every size and
 * can be recoloured for dark surfaces via `tone`.
 */
export default function Logo({
  className = "",
  tone = "dark"
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={`inline-flex items-center gap-1 leading-none ${className}`}>
      <MapPin
        className="h-[1.1em] w-[1.1em] shrink-0"
        style={{ color: "var(--brand-accent)" }}
        fill="var(--brand-accent)"
        strokeWidth={0}
      />
      <span className="font-bold tracking-[-0.02em]">
        <span style={{ color: tone === "light" ? "#FFFFFF" : "var(--text-primary)" }}>Gjej</span>
        <span style={{ color: "var(--brand-accent)" }}>Direkt</span>
      </span>
    </span>
  );
}
