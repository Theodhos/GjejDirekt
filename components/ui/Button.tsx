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
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm focus:ring-neutral-300",
    secondary: "text-white hover:opacity-90 shadow-sm focus:ring-brand-300",
    ghost: "bg-transparent hover:bg-[var(--surface-subtle)] focus:ring-neutral-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus:ring-rose-200"
  };

  // Apply brand color inline for secondary since CSS vars aren't in Tailwind
  const inlineStyle: React.CSSProperties =
    variant === "secondary"
      ? { background: "var(--brand-accent)" }
      : variant === "ghost"
      ? { color: "var(--text-primary)" }
      : {};

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
