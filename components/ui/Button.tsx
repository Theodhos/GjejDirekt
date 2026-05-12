import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    primary: "bg-slate-950 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
  }[variant];

  if (href) {
    return (
      <Link href={href} className={cn(base, styles, className)} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
