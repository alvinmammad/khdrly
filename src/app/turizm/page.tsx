import type { Metadata } from "next";
import Link from "next/link";
import { getStays } from "@/lib/data";
import type { StayType } from "@/lib/data/types";

export const metadata: Metadata = { title: "Turizm və kirayə" };

export const revalidate = 300;

const STAY_META: Record<StayType, { icon: string; label: string }> = {
  qonaq_evi: { icon: "🏡", label: "Qonaq evləri" },
  kiraye_ev: { icon: "🔑", label: "Kirayə evlər" },
};

export default async function TourismPage() {
  const stays = await getStays();
  const usedTypes = [...new Set(stays.map((s) => s.type))] as StayType[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">🏘️ Turizm və kirayə</h1>
        <p className="mt-2 text-ink-soft">
          Kəndimizə qonaq gəlin — Qarabağın dirçələn kəndində qalın, kənd
          süfrəsində Xıdırlı qaymağını dadın.
        </p>
      </header>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="font-bold">Nə üçün Xıdırlı?</p>
        <ul className="mt-2 space-y-1 text-ink-soft">
          <li>🐃 Məşhur Xıdırlı qaymağı — birbaşa təsərrüfatdan</li>
          <li>📜 Ağdamın tarixi yerlərinə yaxınlıq</li>
          <li>🌄 Qarabağ düzündə kənd həyatı təcrübəsi</li>
        </ul>
        <Link href="/haqqinda" className="mt-3 inline-block font-bold text-kerpic">
          Kəndimiz haqqında →
        </Link>
      </div>

      {stays.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🏡</p>
          <p className="mt-3 text-xl font-bold">Qalma yerləri hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            Evini qonaqlara açmaq istəyən sakinlər kənd icra nümayəndəliyinə
            müraciət edə bilər.
          </p>
        </div>
      ) : (
        usedTypes.map((t) => (
          <section key={t} className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <span aria-hidden>{STAY_META[t].icon}</span> {STAY_META[t].label}
            </h2>
            <ul className="space-y-3">
              {stays
                .filter((s) => s.type === t)
                .map((s) => (
                  <li key={s.id} className="rounded-2xl border border-line bg-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-lg font-bold">{s.name}</p>
                      {s.priceNote && (
                        <span className="rounded-full bg-surface-2 px-3 py-1 text-sm font-bold">
                          {s.priceNote}
                        </span>
                      )}
                    </div>
                    {s.description && (
                      <p className="mt-2 text-ink-soft">{s.description}</p>
                    )}
                    <a
                      href={`tel:${s.phone}`}
                      className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
                    >
                      📞 Zəng et
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
