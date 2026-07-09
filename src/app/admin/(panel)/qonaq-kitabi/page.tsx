import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { moderateGuestEntry } from "./actions";

export const metadata: Metadata = {
  title: "Qonaq kitabı — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  name: string | null;
  message: string;
  status: string;
  created_at: string;
};

function EntryCard({ item }: { item: Row }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <p className="leading-relaxed">"{item.message}"</p>
      <p className="mt-1 text-sm text-ink-soft">
        — {item.name || "Qonaq"} · {formatDateTime(item.created_at)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.status !== "approved" && (
          <form action={moderateGuestEntry}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="emel" value="tesdiq" />
            <button className="min-h-11 rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong">
              ✅ Təsdiqlə
            </button>
          </form>
        )}
        {item.status === "pending" && (
          <form action={moderateGuestEntry}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="emel" value="redd" />
            <button className="min-h-11 rounded-xl border border-line bg-surface-2 px-4 font-bold">
              Rədd et
            </button>
          </form>
        )}
        <form action={moderateGuestEntry}>
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

export default async function AdminGuestBookPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("guest_entries")
    .select("id, name, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];
  const pending = rows.filter((r) => r.status === "pending");
  const other = rows.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Qonaq kitabı</h1>

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
              <EntryCard key={r.id} item={r} />
            ))}
          </ul>
        )}
      </section>

      {other.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">Baxılmışlar</h2>
          <ul className="space-y-3">
            {other.map((r) => (
              <EntryCard key={r.id} item={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
