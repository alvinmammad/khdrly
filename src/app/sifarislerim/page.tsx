import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { ORDER_STATUS_META } from "@/lib/sifarisMeta";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sifarişlərim",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  quantity_note: string | null;
  status: string;
  created_at: string;
  product: { name: string } | null;
};

export default async function MyOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/bazar");

  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/sifarislerim");

  const [{ ok }, { data }] = await Promise.all([
    searchParams,
    sb
      .from("orders")
      .select("id, quantity_note, status, created_at, product:products(name)")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">🛒 Sifarişlərim</h1>

      {ok && (
        <p className="rounded-xl border-2 border-zeytun bg-zeytun/10 p-4 font-medium">
          ✅ Sifarişiniz qəbul olundu! Tezliklə sizinlə əlaqə saxlanılacaq —
          gedişatı buradan izləyə bilərsiniz.
        </p>
      )}

      {rows.length === 0 && !ok ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🧺</p>
          <p className="mt-3 text-xl font-bold">Hələ sifarişiniz yoxdur</p>
          <Link
            href="/bazar"
            className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white"
          >
            Bazara bax
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((o) => {
            const meta = ORDER_STATUS_META[o.status];
            return (
              <li key={o.id}>
                <Link
                  href={`/sifarislerim/${o.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 active:bg-surface-2"
                >
                  <span>
                    <span className="block font-bold">
                      {o.product?.name ?? "Məhsul"}
                      {o.quantity_note ? ` — ${o.quantity_note}` : ""}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {formatDate(o.created_at)}
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
