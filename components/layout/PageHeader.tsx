import { ReactNode } from "react";

/**
 * The white band that opens every non-home page: title, one line of context, and
 * an optional action. Using it everywhere is what keeps the rest of the product
 * looking like the home page instead of a set of unrelated screens.
 */
export default function PageHeader({
  title,
  description,
  action,
  children
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b" style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}>
      <div className="page-shell py-4 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="text-[22px] font-bold sm:text-3xl"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-[13px] sm:text-[15px]" style={{ color: "var(--text-secondary)" }}>
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
      </div>
    </header>
  );
}
