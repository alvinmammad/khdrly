import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaceBySlug } from "@/lib/data";
import { PLACE_META } from "@/lib/placeMeta";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, SITE_URL } from "@/lib/seo";

// "Xıdırlı məktəbi", "Xıdırlı məscidi" kimi axtarışların düşdüyü səhifələr —
// hər yerin öz title/description-ı və schema.org Place strukturu var
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return { title: "Yer" };
  const meta = PLACE_META[place.type];
  return pageMetadata({
    title: `${place.name} — Xıdırlı kəndi, Ağdam`,
    description:
      place.body ??
      `${place.name} (${meta.label.toLowerCase()}) Xıdırlı kəndində, Ağdam rayonunda yerləşir. Yerin tarixçəsi, xəritədə mövqeyi və kənd haqqında məlumat.`,
    path: `/yer/${place.slug}`,
  });
}

export const revalidate = 300;

/*
  Fiziki QR lövhələr bura yönləndirir (/q/[slug] → /yer/[slug]).
  Ziyarətçi kənddə lövhəni skan edib yerin qısa tarixçəsini oxuyur.
*/
export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const meta = PLACE_META[place.type];

  return (
    <div className="space-y-5">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: place.name,
          url: `${SITE_URL}/yer/${place.slug}`,
          ...(place.body ? { description: place.body } : {}),
          ...(place.lat && place.lng
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: place.lat,
                  longitude: place.lng,
                },
              }
            : {}),
          containedInPlace: { "@id": `${SITE_URL}#village` },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Xıdırlı",
            addressRegion: "Ağdam rayonu",
            addressCountry: "AZ",
          },
        }}
      />
      <header className="text-center">
        <p className="text-6xl" aria-hidden>{meta.icon}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">{place.name}</h1>
        <p className="mt-1 text-ink-soft">{meta.label} · Xıdırlı kəndi</p>
      </header>

      {place.body && (
        <p className="rounded-2xl border border-line bg-surface p-5 text-lg leading-relaxed">
          {place.body}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/xerite"
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-line bg-surface font-bold active:bg-surface-2"
        >
          🗺️ Kənd xəritəsində bax
        </Link>
        <Link
          href="/haqqinda"
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-line bg-surface font-bold active:bg-surface-2"
        >
          🏡 Kəndimiz haqqında
        </Link>
      </div>

      <div className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-4 text-center">
        <p className="font-bold">Xıdırlıya xoş gəlmisiniz! 👋</p>
        <p className="mt-1 text-ink-soft">
          Kəndin xəbərləri, bazarı və tarixi — hamısı bu tətbiqdədir.
        </p>
      </div>

      <Link
        href="/qonaq-kitabi"
        className="block rounded-2xl border border-line bg-surface p-4 text-center font-bold active:bg-surface-2"
      >
        📖 Qonaq kitabına təəssürat yazın →
      </Link>
    </div>
  );
}
