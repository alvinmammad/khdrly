import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SosFab from "@/components/layout/SosFab";
import GlobalRadio from "@/components/layout/GlobalRadio";
import Footer from "@/components/layout/Footer";
import { PREFS_BOOT_SCRIPT } from "@/lib/prefs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { getRadioItems } from "@/lib/data";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Xıdırlı kəndi — Ağdam rayonu | Rəsmi sayt",
    template: "%s | Xıdırlı kəndi",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Xıdırlı",
    "Xıdırlı kəndi",
    "Xıdırlı Ağdam",
    "Xıdırlı tarixi",
    "Xıdırlı şəhidləri",
    "Xıdırlı xəbərləri",
    "Xıdırlı qaymağı",
    "Ağdam rayonu kəndləri",
    "Qarabağ",
    "Böyük Qayıdış",
  ],
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  // Qeyd: canonical hər səhifədə ayrıca verilir (pageMetadata helper-i ilə) —
  // layout-da verilsə bütün alt səhifələrə miras keçib hamısını "/" göstərərdi
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "/",
    siteName: SITE_NAME,
    title: "Xıdırlı kəndi — Ağdam rayonu",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Xıdırlı kəndi — Ağdam rayonu",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Google Search Console təsdiqi — dəyəri .env-ə yazın (bax: .env.example)
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#B5542D",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Radio stansiyaları server tərəfdə oxunur — brauzerə supabase-js getmir,
  // hər səhifə açılışında əlavə sorğu olmur
  const radioStations = (await getRadioItems())
    .filter((r) => r.kind === "stream")
    .map((r) => ({ id: r.id, title: r.title, url: r.url }));

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
        <main className="mx-auto w-full max-w-3xl px-4 pb-8 pt-4">{children}</main>
        <div className="pb-28">
          <Footer />
        </div>
        <SosFab />
        <GlobalRadio stations={radioStations} />
        <BottomNav />
      </body>
    </html>
  );
}
