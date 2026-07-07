import type { Metadata } from "next";
import Link from "next/link";
import { getFlagshipProducers, getProducts } from "@/lib/data";
import { CATEGORY_META } from "@/lib/bazarMeta";
import type { ProductCategory } from "@/lib/data/types";

export const metadata: Metadata = { title: "Bazar" };

export const revalidate = 300;

function priceLabel(price?: number, unit?: string): string {
  if (price === undefined) return "Qiymət razılaşma ilə";
  return `${price} AZN${unit ? ` / ${unit}` : ""}`;
}

export default async function MarketPage() {
  const [products, flagships] = await Promise.all([
    getProducts(),
    getFlagshipProducers(),
  ]);

  // Yalnız məhsulu olan kateqoriyalar göstərilir
  const usedCategories = [...new Set(products.map((p) => p.category))] as ProductCategory[];

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">Bazar</h1>
      <p className="text-ink-soft">
        Kəndimizin təsərrüfatlarından birbaşa — zəng edib razılaşın, yerində
        təhvil alın.
      </p>

      {/* Qaymaq — flaqman brend */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="bg-nar px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
          Kəndimizin brendi
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden>🐃</span>
            <div>
              <p className="font-heading text-xl font-bold">Xıdırlı qaymağı</p>
              <Link href="/haqqinda/brend" className="font-bold text-kerpic">
                Brend haqqında oxuyun →
              </Link>
            </div>
          </div>
          {flagships.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-4"
            >
              <div>
                <p className="font-bold">{f.name}</p>
                {f.description && (
                  <p className="mt-1 text-sm text-ink-soft">{f.description}</p>
                )}
              </div>
              <a
                href={`tel:${f.phone}`}
                className="flex min-h-12 items-center gap-2 rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
              >
                📞 Zəng et
              </a>
            </div>
          ))}
          {flagships.length === 0 && (
            <p className="text-sm text-ink-soft">
              Qaymaq istehsalçıları tezliklə burada olacaq.
            </p>
          )}
        </div>
      </section>

      {/* Kataloq */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🧺</p>
          <p className="mt-3 text-xl font-bold">Hazırda satışda məhsul yoxdur</p>
          <p className="mt-2 text-ink-soft">
            Mövsümi məhsullar yetişəndə burada görünəcək — xəbərləri izləyin.
          </p>
        </div>
      ) : (
        usedCategories.map((cat) => (
          <section key={cat} className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <span aria-hidden>{CATEGORY_META[cat].icon}</span>{" "}
              {CATEGORY_META[cat].label}
            </h2>
            <ul className="space-y-2">
              {products
                .filter((p) => p.category === cat)
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/bazar/mehsul/${p.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 active:bg-surface-2"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-3xl" aria-hidden>
                          {CATEGORY_META[p.category].icon}
                        </span>
                        <span>
                          <span className="block text-lg font-bold">{p.name}</span>
                          <span className="text-sm text-ink-soft">
                            {p.producer.name}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right font-bold text-kerpic">
                        {priceLabel(p.price, p.unit)}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}

      <div className="simple-hide rounded-2xl border-2 border-zeytun bg-zeytun/10 p-5">
        <p className="font-bold">👨‍🌾 Fermersiniz?</p>
        <p className="mt-1 text-ink-soft">
          Məhsulunuzu satışa çıxarmaq üçün kənd icra nümayəndəliyinə müraciət
          edin — kataloqa əlavə olunsun.
        </p>
      </div>
    </div>
  );
}
