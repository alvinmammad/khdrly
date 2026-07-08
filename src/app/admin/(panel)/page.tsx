import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "İdarəetmə paneli",
  robots: { index: false, follow: false },
};

async function countRows(table: string): Promise<number> {
  const sb = await getSupabaseServer();
  if (!sb) return 0;
  const { count } = await sb.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const { xeta } = await searchParams;
  const [
    news, events, duty, places, martyrs, products, listings, timeline, media,
    services, routes, stays,
  ] = await Promise.all([
    countRows("news"),
    countRows("events"),
    countRows("duty_info"),
    countRows("places"),
    countRows("martyrs"),
    countRows("products"),
    countRows("listings"),
    countRows("timeline_entries"),
    countRows("media_items"),
    countRows("service_providers"),
    countRows("transport_routes"),
    countRows("stays"),
  ]);

  const tiles = [
    { href: "/admin/xeberler", icon: "📰", label: "Xəbərlər", count: news, ready: true },
    { href: "/admin/tedbirler", icon: "📅", label: "Tədbirlər", count: events, ready: true },
    { href: "/admin/novbetci", icon: "🔔", label: "Növbətçi məlumatlar", count: duty, ready: true },
    { href: "/admin/yerler", icon: "🗺️", label: "Xəritə yerləri", count: places, ready: true },
    { href: "/admin/sehidler", icon: "🕯️", label: "Şəhidlər", count: martyrs, ready: true },
    { href: "/admin/bazar", icon: "🧺", label: "Bazar", count: products, ready: true },
    { href: "/admin/elanlar", icon: "📢", label: "Elanlar", count: listings, ready: true },
    { href: "/admin/tarix", icon: "📜", label: "Tarix xronologiyası", count: timeline, ready: true },
    { href: "/admin/media", icon: "🖼️", label: "Media arxivi", count: media, ready: true },
    { href: "/admin/xidmetler", icon: "🔧", label: "Xidmətlər", count: services, ready: true },
    { href: "/admin/neqliyyat", icon: "🚌", label: "Nəqliyyat", count: routes, ready: true },
    { href: "/admin/turizm", icon: "🏡", label: "Turizm / kirayə", count: stays, ready: true },
  ];

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">İdarəetmə paneli</h1>
      {xeta === "yalniz-admin" && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Şəhidlər bölməsini yalnız admin rolu olan istifadəçilər idarə edə bilər.
        </p>
      )}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <li key={t.label}>
            {t.ready ? (
              <Link
                href={t.href}
                className="block rounded-2xl border border-line bg-surface p-4"
              >
                <span className="text-2xl" aria-hidden>{t.icon}</span>
                <span className="mt-1 block font-bold">{t.label}</span>
                <span className="text-ink-soft">{t.count} yazı</span>
              </Link>
            ) : (
              <div className="rounded-2xl border border-line bg-surface p-4 opacity-60">
                <span className="text-2xl" aria-hidden>{t.icon}</span>
                <span className="mt-1 block font-bold">{t.label}</span>
                <span className="text-ink-soft">{t.count} yazı · tezliklə</span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="text-sm text-ink-soft">
        Dərc olunan dəyişikliklər saytda ən geci 5 dəqiqəyə görünür.
      </p>
    </div>
  );
}
