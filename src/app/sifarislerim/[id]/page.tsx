import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { ORDER_STATUS_META } from "@/lib/sifarisMeta";
import { formatDateTime } from "@/lib/format";
import { cancelOrder, sendOrderMessage } from "../actions";

export const metadata: Metadata = {
  title: "Sifariş",
  robots: { index: false, follow: false },
};

type OrderRow = {
  id: string;
  buyer_id: string;
  quantity_note: string | null;
  note: string | null;
  status: string;
  created_at: string;
  product: { id: string; name: string } | null;
};

type Msg = {
  id: string;
  sender_id: string;
  sender_name: string;
  is_staff: boolean;
  body: string;
  created_at: string;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/bazar");

  const user = await getSessionUser();
  const { id } = await params;
  if (!user) redirect(`/giris?next=/sifarislerim/${id}`);

  const [{ data: order }, { data: msgs }] = await Promise.all([
    sb
      .from("orders")
      .select("id, buyer_id, quantity_note, note, status, created_at, product:products(id, name)")
      .eq("id", id)
      .maybeSingle(),
    sb
      .from("order_messages")
      .select("id, sender_id, sender_name, is_staff, body, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);
  if (!order) notFound();

  const o = order as unknown as OrderRow;
  const messages = (msgs ?? []) as Msg[];
  const meta = ORDER_STATUS_META[o.status];

  return (
    <div className="space-y-5">
      <Link href="/sifarislerim" className="inline-block font-bold text-kerpic">
        ← Sifarişlərim
      </Link>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-xl font-bold">
            {o.product?.name ?? "Məhsul"}
            {o.quantity_note ? ` — ${o.quantity_note}` : ""}
          </h1>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
              meta?.active ? "bg-zeytun/15 text-zeytun" : "bg-surface-2 text-ink-soft"
            }`}
          >
            {meta?.icon} {meta?.label ?? o.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">{formatDateTime(o.created_at)}</p>
        {o.note && <p className="mt-2 text-ink-soft">Qeyd: {o.note}</p>}

        {o.status === "yeni" && (
          <form action={cancelOrder} className="mt-3">
            <input type="hidden" name="id" value={o.id} />
            <button className="min-h-11 rounded-xl border border-nar px-4 text-sm font-medium text-nar">
              Sifarişi ləğv et
            </button>
          </form>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold">💬 Yazışma</h2>
        {messages.length === 0 && (
          <p className="text-ink-soft">
            Sualınız varsa yazın — icra nümayəndəliyi cavablandıracaq.
          </p>
        )}
        <ul className="space-y-2">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`max-w-[85%] rounded-2xl border p-3 ${
                m.sender_id === user.id
                  ? "ml-auto border-kerpic/40 bg-kerpic/10"
                  : "border-line bg-surface"
              }`}
            >
              <p className="whitespace-pre-line">{m.body}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {m.is_staff ? "🏛 " : ""}{m.sender_name} · {formatDateTime(m.created_at)}
              </p>
            </li>
          ))}
        </ul>

        <form action={sendOrderMessage} className="flex gap-2">
          <input type="hidden" name="order_id" value={o.id} />
          <input type="hidden" name="back" value={`/sifarislerim/${o.id}`} />
          <input
            type="text"
            name="body"
            required
            maxLength={1000}
            placeholder="Mesaj yazın..."
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
