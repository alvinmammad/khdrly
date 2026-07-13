import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import TtsButton from "@/components/ui/TtsButton";
import { ttsAudioSrc } from "@/lib/ttsAudio";

export const metadata = pageMetadata({
  title: "Xıdırlı qaymağı — kəndimizin brendi",
  description:
    "Əsl Xıdırlı qaymağı: Ağdam və Qarabağ bazarlarında məşhur camış qaymağının hekayəsi, ənənəvi hazırlanma üsulu və istehsalçılardan birbaşa sifariş imkanı.",
  path: "/haqqinda/brend",
});

const STORY =
  "Xıdırlı kəndi Ağdam və bütün Qarabağ bazarlarında məhz camış qaymağı ilə tanınır. " +
  "Nəsildən-nəslə ötürülən ənənəvi üsulla hazırlanan Xıdırlı qaymağı kəndin süd və camış " +
  "təsərrüfatının bəhrəsidir və sakinlərimizin fəxridir. Bazar bölməsində əsl Xıdırlı " +
  "qaymağı istehsalçılarını tapıb birbaşa zəng edə bilərsiniz.";

export default function BrandPage() {
  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>

      {/* Brend hero */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="bg-nar px-5 py-6 text-center text-white">
          <p className="text-6xl" aria-hidden>🐃</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Xıdırlı qaymağı</h1>
          <p className="mt-1 opacity-90">Kəndimizin brendi · Qarabağın dadı</p>
        </div>
        <div className="space-y-4 p-5">
          <TtsButton text={STORY} audioSrc={ttsAudioSrc("brend")} />
          <p className="text-lg leading-relaxed">{STORY}</p>
        </div>
      </div>

      {/* Nə üçün xüsusidir */}
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">Nə üçün xüsusidir?</h2>
        <ul className="space-y-2">
          {[
            ["🥛", "Camış südündən — adi qaymaqdan daha zəngin və qatı"],
            ["👵", "Nəsildən-nəslə ötürülən ənənəvi hazırlanma üsulu"],
            ["🌿", "Qarabağ düzünün otlaqlarında bəslənən camışlar"],
            ["🏅", "Ağdam bazarında illərdir tanınan ad"],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <span className="text-3xl" aria-hidden>{icon}</span>
              <span className="font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bazar modulu keçidi */}
      <div className="rounded-2xl border-2 border-zeytun bg-zeytun/10 p-5 text-center">
        <p className="text-lg font-bold">🛒 Sifariş vermək istəyirsiniz?</p>
        <p className="mt-1 text-ink-soft">
          Bazar modulu tezliklə açılır — əsl Xıdırlı qaymağını birbaşa istehsalçıdan
          sifariş edə, Bakıya və digər şəhərlərə çatdırılma imkanından istifadə edə
          biləcəksiniz.
        </p>
        <Link
          href="/bazar"
          className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl bg-zeytun px-6 font-bold text-white"
        >
          Bazar bölməsi →
        </Link>
      </div>
    </div>
  );
}
