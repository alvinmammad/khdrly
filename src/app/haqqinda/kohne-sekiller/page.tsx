import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Köhnə şəkillər" };

export default function OldPhotosPage() {
  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <h1 className="font-heading text-2xl font-bold">Köhnə şəkillər və xəritələr</h1>

      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="text-5xl" aria-hidden>🖼️</p>
        <p className="mt-3 text-lg font-bold">Rəqəmsal arxiv hazırlanır</p>
        <p className="mt-2 text-ink-soft">
          Kəndin köhnə fotoları, məktəb albomları, qədim xəritələr və sənədlər bu
          bölmədə toplanacaq. Evinizdə köhnə şəkil və ya sənəd varsa, onu qoruyun —
          tezliklə &quot;Siz də paylaşın&quot; funksiyası ilə arxivə əlavə edə biləcəksiniz.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-4">
        <p className="font-bold">💡 Bilirsinizmi?</p>
        <p className="mt-1 text-ink-soft">
          Hər köhnə fotoşəkil kəndin yaddaşının bir parçasıdır. Planlaşdırılan
          &quot;skan günü&quot; tədbirlərində gənclər yaşlı sakinlərin köhnə şəkillərini
          telefonla skan edib arxivə yükləməyə kömək edəcək.
        </p>
      </div>
    </div>
  );
}
