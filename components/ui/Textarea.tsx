import { cn } from "@/lib/utils";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export default function Textarea({ label, error, className, ...props }: Props) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-sm font-semibold text-slate-900">{label}</span> : null}
      <textarea
        className={cn(
          "min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          error && "border-rose-300",
          className
        )}
        {...props}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}
