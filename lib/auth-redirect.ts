"use client";

import { useEffect, useState } from "react";

/** Where an unauthenticated visitor is sent when they try to publish a service. */
export const CREATE_LISTING_REDIRECT = "/create-listing";

/**
 * Only same-origin paths are honoured, so a crafted ?redirect= can never bounce a
 * visitor to another site after they sign in.
 */
export function safeRedirect(value?: string | null, fallback = "") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/** Reads ?redirect= from the current URL. Event handlers only — never during render. */
export function readRedirectParam(fallback = "") {
  if (typeof window === "undefined") return fallback;
  return safeRedirect(new URLSearchParams(window.location.search).get("redirect"), fallback);
}

/**
 * Same value as a hook, for links. It resolves after mount so the markup still matches
 * what the server rendered.
 */
export function useRedirectParam() {
  const [redirect, setRedirect] = useState("");
  useEffect(() => setRedirect(readRedirectParam()), []);
  return redirect;
}

/** "?redirect=/create-listing" — ready to append to /login or /register. */
export function redirectQuery(redirect: string) {
  return redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
}
