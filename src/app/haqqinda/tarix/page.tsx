import type { Metadata } from "next";
import Link from "next/link";
import TtsButton from "@/components/ui/TtsButton";

export const metadata: Metadata = { title: "Kəndin tarixi" };

/*
  Qeyd: Buradakı mətn ümumi, rəsmi mənbələrlə üst-üstə düşən faktlardır.
  Kəndin adının mənşəyi, əhali tarixi kimi yerli detallar admin panelindən
  icma ağsaqqallarının bilgiləri əsasında zənginləşdiriləcək. Hər tarixi
  fakt üçün mənbə istinadı tələbi Modul 4 (Mərhələ 2) ilə gəlir.
*/

const SECTIONS: { title: string; icon: string; body: string; note?: string }[] = [
  {
    title: "Adın mənşəyi",
    icon: "🏷️",
    body: "Kəndin adının mənşəyi ilə bağlı rəvayət və tarixi izahlar icma ağsaqqallarının söyləmələri əsasında bu bölməyə əlavə olunacaq.",
    note: "Bu hissə hazırlanır — xatirəsi olan sakinlər \"Siz də paylaşın\" bölməsi (tezliklə) vasitəsilə töhfə verə biləcək.",
  },
  {
    title: "İşğal dövrü (1993–2020)",
    icon: "🕯️",
    body: "Birinci Qarabağ müharibəsi zamanı, 1993-cü ilin iyulunda Ağdam rayonunun böyük hissəsi işğal olundu. Xıdırlı sakinləri doğma yurdlarını tərk edərək məcburi köçkün həyatı yaşamağa məcbur oldular. İşğal illərində kənd dağıntılara məruz qaldı. Bu dövrün ətraflı xronologiyası, arxiv fotoları və sakinlərin xatirələri ayrıca \"İşğal dövrü\" arxiv bölməsində toplanacaq.",
  },
  {
    title: "Azadlıq (2020)",
    icon: "🇦🇿",
    body: "2020-ci il 44 günlük Vətən müharibəsinin nəticəsi olaraq imzalanmış üçtərəfli bəyanata əsasən, 20 noyabr 2020-ci ildə Ağdam rayonu Azərbaycana qaytarıldı. Xalqımız 27 illik həsrətdən sonra doğma torpaqlarına qovuşdu.",
  },
  {
    title: "Bərpa və Böyük Qayıdış",
    icon: "🏗️",
    body: "\"Böyük Qayıdış\" proqramı çərçivəsində Xıdırlı kəndi müasir standartlarla yenidən quruldu: yollar çəkildi, elektrik və su təchizatı bərpa olundu, evlər, məktəb və sosial obyektlər tikildi. Kəndin birinci mərhələsinin açılışından sonra ilk ailələr doğma yurda qayıtdı. Bərpanın tam zaman xətti (timeline) \"Azadlıq və Bərpa\" bölməsində təqdim olunacaq.",
    note: "Mənbə: AZERTAC və digər rəsmi xəbər agentliklərinin Xıdırlı kəndinin açılışı barədə reportajları.",
  },
];

export default function HistoryPage() {
  const fullText = SECTIONS.map((s) => `${s.title}. ${s.body}`).join(" ");

  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <h1 className="font-heading text-2xl font-bold">Kəndin tarixi</h1>

      <TtsButton text={fullText} />

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <span aria-hidden>{s.icon}</span> {s.title}
            </h2>
            <p className="mt-2 leading-relaxed">{s.body}</p>
            {s.note && <p className="mt-3 text-sm italic text-ink-soft">{s.note}</p>}
          </section>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-4">
        <p className="font-bold">📢 Xatirələrinizi gözləyirik</p>
        <p className="mt-1 text-ink-soft">
          İşğaldan əvvəlki kənd həyatı, 1993-cü il hadisələri və ya qayıdışla bağlı
          xatirəniz varsa, tezliklə açılacaq &quot;Siz də paylaşın&quot; bölməsi ilə tarixi
          yaddaşımıza töhfə verə bilərsiniz.
        </p>
      </div>
    </div>
  );
}
