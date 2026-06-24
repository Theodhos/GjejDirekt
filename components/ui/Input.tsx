import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, className, ...props }: Props) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-medium outline-none transition-all duration-150",
          "placeholder:font-normal",
          error && "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
          className
        )}
        style={{
          borderColor: error ? undefined : "var(--border-medium)",
          color: "var(--text-primary)"
        }}
        onFocus={e => {
          if (!error) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-accent)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px var(--brand-ring)";
          }
        }}
        onBlur={e => {
          if (!error) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }
        }}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600">{error}</p>
      )}
    </label>
  );
}
