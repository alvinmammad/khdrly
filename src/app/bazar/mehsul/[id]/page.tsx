import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import { getSupabase } from "@/lib/supabase/client";
import { CATEGORY_META, inSeason } from "@/lib/bazarMeta";
import { formatDate } from "@/lib/format";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  body: string | null;
  created_at: string;
};

async function getApprovedReviews(productId: string): Promise<Review[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("product_reviews")
    .select("id, author_name, rating, body, created_at")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as Review[];
}

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
  const reviews = await getApprovedReviews(id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

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
        <Link
          href={`/bazar/mehsul/${product.id}/sifaris`}
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-kerpic font-bold text-kerpic active:bg-kerpic/10"
        >
          🛒 Onlayn sifariş ver
        </Link>
      </section>

      <p className="simple-hide text-sm text-ink-soft">
        Ən sürətli yol zəngdir. Onlayn sifariş verəndə sizinlə telefonla
        əlaqə saxlanılıb dəqiqləşdirilir.
      </p>

      {/* Rəylər */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold">
            ⭐ Rəylər
            {avgRating !== null && (
              <span className="ml-2 text-ink-soft">
                {avgRating.toFixed(1)} / 5 ({reviews.length})
              </span>
            )}
          </h2>
          <Link
            href={`/bazar/mehsul/${product.id}/rey`}
            className="flex min-h-11 items-center rounded-xl border border-line bg-surface px-4 font-bold active:bg-surface-2"
          >
            Rəy yaz
          </Link>
        </div>
        {reviews.length === 0 ? (
          <p className="text-ink-soft">
            Hələ rəy yoxdur — ilk rəyi siz yazın.
          </p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-line bg-surface p-4">
                <p aria-label={`${r.rating} ulduz`}>{"⭐".repeat(r.rating)}</p>
                {r.body && <p className="mt-1 leading-relaxed">{r.body}</p>}
                <p className="mt-1 text-sm text-ink-soft">
                  {r.author_name} · {formatDate(r.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
