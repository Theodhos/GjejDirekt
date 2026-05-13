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
    "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    primary: "bg-slate-950 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
  }[variant];

  if (href) {
    const anchorProps = props as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
    return (
      <Link href={href} className={cn(base, styles, className)} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cn(base, styles, className)} {...buttonProps}>
      {children}
    </button>
  );
}
