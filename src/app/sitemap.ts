import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getMartyrs, getNews, getPlaces, getProducts } from "@/lib/data";

// Yeni xəbər/məhsul/yer əlavə olunanda sitemap da yenilənsin
export const revalidate = 3600;

const abs = (path: string) => `${SITE_URL}${path}`;

// Statik səhifələr: [yol, prioritet, dəyişmə tezliyi]
const STATIC_ROUTES: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
  ["/", 1.0, "daily"],
  ["/haqqinda", 0.9, "monthly"],
  ["/haqqinda/tarix", 0.9, "monthly"],
  ["/sehidler", 0.9, "weekly"],
  ["/xeberler", 0.9, "daily"],
  ["/haqqinda/brend", 0.8, "monthly"],
  ["/bazar", 0.8, "daily"],
  ["/xerite", 0.8, "monthly"],
  ["/haqqinda/isgal-dovru", 0.8, "monthly"],
  ["/haqqinda/azadliq", 0.8, "monthly"],
  ["/haqqinda/kohne-sekiller", 0.7, "weekly"],
  ["/haqqinda/meshurlar", 0.7, "monthly"],
  ["/haqqinda/usaqlar-ucun", 0.6, "monthly"],
  ["/haqqinda/secere", 0.6, "monthly"],
  ["/haqqinda/sesli-tarix", 0.6, "monthly"],
  ["/haqqinda/xatire-xeritesi", 0.6, "weekly"],
  ["/hava", 0.7, "daily"],
  ["/tedbirler", 0.7, "weekly"],
  ["/novbetci", 0.6, "daily"],
  ["/elanlar", 0.6, "daily"],
  ["/al-ver", 0.6, "daily"],
  ["/xidmetler", 0.6, "weekly"],
  ["/neqliyyat", 0.6, "weekly"],
  ["/turizm", 0.6, "weekly"],
  ["/ianeler", 0.5, "weekly"],
  ["/teqvim", 0.5, "monthly"],
  ["/radio", 0.5, "monthly"],
  ["/forum", 0.5, "daily"],
  ["/sorgular", 0.4, "weekly"],
  ["/problemler", 0.4, "weekly"],
  ["/qonaq-kitabi", 0.4, "weekly"],
  ["/komek", 0.4, "monthly"],
  ["/bolmeler", 0.4, "monthly"],
  ["/sos", 0.3, "yearly"],
  ["/gizlilik", 0.2, "yearly"],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ([path, priority, changeFrequency]) => ({
      url: abs(path),
      priority,
      changeFrequency,
    })
  );

  // Dinamik səhifələr — data qatı xəta verərsə sitemap statiklərlə qalır
  try {
    const [news, places, products, martyrs] = await Promise.all([
      getNews(),
      getPlaces(),
      getProducts(),
      getMartyrs(),
    ]);

    for (const n of news) {
      entries.push({
        url: abs(`/xeberler/${n.id}`),
        lastModified: new Date(n.publishedAt),
        priority: 0.7,
        changeFrequency: "monthly",
      });
    }
    // "Xıdırlı məktəbi", "Xıdırlı məscidi" kimi axtarışlar bu səhifələrə düşür
    for (const p of places) {
      entries.push({
        url: abs(`/yer/${p.slug}`),
        priority: 0.7,
        changeFrequency: "monthly",
      });
    }
    for (const p of products) {
      entries.push({
        url: abs(`/bazar/mehsul/${p.id}`),
        priority: 0.6,
        changeFrequency: "weekly",
      });
    }
    for (const m of martyrs) {
      if (!m.isSample) {
        entries.push({
          url: abs(`/sehidler/${m.id}`),
          priority: 0.7,
          changeFrequency: "monthly",
        });
      }
    }
  } catch {
    // dinamik hissə əlçatmazdırsa, statik siyahı kifayətdir
  }

  return entries;
}
