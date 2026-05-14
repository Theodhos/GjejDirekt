import { Suspense } from "react";
import HomePageClient from "./page.client";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomePageClient />
    </Suspense>
  );
}
