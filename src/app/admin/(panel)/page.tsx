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

export default async function AdminHomePage() {
  const [news, events, duty, places, martyrs] = await Promise.all([
    countRows("news"),
    countRows("events"),
    countRows("duty_info"),
    countRows("places"),
    countRows("martyrs"),
  ]);

  const tiles = [
    { href: "/admin/xeberler", icon: "📰", label: "Xəbərlər", count: news, ready: true },
    { href: "/admin/tedbirler", icon: "📅", label: "Tədbirlər", count: events, ready: true },
    { href: "/admin/novbetci", icon: "🔔", label: "Növbətçi məlumatlar", count: duty, ready: true },
    { href: "/admin/yerler", icon: "🗺️", label: "Xəritə yerləri", count: places, ready: true },
    { href: "#", icon: "🕯️", label: "Şəhidlər", count: martyrs, ready: false },
  ];

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">İdarəetmə paneli</h1>
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
