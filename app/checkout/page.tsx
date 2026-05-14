import { Suspense } from "react";
import CheckoutPageClient from "./page.client";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
