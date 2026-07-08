import type { Metadata } from "next";
import Link from "next/link";
import { getNotablePeople } from "@/lib/data";
import { PERSON_META } from "@/lib/personMeta";
import type { PersonField } from "@/lib/data/types";

export const metadata: Metadata = { title: "Məşhurlarımız" };

export const revalidate = 300;

export default async function NotablePeoplePage() {
  const people = await getNotablePeople();
  const usedFields = [...new Set(people.map((p) => p.field))] as PersonField[];

  return (
    <div className="space-y-6">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">⭐ Məşhurlarımız</h1>
        <p className="mt-2 text-ink-soft">
          Kəndimizin yetirdiyi tanınmış insanlar — alimlər, müəllimlər,
          idmançılar, zəhmət adamları.
        </p>
      </header>

      {people.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>⭐</p>
          <p className="mt-3 text-xl font-bold">Bölmə hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            Kəndimizin tanınmış şəxsləri haqqında məlumatlar yalnız yoxlanılmış
            mənbələrlə dərc olunur. Təklifiniz varsa, kənd icra
            nümayəndəliyinə müraciət edin.
          </p>
        </div>
      ) : (
        usedFields.map((f) => (
          <section key={f} className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <span aria-hidden>{PERSON_META[f].icon}</span> {PERSON_META[f].label}
            </h2>
            <ul className="space-y-3">
              {people
                .filter((p) => p.field === f)
                .map((p) => (
                  <li key={p.id} className="rounded-2xl border border-line bg-surface p-5">
                    <p className="text-lg font-bold">{p.fullName}</p>
                    {p.yearsDisplay && (
                      <p className="text-sm text-ink-soft">{p.yearsDisplay}</p>
                    )}
                    <p className="mt-2 leading-relaxed">{p.description}</p>
                    {p.sources.length > 0 && (
                      <p className="mt-3 border-t border-line pt-2 text-sm italic text-ink-soft">
                        Mənbə: {p.sources.join("; ")}
                      </p>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
