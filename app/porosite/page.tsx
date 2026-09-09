import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "Porositë",
  description: "Bizneset që ke kontaktuar për të porositur në GjejDirekt."
};

export default function OrdersPage() {
  return <OrdersClient />;
}
