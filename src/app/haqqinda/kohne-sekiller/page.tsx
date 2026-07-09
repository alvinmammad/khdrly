import type { Metadata } from "next";
import Link from "next/link";
import { getMediaItems, getThenNow } from "@/lib/data";
import ThenNowSlider from "@/components/ThenNowSlider";

export const metadata: Metadata = { title: "Media arxivi" };

export const revalidate = 300;

export default async function MediaArchivePage() {
  const [items, thenNow] = await Promise.all([getMediaItems(), getThenNow()]);

  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">🖼️ Media arxivi</h1>
        <p className="mt-2 text-ink-soft">
          Kəndin fotoyaddaşı — köhnə şəkillər, qayıdış anları, bu günün kəndi.
        </p>
      </header>

      <Link
        href="/paylasin"
        className="block rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-5 active:bg-gunebaxan/20"
      >
        <p className="text-lg font-bold">📤 Siz də paylaşın</p>
        <p className="mt-1 text-ink-soft">
          Köhnə fotolarınızı və xatirə şəkillərinizi kəndin arxivinə əlavə edin →
        </p>
      </Link>

      {thenNow.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">↔️ Onda və indi</h2>
          <p className="text-sm text-ink-soft">
            Sürgünü çəkin — dağıntıdan bərpaya gedən yolu görün.
          </p>
          {thenNow.map((t) => (
            <ThenNowSlider
              key={t.id}
              title={t.title}
              note={t.note}
              beforeUrl={t.beforeUrl}
              afterUrl={t.afterUrl}
            />
          ))}
        </section>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>📷</p>
          <p className="mt-3 text-xl font-bold">Arxiv hələ boşdur</p>
          <p className="mt-2 text-ink-soft">
            İlk şəkli siz paylaşa bilərsiniz — yoxlamadan sonra burada dərc
            olunacaq. Evinizdə köhnə şəkil varsa, onu qoruyun: &quot;skan
            günü&quot; tədbirlərində gənclər rəqəmsallaşdırmağa kömək edəcək.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              {/* Zəif internet: lazy yükləmə; şəkillər yükləmə zamanı brauzerdə sıxılıb */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt={m.title}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="p-3">
                <p className="font-bold leading-snug">{m.title}</p>
                {m.takenPeriod && (
                  <p className="mt-0.5 text-sm text-ink-soft">{m.takenPeriod}</p>
                )}
                {m.uploaderName && (
                  <p className="mt-0.5 text-sm text-ink-soft">
                    Paylaşdı: {m.uploaderName}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
