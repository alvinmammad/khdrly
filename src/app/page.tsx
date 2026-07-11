import Link from "next/link";
import { Suspense } from "react";
import Tile from "@/components/ui/Tile";
import DutyBanner from "@/components/home/DutyBanner";
import OnThisDay from "@/components/home/OnThisDay";
import PrayerTimes from "@/components/home/PrayerTimes";
import { getNews, getUpcomingEvents } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/format";

// Supabase-dəki yeniliklər build olmadan görünsün (ISR)
export const revalidate = 300;

export default async function HomePage() {
  const [news, events] = await Promise.all([getNews(), getUpcomingEvents()]);
  const today = new Intl.DateTimeFormat("az-Latn-AZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="space-y-6">
      <p className="text-ink-soft">
        <span className="font-heading text-xl font-bold text-ink">Xoş gəlmisiniz!</span>{" "}
        · {today}
      </p>

      <Suspense>
        <DutyBanner />
      </Suspense>

      {/* Əsas naviqasiya — plitə şəbəkəsi, maks 2 klik prinsipi */}
      <div className="tile-grid grid grid-cols-2 gap-3">
        <Tile href="/hava" icon="☀️" label="Hava" hint="7 günlük proqnoz" />
        <Tile href="/xeberler" icon="📰" label="Xəbərlər" />
        <Tile href="/novbetci" icon="🏥" label="Növbətçi" hint="aptek · feldşer · kəsinti" />
        <Tile href="/xerite" icon="🗺️" label="Xəritə" />
        <Tile href="/haqqinda" icon="🏡" label="Kəndimiz" hint="tarix və məlumat" />
        <Tile href="/sehidler" icon="🕯️" label="Şəhidlərimiz" />
        <Tile href="/tedbirler" icon="📅" label="Tədbirlər" />
        <Tile href="/bazar" icon="🛒" label="Bazar" hint="qaymaq · məhsullar" />
        <Tile href="/al-ver" icon="🏷️" label="Al-ver" hint="sakin elanları" />
      </div>

      <PrayerTimes />

      <Suspense>
        <OnThisDay />
      </Suspense>

      {/* Kəndin brendi — Xıdırlı qaymağı */}
      <Link
        href="/haqqinda/brend"
        className="simple-hide block overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
      >
        <div className="bg-nar px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
          Kəndimiz nə ilə tanınır?
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="text-5xl" aria-hidden>🐃</span>
          <div>
            <p className="font-heading text-xl font-bold">Xıdırlı qaymağı</p>
            <p className="mt-1 text-ink-soft">
              Ağdam və Qarabağ bazarlarında kəndimiz məhz camış qaymağı ilə tanınır.
              Hekayəni oxuyun →
            </p>
          </div>
        </div>
      </Link>

      <div className="carpet-divider simple-hide" aria-hidden />

      {/* Qarşıdan gələn tədbirlər */}
      {events.length > 0 && (
        <section className="simple-hide">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-heading text-xl font-bold">Qarşıdan gələnlər</h2>
            <Link href="/tedbirler" className="font-bold text-kerpic">
              Hamısı →
            </Link>
          </div>
          <ul className="space-y-2">
            {events.slice(0, 2).map((e) => (
              <li key={e.id} className="rounded-2xl border border-line bg-surface p-4">
                <p className="font-bold">{e.title}</p>
                <p className="text-ink-soft">
                  📅 {formatDateTime(e.startsAt)}
                  {e.location ? ` · 📍 ${e.location}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Son xəbərlər */}
      {news.length > 0 && (
        <section className="simple-hide">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-heading text-xl font-bold">Son xəbərlər</h2>
            <Link href="/xeberler" className="font-bold text-kerpic">
              Hamısı →
            </Link>
          </div>
          <ul className="space-y-2">
            {news.slice(0, 2).map((n) => (
              <li key={n.id}>
                <Link
                  href={`/xeberler/${n.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 active:bg-surface-2"
                >
                  <span className="text-3xl" aria-hidden>{n.coverEmoji ?? "📰"}</span>
                  <span>
                    <span className="block font-bold leading-snug">{n.title}</span>
                    <span className="text-sm text-ink-soft">{formatDate(n.publishedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
