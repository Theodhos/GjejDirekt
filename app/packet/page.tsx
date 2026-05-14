import { Suspense } from "react";
import PacketPageClient from "./page.client";

export default function PacketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading packet page...</div>}>
      <PacketPageClient />
    </Suspense>
  );
}
