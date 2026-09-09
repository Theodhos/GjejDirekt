import type { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
  title: "Të preferuara",
  description: "Bizneset që keni ruajtur në GjejDirekt."
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
