import type { Metadata } from "next";
import Link from "next/link";
import { getMarketItems } from "@/lib/data";
import { MARKET_CATEGORY_META, MARKET_CATEGORIES } from "@/lib/alverMeta";
import { formatDate } from "@/lib/format";
import SmartImage from "@/components/ui/SmartImage";
import type { MarketCategory } from "@/lib/data/types";

export const metadata: Metadata = { title: "Al-ver" };

export const revalidate = 120;

export default async function AlVerPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string }>;
}) {
  const { kat } = await searchParams;
  const active = MARKET_CATEGORIES.includes(kat as MarketCategory)
    ? (kat as MarketCategory)
    : undefined;
  const items = await getMarketItems(active);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">🏷️ Al-ver</h1>
        <Link
          href="/al-ver/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Elan yerləşdir
        </Link>
      </div>
      <p className="text-ink-soft">
        Sakinlərin öz aralarında alış-veriş, alət-əşya, icarə. Elanı özünüz
        yerləşdirin — dərhal görünür.
      </p>

      {/* Kateqoriya süzgəci */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/al-ver"
          className={`flex min-h-10 items-center rounded-full border px-4 font-medium ${
            !active ? "border-kerpic bg-kerpic/10 text-kerpic" : "border-line bg-surface"
          }`}
        >
          Hamısı
        </Link>
        {MARKET_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/al-ver?kat=${c}`}
            className={`flex min-h-10 items-center gap-1.5 rounded-full border px-4 font-medium ${
              active === c ? "border-kerpic bg-kerpic/10 text-kerpic" : "border-line bg-surface"
            }`}
          >
            <span aria-hidden>{MARKET_CATEGORY_META[c].icon}</span>
            {MARKET_CATEGORY_META[c].label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🏷️</p>
          <p className="mt-3 text-xl font-bold">
            {active ? "Bu kateqoriyada elan yoxdur" : "Hələ elan yoxdur"}
          </p>
          <p className="mt-2 text-ink-soft">
            İlk elanı siz yerləşdirin — bir şey satır, axtarır və ya icarəyə
            verirsinizsə.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => {
            const meta = MARKET_CATEGORY_META[it.category];
            return (
              <li key={it.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                {it.photoUrl && (
                  <SmartImage
                    src={it.photoUrl}
                    alt={it.title}
                    className="max-h-64 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-bold">
                      <span aria-hidden>{meta.icon}</span> {it.title}
                    </p>
                    {meta.hasPrice && it.price !== undefined && (
                      <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 font-bold text-kerpic">
                        {it.price} AZN
                      </span>
                    )}
                  </div>
                  <p className="mt-2 leading-relaxed">{it.body}</p>
                  <p className="mt-2 text-sm text-ink-soft">
                    {meta.label} · {it.authorName} · {formatDate(it.createdAt)}
                  </p>
                  <a
                    href={`tel:${it.phone}`}
                    className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
                  >
                    📞 Zəng et
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="simple-hide rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Elanlar 30 gün sonra avtomatik silinir. Öz elanlarınızı{" "}
        <Link href="/al-ver/menimkiler" className="font-bold text-kerpic">
          Elanlarım
        </Link>{" "}
        bölməsindən idarə edə bilərsiniz.
      </p>
    </div>
  );
}
