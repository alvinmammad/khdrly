import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ORDER_STATUS_META } from "@/lib/sifarisMeta";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sifarişlər — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  buyer_name: string;
  quantity_note: string | null;
  status: string;
  created_at: string;
  product: { name: string; producer: { name: string } | null } | null;
};

export default async function AdminOrdersPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("orders")
    .select(
      "id, buyer_name, quantity_note, status, created_at, product:products(name, producer:producers(name))"
    )
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as unknown as Row[];
  const active = rows.filter((r) => ORDER_STATUS_META[r.status]?.active);
  const closed = rows.filter((r) => !ORDER_STATUS_META[r.status]?.active);

  const OrderLink = ({ o }: { o: Row }) => {
    const meta = ORDER_STATUS_META[o.status];
    return (
      <Link
        href={`/admin/sifarisler/${o.id}`}
        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
      >
        <span>
          <span className="block font-bold">
            {o.product?.name ?? "Məhsul"}
            {o.quantity_note ? ` — ${o.quantity_note}` : ""}
          </span>
          <span className="text-sm text-ink-soft">
            {o.buyer_name} · {o.product?.producer?.name ?? "—"} ·{" "}
            {formatDateTime(o.created_at)}
          </span>
        </span>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
            meta?.active ? "bg-zeytun/15 text-zeytun" : "bg-surface-2 text-ink-soft"
          }`}
        >
          {meta?.icon} {meta?.label ?? o.status}
        </span>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Sifarişlər</h1>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">
          Aktiv ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-center text-ink-soft">
            Aktiv sifariş yoxdur.
          </p>
        ) : (
          <ul className="space-y-2">
            {active.map((o) => (
              <li key={o.id}>
                <OrderLink o={o} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">
            Bağlanmışlar ({closed.length})
          </h2>
          <ul className="space-y-2">
            {closed.map((o) => (
              <li key={o.id}>
                <OrderLink o={o} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
