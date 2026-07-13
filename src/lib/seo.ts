import type { Metadata } from "next";
import { VILLAGE_CENTER } from "@/lib/data/mock";

/*
  SEO köməkçiləri. Məqsəd: "Xıdırlı", "Xıdırlı kəndi", "Xıdırlı Ağdam",
  "Xıdırlı tarixi", "Xıdırlı şəhidləri", "Xıdırlı xəbərləri" kimi
  axtarışlarda saytın ön sıralara çıxması. Hər açar mövzunun öz səhifəsi,
  öz title/description-ı və (dinamiklərdə) JSON-LD strukturu var.
*/

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xidirli.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Xıdırlı kəndi";

export const SITE_DESCRIPTION =
  "Xıdırlı kəndinin (Ağdam rayonu, Qarabağ) rəsmi saytı: kəndin tarixi, " +
  "şəhidlərimiz, son xəbərlər, hava proqnozu, kənd xəritəsi, məşhur Xıdırlı " +
  "qaymağı bazarı və icma bölmələri.";

/** Səhifə üçün title + description + canonical + Open Graph birlikdə. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
}): Metadata {
  const { title, description, path, ogType = "website" } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "az_AZ",
      type: ogType,
    },
  };
}

/** Kəndin özü — schema.org Place (ana səhifədə və yer səhifələrində istinad olunur) */
export const VILLAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Place",
  "@id": `${SITE_URL}#village`,
  name: "Xıdırlı",
  alternateName: ["Xıdırlı kəndi", "Khidirli", "Xıdırlı Ağdam"],
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Xıdırlı",
    addressRegion: "Ağdam rayonu",
    addressCountry: "AZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: VILLAGE_CENTER.lat,
    longitude: VILLAGE_CENTER.lng,
  },
} as const;

/** Saytın özü — schema.org WebSite (yalnız ana səhifədə) */
export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  name: SITE_NAME,
  alternateName: "Xıdırlı — kəndimizin rəqəmsal evi",
  url: SITE_URL,
  inLanguage: "az",
  about: { "@id": `${SITE_URL}#village` },
} as const;
