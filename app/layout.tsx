import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import ChatWidget from "@/components/ChatWidgetLoader";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: {
    default: "GjejDirekt — Gjej biznese pranë teje dhe porosit direkt",
    template: "%s | GjejDirekt"
  },
  description:
    "GjejDirekt është direktoria e bizneseve në Shqipëri: gjej restorante, hotele, shërbime dhe produkte pranë teje dhe porosit ose rezervo direkt në WhatsApp, pa komision.",
  icons: {
    icon: [{ url: "/uploads/iconee.png", type: "image/png" }],
    shortcut: [{ url: "/uploads/iconee.png", type: "image/png" }],
    apple: [{ url: "/uploads/iconee.png", type: "image/png" }]
  }
};

export const viewport = {
  themeColor: "#E11D2E"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={poppins.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <Header />
          {/* The fixed header and the phone tab bar both overlap the page, so the
              document reserves their height at either end — the padding wraps the
              footer too, otherwise the tab bar would sit on top of it. */}
          <div className="pt-[var(--header-height)] pb-[var(--bottom-nav-height)]">
            <main>{children}</main>
            <Footer />
          </div>
          <BottomNav />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
