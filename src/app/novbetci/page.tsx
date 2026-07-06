import type { Metadata } from "next";
import { getDutyInfo } from "@/lib/data";
import type { DutyType } from "@/lib/data/types";

export const metadata: Metadata = { title: "Növbətçi məlumatlar" };

export const revalidate = 300;

const TYPE_META: Record<DutyType, { icon: string; label: string }> = {
  aptek: { icon: "💊", label: "Aptek" },
  feldser: { icon: "🩺", label: "Feldşer" },
  elektrik: { icon: "⚡", label: "Elektrik" },
  su: { icon: "🚰", label: "Su" },
};

export default async function DutyPage() {
  const items = await getDutyInfo();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Növbətçi məlumatlar</h1>
      <p className="text-ink-soft">
        Növbətçi aptek və feldşer, elektrik və su kəsintiləri barədə aktual məlumatlar.
      </p>

      {items.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-4xl" aria-hidden>✅</p>
          <p className="mt-2 font-bold">Hazırda aktiv məlumat yoxdur</p>
        </div>
      )}

      <ul className="space-y-3">
        {items.map((d) => {
          const meta = TYPE_META[d.type];
          return (
            <li
              key={d.id}
              className={`rounded-2xl border bg-surface p-5 ${
                d.isAlert ? "border-2 border-gunebaxan" : "border-line"
              }`}
            >
              <p className="flex items-start gap-2 text-lg font-bold">
                <span className="text-2xl" aria-hidden>{meta.icon}</span>
                {d.title}
              </p>
              <p className="mt-2 text-ink-soft">{d.body}</p>
              {d.phone && (
                <a
                  href={`tel:${d.phone}`}
                  className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
                >
                  📞 Zəng et
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
