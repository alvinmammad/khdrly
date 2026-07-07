import type { Metadata } from "next";
import { getListings } from "@/lib/data";
import { LISTING_META } from "@/lib/elanMeta";
import { formatDate } from "@/lib/format";
import type { Listing } from "@/lib/data/types";

export const metadata: Metadata = { title: "Elanlar" };

export const revalidate = 300;

function ListingCard({ item }: { item: Listing }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-bold">
          <span aria-hidden>{LISTING_META[item.type].icon}</span> {item.title}
        </p>
        <span className="shrink-0 text-sm text-ink-soft">
          {formatDate(item.createdAt)}
        </span>
      </div>
      <p className="mt-2 leading-relaxed">{item.body}</p>
      {item.phone && (
        <a
          href={`tel:${item.phone}`}
          className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
        >
          📞 Zəng et
        </a>
      )}
    </li>
  );
}

export default async function ListingsPage() {
  const listings = await getListings();
  const elanlar = listings.filter((l) => l.type === "elan");
  const itmisTapilmis = listings.filter((l) => l.type !== "elan");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Elanlar</h1>

      {listings.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>📢</p>
          <p className="mt-3 text-xl font-bold">Hazırda aktiv elan yoxdur</p>
        </div>
      )}

      {elanlar.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">📢 Kənd elanları</h2>
          <ul className="space-y-3">
            {elanlar.map((l) => (
              <ListingCard key={l.id} item={l} />
            ))}
          </ul>
        </section>
      )}

      {itmisTapilmis.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">🔍 İtmiş və tapılmış</h2>
          <ul className="space-y-3">
            {itmisTapilmis.map((l) => (
              <ListingCard key={l.id} item={l} />
            ))}
          </ul>
        </section>
      )}

      <p className="simple-hide rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Elan yerləşdirmək üçün kənd icra nümayəndəliyinə müraciət edin —
        elanınız yoxlanılıb dərc olunur.
      </p>
    </div>
  );
}
