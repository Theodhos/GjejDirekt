import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: {
    default: "Tourism Platform",
    template: "%s | Tourism Platform"
  },
  description: "A premium tourism marketplace for experiences, stays, transport, and travel stories."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={poppins.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <Header />
          <main className="pt-[var(--header-height)]">{children}</main>
          <Footer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
