import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ORDER_STATUS_META, ORDER_STATUSES } from "@/lib/sifarisMeta";
import { formatDateTime } from "@/lib/format";
import { sendOrderMessage } from "@/app/sifarislerim/actions";
import { setOrderStatus } from "../actions";

export const metadata: Metadata = {
  title: "Sifariş — idarəetmə",
  robots: { index: false, follow: false },
};

type OrderRow = {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  quantity_note: string | null;
  note: string | null;
  status: string;
  created_at: string;
  product: {
    name: string;
    producer: { name: string; phone: string } | null;
  } | null;
};

type Msg = {
  id: string;
  sender_name: string;
  is_staff: boolean;
  body: string;
  created_at: string;
};

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { id } = await params;

  const [{ data: order }, { data: msgs }] = await Promise.all([
    sb
      .from("orders")
      .select(
        "id, buyer_name, buyer_phone, quantity_note, note, status, created_at, product:products(name, producer:producers(name, phone))"
      )
      .eq("id", id)
      .maybeSingle(),
    sb
      .from("order_messages")
      .select("id, sender_name, is_staff, body, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);
  if (!order) notFound();

  const o = order as unknown as OrderRow;
  const messages = (msgs ?? []) as Msg[];

  return (
    <div className="space-y-5">
      <Link href="/admin/sifarisler" className="inline-block font-bold text-kerpic">
        ← Sifarişlər
      </Link>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h1 className="font-heading text-xl font-bold">
          {o.product?.name ?? "Məhsul"}
          {o.quantity_note ? ` — ${o.quantity_note}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{formatDateTime(o.created_at)}</p>
        {o.note && <p className="mt-2">Qeyd: {o.note}</p>}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              Alıcı
            </p>
            <p className="font-bold">{o.buyer_name}</p>
            <a href={`tel:${o.buyer_phone}`} className="font-bold text-kerpic">
              📞 {o.buyer_phone}
            </a>
          </div>
          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              İstehsalçı
            </p>
            <p className="font-bold">{o.product?.producer?.name ?? "—"}</p>
            {o.product?.producer?.phone && (
              <a
                href={`tel:${o.product.producer.phone}`}
                className="font-bold text-kerpic"
              >
                📞 {o.product.producer.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Status idarəsi */}
      <div className="rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 font-bold">Status</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => {
            const meta = ORDER_STATUS_META[s];
            const current = s === o.status;
            return (
              <form key={s} action={setOrderStatus}>
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value={s} />
                <button
                  disabled={current}
                  className={`min-h-11 rounded-xl border px-4 font-bold ${
                    current
                      ? "border-kerpic bg-kerpic/10 text-kerpic"
                      : "border-line bg-surface-2"
                  }`}
                >
                  {meta.icon} {meta.label}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      {/* Yazışma */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold">💬 Alıcı ilə yazışma</h2>
        <ul className="space-y-2">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`max-w-[85%] rounded-2xl border p-3 ${
                m.is_staff
                  ? "ml-auto border-kerpic/40 bg-kerpic/10"
                  : "border-line bg-surface"
              }`}
            >
              <p className="whitespace-pre-line">{m.body}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {m.sender_name} · {formatDateTime(m.created_at)}
              </p>
            </li>
          ))}
        </ul>
        <form action={sendOrderMessage} className="flex gap-2">
          <input type="hidden" name="order_id" value={o.id} />
          <input type="hidden" name="back" value={`/admin/sifarisler/${o.id}`} />
          <input
            type="text"
            name="body"
            required
            maxLength={1000}
            placeholder="Alıcıya mesaj..."
            className="min-h-12 w-full rounded-xl border border-line bg-surface p-3"
          />
          <button className="min-h-12 shrink-0 rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong">
            Göndər
          </button>
        </form>
      </section>
    </div>
  );
}
