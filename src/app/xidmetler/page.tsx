import type { Metadata } from "next";
import { getServices } from "@/lib/data";
import { SERVICE_META } from "@/lib/xidmetMeta";
import type { ServiceCategory } from "@/lib/data/types";

export const metadata: Metadata = { title: "Xidmətlər" };

export const revalidate = 300;

export default async function ServicesPage() {
  const services = await getServices();
  const usedCategories = [
    ...new Set(services.map((s) => s.category)),
  ] as ServiceCategory[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">🔧 Xidmətlər</h1>
        <p className="mt-2 text-ink-soft">
          Kənddə və ətrafda xidmət göstərən ustalar — bir toxunuşla zəng edin.
        </p>
      </header>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🧰</p>
          <p className="mt-3 text-xl font-bold">Kataloq hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            Xidmət göstərirsinizsə, kənd icra nümayəndəliyinə müraciət edin —
            kataloqa əlavə olunun.
          </p>
        </div>
      ) : (
        usedCategories.map((cat) => (
          <section key={cat} className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <span aria-hidden>{SERVICE_META[cat].icon}</span>{" "}
              {SERVICE_META[cat].label}
            </h2>
            <ul className="space-y-2">
              {services
                .filter((s) => s.category === cat)
                .map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                  >
                    <div>
                      <p className="text-lg font-bold">{s.name}</p>
                      {s.description && (
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {s.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={`tel:${s.phone}`}
                      className="flex min-h-12 items-center gap-2 rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
                    >
                      📞 Zəng et
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}

      <p className="simple-hide rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Siyahıya düşmək istəyən xidmətçilər kənd icra nümayəndəliyinə müraciət
        edə bilər.
      </p>
    </div>
  );
}
