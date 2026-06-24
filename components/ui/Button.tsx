import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type AnchorButtonProps = {
  href: string;
  variant?: ButtonVariant;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type NativeButtonProps = {
  href?: undefined;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = AnchorButtonProps | NativeButtonProps;

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95";

  const styles: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "bg-transparent text-[var(--brand-accent)] border border-[var(--border-medium)] hover:border-[var(--brand-accent)] shadow-sm",
    ghost: "bg-transparent hover:bg-[var(--surface-subtle)] text-[var(--text-primary)] focus:ring-[var(--border-medium)]",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus:ring-rose-200"
  };

  // No inline styles needed for minimalist unified design
  const inlineStyle: React.CSSProperties = {};

  if (href) {
    const anchorProps = props as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
    return (
      <Link href={href} className={cn(base, styles[variant], className)} style={inlineStyle} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cn(base, styles[variant], className)} style={inlineStyle} {...buttonProps}>
      {children}
    </button>
  );
}
