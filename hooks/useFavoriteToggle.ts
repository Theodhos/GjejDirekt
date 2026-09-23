"use client";

import toast from "react-hot-toast";
import useFavorites from "@/hooks/useFavorites";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Save / unsave one listing. Reads the shared favorites cache (so a page with
 * several hearts still makes one request) and refreshes it after a change.
 */
export default function useFavoriteToggle(listingId?: string) {
  const { language } = useLanguage();
  const { isFavorited, refresh } = useFavorites();
  const en = language === "en";

  async function toggle() {
    if (!listingId) return;
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId })
      });
      const data = await response.json();

      if (response.status === 401) {
        toast.error(en ? "You must be logged in to save favorites!" : "Duhet të identifikoheni për të shtuar në të preferuarat!");
        return;
      }
      if (!response.ok) {
        toast.error(data.error || "Could not update favorites");
        return;
      }

      await refresh();
      toast.success(
        data.favorited
          ? en ? "Saved to favorites" : "U ruajt te të preferuarat"
          : en ? "Removed from favorites" : "U hoq nga të preferuarat"
      );
    } catch {
      toast.error("Network error");
    }
  }

  return { favorited: isFavorited(listingId), toggle };
}
