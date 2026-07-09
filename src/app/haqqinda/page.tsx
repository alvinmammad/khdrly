import type { Metadata } from "next";
import Link from "next/link";
import TtsButton from "@/components/ui/TtsButton";

export const metadata: Metadata = { title: "Kəndimiz" };

const INTRO =
  "Xıdırlı — Azərbaycanın Ağdam rayonunda, Ağdam şəhərindən təxminən 3 kilometr şimal-qərbdə yerləşən kənddir. " +
  "Birinci Qarabağ müharibəsində işğal olunmuş, 2020-ci il Vətən müharibəsindən sonra azad edilmiş ərazidə yerləşən kənd " +
  "\"Böyük Qayıdış\" proqramı çərçivəsində yenidən qurulub və məcburi köçkün ailələr doğma torpaqlarına qayıdıb. " +
  "Kənd Ağdam və Qarabağ bazarlarında məşhur Xıdırlı qaymağı ilə tanınır.";

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Kəndimiz — Xıdırlı</h1>

      <TtsButton text={INTRO} />

      <p className="text-lg leading-relaxed">{INTRO}</p>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="text-sm text-ink-soft">Rayon</p>
          <p className="font-bold">Ağdam</p>
        </div>
        <div>
          <p className="text-sm text-ink-soft">Əhali</p>
          <p className="font-bold">— (dəqiqləşdirilir)</p>
        </div>
        <div>
          <p className="text-sm text-ink-soft">Koordinatlar</p>
          <p className="font-bold">40.0156° şm, 46.8906° ş</p>
        </div>
        <div>
          <p className="text-sm text-ink-soft">Tanınma</p>
          <p className="font-bold">Xıdırlı qaymağı 🐃</p>
        </div>
      </div>

      <div className="carpet-divider" aria-hidden />

      <nav className="space-y-3" aria-label="Kəndimiz bölmələri">
        <Link
          href="/haqqinda/tarix"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>📜</span>
          <span>
            <span className="block text-lg font-bold">Tarixi</span>
            <span className="text-ink-soft">Yaranma, işğal, azadlıq və bərpa</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/azadliq"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🇦🇿</span>
          <span>
            <span className="block text-lg font-bold">Azadlıq və Bərpa</span>
            <span className="text-ink-soft">Böyük Qayıdışın zaman xətti</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/isgal-dovru"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🕯️</span>
          <span>
            <span className="block text-lg font-bold">İşğal dövrü</span>
            <span className="text-ink-soft">1993–2020 yaddaş arxivi</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/brend"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🐃</span>
          <span>
            <span className="block text-lg font-bold">Xıdırlı qaymağı</span>
            <span className="text-ink-soft">Kəndimizin brendi və fəxri</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/usaqlar-ucun"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🧒</span>
          <span>
            <span className="block text-lg font-bold">Uşaqlar üçün tariximiz</span>
            <span className="text-ink-soft">Kəndin hekayəsi — sadə dildə</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/xatire-xeritesi"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>💭</span>
          <span>
            <span className="block text-lg font-bold">Xatirə xəritəsi</span>
            <span className="text-ink-soft">Köhnə kənd — yaddaşdan xəritəyə</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/sesli-tarix"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🎙️</span>
          <span>
            <span className="block text-lg font-bold">Şifahi tarix</span>
            <span className="text-ink-soft">Ağsaqqalların öz səsi ilə</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/secere"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🌳</span>
          <span>
            <span className="block text-lg font-bold">Şəcərə və Diaspora</span>
            <span className="text-ink-soft">Nəsillərimiz və dünyadakı xıdırlılılar</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/meshurlar"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>⭐</span>
          <span>
            <span className="block text-lg font-bold">Məşhurlarımız</span>
            <span className="text-ink-soft">Kəndin yetirdiyi tanınmış insanlar</span>
          </span>
        </Link>
        <Link
          href="/haqqinda/kohne-sekiller"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🖼️</span>
          <span>
            <span className="block text-lg font-bold">Köhnə şəkillər</span>
            <span className="text-ink-soft">Arxiv fotoları və qədim xəritələr</span>
          </span>
        </Link>
        <Link
          href="/xerite"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm active:bg-surface-2"
        >
          <span className="text-4xl" aria-hidden>🗺️</span>
          <span>
            <span className="block text-lg font-bold">Xəritədə yeri</span>
            <span className="text-ink-soft">İnteraktiv kənd xəritəsi</span>
          </span>
        </Link>
      </nav>
    </div>
  );
}
