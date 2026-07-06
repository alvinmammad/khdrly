import Link from "next/link";
import { describeWeather, getWeather } from "@/lib/weather";

/** Başlıqda həmişə görünən bugünkü hava — "0 klik" prinsipi */
export default async function WeatherChip() {
  const w = await getWeather();
  if (!w) return null;
  const d = describeWeather(w.current.code);
  return (
    <Link
      href="/hava"
      className="flex h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 active:bg-surface-2"
      aria-label={`Hava: ${d.label}, ${w.current.temp} dərəcə. 7 günlük proqnoz üçün toxunun`}
    >
      <span className="text-xl" aria-hidden>{d.icon}</span>
      <span className="text-lg font-bold">{w.current.temp}°</span>
    </Link>
  );
}
