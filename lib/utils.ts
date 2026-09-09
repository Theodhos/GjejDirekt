import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function safeJson<T>(value: T) {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Escapes regex metacharacters so user input can be used inside a $regex query.
 * Without this, a value like "[" builds an invalid pattern and mongoose throws,
 * which surfaces as a 500. Always wrap untrusted input before it reaches $regex.
 */
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True when the value has the shape of a Mongo ObjectId. Check before handing an
 * id to mongoose — a malformed id otherwise throws a CastError instead of simply
 * not matching, turning an expected 404 into a 500.
 */
export function isObjectId(value: unknown): value is string {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}
