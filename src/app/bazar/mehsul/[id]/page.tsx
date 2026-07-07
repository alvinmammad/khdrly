import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import { CATEGORY_META, inSeason } from "@/lib/bazarMeta";

export const metadata: Metadata = { title: "Məhsul" };

export const revalidate = 300;

const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr",
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const month = new Date(Date.now() + 4 * 60 * 60 * 1000).getUTCMonth() + 1;
  const seasonal = product.seasonStart && product.seasonEnd;
  const inSeasonNow = inSeason(product.seasonStart, product.seasonEnd, month);

  return (
    <div className="space-y-5">
      <Link href="/bazar" className="inline-block font-bold text-kerpic">
        ← Bazar
      </Link>

      <header className="flex items-center gap-4">
        <span className="text-6xl" aria-hidden>
          {CATEGORY_META[product.category].icon}
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold">{product.name}</h1>
          <p className="text-ink-soft">{CATEGORY_META[product.category].label}</p>
        </div>
      </header>

      <p className="text-2xl font-bold text-kerpic">
        {product.price !== undefined
          ? `${product.price} AZN${product.unit ? ` / ${product.unit}` : ""}`
          : "Qiymət razılaşma ilə"}
      </p>

      {seasonal && (
        <p
          className={`rounded-xl border p-3 ${
            inSeasonNow
              ? "border-zeytun bg-zeytun/10"
              : "border-line bg-surface-2 text-ink-soft"
          }`}
        >
          🌱 Mövsüm: {MONTHS[product.seasonStart! - 1]} — {MONTHS[product.seasonEnd! - 1]}
          {!inSeasonNow && " (hazırda mövsümü deyil)"}
        </p>
      )}

      {product.description && (
        <p className="leading-relaxed">{product.description}</p>
      )}

      {/* İstehsalçı kartı — əsas yol: zəng */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          İstehsalçı
        </p>
        <p className="mt-1 text-lg font-bold">{product.producer.name}</p>
        {product.producer.description && (
          <p className="mt-1 text-ink-soft">{product.producer.description}</p>
        )}
        <a
          href={`tel:${product.producer.phone}`}
          className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          📞 Zəng et
        </a>
        <p className="mt-2 text-center text-sm text-ink-soft">
          {product.producer.phone}
        </p>
      </section>

      <p className="simple-hide text-sm text-ink-soft">
        Sifariş və çatdırılma şərtlərini istehsalçı ilə telefonla razılaşdırın.
        Onlayn sifariş imkanı hazırlanır.
      </p>
    </div>
  );
}
