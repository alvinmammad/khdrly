import type { Metadata } from "next";
import Link from "next/link";
import TtsButton from "@/components/ui/TtsButton";

export const metadata: Metadata = { title: "Uşaqlar üçün tariximiz" };

/*
  Kəndin tarixi uşaq dilində — qısa cümlələr, suallı başlıqlar, isti ton.
  Faktlar böyüklər bölməsindəki təsdiqlənmiş faktlardır, sadələşdirilib;
  1993 hadisələri qorxutmadan, ümidə fokusla verilir.
*/

const SECTIONS: { icon: string; title: string; body: string }[] = [
  {
    icon: "🏡",
    title: "Kəndimiz haradadır?",
    body: "Xıdırlı — Qarabağ düzündə, Ağdam şəhərinin lap yaxınlığında yerləşən kənddir. Babalarımız və nənələrimiz burada yaşayıb, torpağı əkib, camış saxlayıblar.",
  },
  {
    icon: "🐃",
    title: "Camışlar və məşhur qaymaq",
    body: "Bilirsənmi ki, kəndimiz bütün Qarabağda qaymağı ilə məşhurdur? Camışın südündən hazırlanan Xıdırlı qaymağını bazarlarda hamı tanıyır. Bu, kəndimizin şirin fəxridir!",
  },
  {
    icon: "🕊️",
    title: "Kədərli illər",
    body: "1993-cü ildə müharibə oldu və kəndimizin insanları evlərini tərk etməli oldular. Uzun 27 il boyunca hamı öz kəndi üçün darıxdı. Nənələr-babalar uşaqlarına həmişə Xıdırlını danışırdılar ki, heç kim kəndi unutmasın.",
  },
  {
    icon: "🇦🇿",
    title: "Böyük sevinc",
    body: "2020-ci ildə torpaqlarımız azad olundu! Ağdam yenidən bizim oldu. O gün hamı sevindi, ağladı, bir-birini qucaqladı — 27 illik həsrət bitdi.",
  },
  {
    icon: "🏗️",
    title: "Kənd yenidən qurulur",
    body: "İndi Xıdırlıda təzə evlər, məktəb, yollar tikilib. Ailələr bir-bir doğma kəndə qayıdır. Sən görürsən? Kəndimiz yenidən canlanır!",
  },
  {
    icon: "🌟",
    title: "Sən də bu tarixin bir hissəsisən",
    body: "Bu kəndin gələcəyi sənsən. Oxu, öyrən, böyüklərdən kəndin hekayələrini soruş. Bir gün sən də öz uşaqlarına Xıdırlını danışacaqsan.",
  },
];

export default function KidsHistoryPage() {
  const fullText = SECTIONS.map((s) => `${s.title}. ${s.body}`).join(" ");

  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">
          🧒 Uşaqlar üçün tariximiz
        </h1>
        <p className="mt-2 text-ink-soft">
          Xıdırlının hekayəsi — balaca oxucular üçün.
        </p>
      </header>

      <TtsButton text={fullText} />

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <h2 className="flex items-center gap-3 font-heading text-xl font-bold">
              <span className="text-3xl" aria-hidden>{s.icon}</span> {s.title}
            </h2>
            <p className="mt-2 text-lg leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/haqqinda/kohne-sekiller"
          className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-4 active:bg-gunebaxan/20"
        >
          <p className="font-bold">🖼️ Şəkillərə bax</p>
          <p className="mt-1 text-sm text-ink-soft">
            Kəndin onda və indi şəkilləri →
          </p>
        </Link>
        <Link
          href="/haqqinda/tarix"
          className="rounded-2xl border border-line bg-surface p-4 active:bg-surface-2"
        >
          <p className="font-bold">📜 Böyüklər üçün tarix</p>
          <p className="mt-1 text-sm text-ink-soft">Tam hekayə →</p>
        </Link>
      </div>
    </div>
  );
}
