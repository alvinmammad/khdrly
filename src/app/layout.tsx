import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SosFab from "@/components/layout/SosFab";
import GlobalRadio from "@/components/layout/GlobalRadio";
import { PREFS_BOOT_SCRIPT } from "@/lib/prefs";

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Xıdırlı — kəndimizin rəqəmsal evi",
    template: "%s | Xıdırlı",
  },
  description:
    "Ağdam rayonu Xıdırlı kəndinin rəsmi tətbiqi: hava, xəbərlər, növbətçi məlumatlar, kəndin tarixi, xəritə və bazar.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#B5542D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <head>
        {/* Seçilmiş tema/şrift ilk render-dən əvvəl tətbiq olunur */}
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOT_SCRIPT }} />
      </head>
      <body
        className={`${lora.variable} ${inter.variable} bg-bg font-body text-ink antialiased`}
      >
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 pb-36 pt-4">{children}</main>
        <SosFab />
        <GlobalRadio />
        <BottomNav />
      </body>
    </html>
  );
}
