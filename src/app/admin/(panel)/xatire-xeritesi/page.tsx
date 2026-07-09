import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { moderateMemoryPin } from "./actions";

export const metadata: Metadata = {
  title: "Xatirə xəritəsi — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  title: string;
  body: string;
  lat: number;
  lng: number;
  author_name: string | null;
  status: string;
  created_at: string;
};

function PinCard({ item }: { item: Row }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <p className="font-bold">💭 {item.title}</p>
      <p className="mt-1 leading-relaxed">{item.body}</p>
      <p className="mt-1 text-sm text-ink-soft">
        {item.author_name ? `${item.author_name} · ` : ""}
        {formatDateTime(item.created_at)} ·{" "}
        <a
          href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-kerpic"
        >
          📍 yerinə bax
        </a>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.status !== "approved" && (
          <form action={moderateMemoryPin}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="emel" value="tesdiq" />
            <button className="min-h-11 rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong">
              ✅ Təsdiqlə
            </button>
          </form>
        )}
        {item.status === "pending" && (
          <form action={moderateMemoryPin}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="emel" value="redd" />
            <button className="min-h-11 rounded-xl border border-line bg-surface-2 px-4 font-bold">
              Rədd et
            </button>
          </form>
        )}
        <form action={moderateMemoryPin}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="emel" value="sil" />
          <button className="min-h-11 rounded-xl border border-nar px-4 font-medium text-nar">
            Sil
          </button>
        </form>
      </div>
    </li>
  );
}

export default async function AdminMemoryPinsPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("memory_pins")
    .select("id, title, body, lat, lng, author_name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data ?? []) as Row[];
  const pending = rows.filter((r) => r.status === "pending");
  const other = rows.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">💭 Xatirə xəritəsi</h1>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">
          ⏳ Gözləyənlər ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-center text-ink-soft">
            Moderasiya növbəsi boşdur.
          </p>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <PinCard key={r.id} item={r} />
            ))}
          </ul>
        )}
      </section>

      {other.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">Baxılmışlar</h2>
          <ul className="space-y-3">
            {other.map((r) => (
              <PinCard key={r.id} item={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
