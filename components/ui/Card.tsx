import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("travel-card", className)} {...props}>{children}</div>;
}
