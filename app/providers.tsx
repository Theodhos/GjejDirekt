"use client";

import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <Toaster position="top-right" />
    </LanguageProvider>
  );
}
