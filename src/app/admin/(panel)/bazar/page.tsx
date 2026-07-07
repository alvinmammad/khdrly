import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { CATEGORY_META } from "@/lib/bazarMeta";
import type { ProductCategory } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Bazar — idarəetmə",
  robots: { index: false, follow: false },
};

type ProducerRow = {
  id: string;
  name: string;
  phone: string;
  is_flagship: boolean;
  status: string;
};

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  unit: string | null;
  available: boolean;
  status: string;
  producer: { name: string } | null;
};

export default async function AdminBazarPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const [{ data: producers, error: pErr }, { data: products, error: mErr }] =
    await Promise.all([
      sb
        .from("producers")
        .select("id, name, phone, is_flagship, status")
        .order("name"),
      sb
        .from("products")
        .select("id, name, category, price, unit, available, status, producer:producers(name)")
        .order("name"),
    ]);

  const producerRows = (producers ?? []) as ProducerRow[];
  const productRows = (products ?? []) as unknown as ProductRow[];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold">İstehsalçılar</h1>
          <Link
            href="/admin/bazar/istehsalci/yeni"
            className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
          >
            + Yeni istehsalçı
          </Link>
        </div>

        {pErr && (
          <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
            Siyahını yükləmək alınmadı — səhifəni yeniləyin.
          </p>
        )}

        {producerRows.length === 0 && !pErr ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
            Hələ istehsalçı yoxdur. Əvvəlcə istehsalçı yaradın, sonra məhsul
            əlavə edin.
          </p>
        ) : (
          <ul className="space-y-2">
            {producerRows.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/bazar/istehsalci/${p.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span>
                    <span className="block font-bold">
                      {p.is_flagship && <span aria-hidden>🐃 </span>}
                      {p.name}
                    </span>
                    <span className="text-sm text-ink-soft">{p.phone}</span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      p.status === "approved"
                        ? "bg-zeytun/15 text-zeytun"
                        : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {p.status === "approved" ? "Aktiv" : "Qaralama"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl font-bold">Məhsullar</h2>
          <Link
            href="/admin/bazar/mehsul/yeni"
            className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
          >
            + Yeni məhsul
          </Link>
        </div>

        {mErr && (
          <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
            Siyahını yükləmək alınmadı — səhifəni yeniləyin.
          </p>
        )}

        {productRows.length === 0 && !mErr ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
            Hələ məhsul yoxdur.
          </p>
        ) : (
          <ul className="space-y-2">
            {productRows.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/admin/bazar/mehsul/${m.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>
                      {CATEGORY_META[m.category as ProductCategory]?.icon ?? "🧺"}
                    </span>
                    <span>
                      <span className="block font-bold">{m.name}</span>
                      <span className="text-sm text-ink-soft">
                        {m.producer?.name ?? "—"}
                        {m.price !== null ? ` · ${m.price} AZN${m.unit ? `/${m.unit}` : ""}` : ""}
                        {!m.available ? " · satışda deyil" : ""}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      m.status === "approved"
                        ? "bg-zeytun/15 text-zeytun"
                        : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {m.status === "approved" ? "Bazarda" : "Qaralama"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
