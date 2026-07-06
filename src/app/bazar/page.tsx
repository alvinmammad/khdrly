import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Bazar" };

/** Bazar modulu Mərhələ 2-də açılır — hələlik brend tanıtımı və xəbərdarlıq */
export default function MarketPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Bazar</h1>

      <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
        <p className="text-5xl" aria-hidden>🛒</p>
        <p className="mt-3 text-xl font-bold">Kənd bazarı tezliklə açılır!</p>
        <p className="mt-2 text-ink-soft">
          Burada kəndimizin təsərrüfatlarından qaymaq, süd məhsulları, mövsümi
          meyvə-tərəvəz sifariş edə, fermerlərlə birbaşa əlaqə saxlaya
          biləcəksiniz.
        </p>
      </div>

      <Link
        href="/haqqinda/brend"
        className="block overflow-hidden rounded-2xl border border-line bg-surface shadow-sm active:bg-surface-2"
      >
        <div className="bg-nar px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
          Flaqman məhsul
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="text-5xl" aria-hidden>🐃</span>
          <div>
            <p className="font-heading text-xl font-bold">Xıdırlı qaymağı</p>
            <p className="mt-1 text-ink-soft">
              Kəndimizin brendi haqqında oxuyun →
            </p>
          </div>
        </div>
      </Link>

      <div className="rounded-2xl border-2 border-zeytun bg-zeytun/10 p-5">
        <p className="font-bold">👨‍🌾 Fermersiniz?</p>
        <p className="mt-1 text-ink-soft">
          Bazar açılanda məhsullarınızı burada satışa çıxara biləcəksiniz —
          qeydiyyat elanını xəbərlər bölməsindən izləyin.
        </p>
      </div>
    </div>
  );
}
