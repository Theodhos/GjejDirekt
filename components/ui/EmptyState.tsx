import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Shared "nothing here" panel. An empty list is a dead end unless it says what to
 * do next, so `action` is where the way out goes.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-10 text-center sm:py-14"
      style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)" }}
    >
      {Icon && (
        <span
          className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
        >
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="text-[15px] font-bold sm:text-base" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
