import type { Metadata } from "next";
import MoreClient from "./MoreClient";

export const metadata: Metadata = {
  title: "Më shumë",
  description: "Llogaria, paketat, blogu dhe informacione për GjejDirekt."
};

export default function MorePage() {
  return <MoreClient />;
}
