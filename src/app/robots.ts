import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Şəxsi/xidməti səhifələr indekslənmir
        disallow: [
          "/admin",
          "/api/",
          "/auth/",
          "/giris",
          "/profil",
          "/sifarislerim",
          "/al-ver/menimkiler",
          "/parametrler",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
