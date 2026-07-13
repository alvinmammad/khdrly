import { pageMetadata } from "@/lib/seo";
import { describeWeather, farmerAdvice, getWeather } from "@/lib/weather";
import { formatShortDate, formatWeekday } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Xıdırlı hava proqnozu — bugün və 7 günlük",
  description:
    "Xıdırlı kəndində (Ağdam) hava: cari temperatur, külək, rütubət və 7 günlük dəqiq proqnoz. Fermerlər üçün əkin-suvarma tövsiyələri ilə.",
  path: "/hava",
});

export default async function WeatherPage() {
  const w = await getWeather();

  if (!w) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-4xl" aria-hidden>📡</p>
        <p className="mt-2 font-bold">Hava məlumatı yüklənmədi</p>
        <p className="text-ink-soft">İnternet bağlantısını yoxlayıb yenidən cəhd edin.</p>
      </div>
    );
  }

  const cur = describeWeather(w.current.code);
  const advice = farmerAdvice(w);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Hava — Xıdırlı</h1>

      {/* Cari hava — böyük kart */}
      <div className="rounded-2xl border border-line bg-surface p-6 text-center shadow-sm">
        <p className="text-6xl" aria-hidden>{cur.icon}</p>
        <p className="mt-2 text-5xl font-extrabold">{w.current.temp}°</p>
        <p className="mt-1 text-xl font-bold">{cur.label}</p>
        <p className="mt-2 text-ink-soft">
          Hiss olunur: {w.current.feelsLike}° · Külək: {w.current.windKmh} km/s · Rütubət:{" "}
          {w.current.humidity}%
        </p>
      </div>

      {/* Fermer tövsiyələri */}
      {advice.length > 0 && (
        <div className="rounded-2xl border-2 border-zeytun bg-zeytun/10 p-4">
          <p className="font-bold">🌱 Təsərrüfat üçün tövsiyə</p>
          <ul className="mt-2 space-y-1.5">
            {advice.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 7 günlük proqnoz — böyük sətirlər */}
      <section>
        <h2 className="mb-2 font-heading text-xl font-bold">7 günlük proqnoz</h2>
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {w.daily.map((d, i) => {
            const desc = describeWeather(d.code);
            return (
              <li key={d.date} className="flex items-center gap-3 p-4">
                <span className="text-3xl" aria-hidden>{desc.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold capitalize">
                    {i === 0 ? "Bu gün" : formatWeekday(d.date)}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {formatShortDate(d.date)} · {desc.label}
                    {d.precipProb >= 30 ? ` · 💧 ${d.precipProb}%` : ""}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-lg font-bold">{d.tempMax}°</span>
                  <span className="text-ink-soft">{d.tempMin}°</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-sm text-ink-soft">Mənbə: Open-Meteo · hər 30 dəqiqədən bir yenilənir</p>
    </div>
  );
}
