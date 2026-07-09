import { CalculationMethod, Coordinates, PrayerTimes as AdhanTimes } from "adhan";
import { VILLAGE_CENTER } from "@/lib/data/mock";

/*
  Namaz vaxtları — kənd koordinatları üçün cihazda/serverdə hesablanır,
  internet və xarici API tələb etmir (oflayn qaydası). Ana səhifə ISR
  (5 dəq) ilə yeniləndiyindən günün vaxtları aktual qalır.
  Hesablama təxminidir — dəqiq təqvim üçün QMİ elanları əsasdır.
*/

const LABELS: { key: keyof AdhanTimes & string; label: string }[] = [
  { key: "fajr", label: "Sübh" },
  { key: "sunrise", label: "Günəş" },
  { key: "dhuhr", label: "Zöhr" },
  { key: "asr", label: "Əsr" },
  { key: "maghrib", label: "Məğrib" },
  { key: "isha", label: "İşa" },
];

export default function PrayerTimes() {
  // Bakı vaxtı ilə bugünkü tarix (server UTC işləyir)
  const nowBaku = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const day = new Date(
    Date.UTC(nowBaku.getUTCFullYear(), nowBaku.getUTCMonth(), nowBaku.getUTCDate(), 12)
  );

  const times = new AdhanTimes(
    new Coordinates(VILLAGE_CENTER.lat, VILLAGE_CENTER.lng),
    day,
    CalculationMethod.Turkey()
  );

  const fmt = new Intl.DateTimeFormat("az-Latn-AZ", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Baku",
  });

  return (
    <section
      aria-label="Bu günün namaz vaxtları"
      className="rounded-2xl border border-line bg-surface p-4"
    >
      <p className="mb-2 font-bold">🕌 Namaz vaxtları — bu gün</p>
      <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
        {LABELS.map(({ key, label }) => (
          <div key={key} className="rounded-xl bg-surface-2 px-1 py-2">
            <p className="text-sm text-ink-soft">{label}</p>
            <p className="font-bold tabular-nums">
              {fmt.format(times[key] as Date)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
