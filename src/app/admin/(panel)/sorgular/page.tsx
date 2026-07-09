import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { closePoll, createPoll, deletePoll } from "./actions";

export const metadata: Metadata = {
  title: "Sorğular — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  question: string;
  options: string[];
  closes_at: string | null;
  created_at: string;
};

export default async function AdminPollsPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta } = await searchParams;
  const { data } = await sb
    .from("polls")
    .select("id, question, options, closes_at, created_at")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  const now = new Date().toISOString();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">🗳️ Sorğular</h1>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Sual ən azı 5 hərf, variantlar ən azı 2 sətir olmalıdır.
        </p>
      )}

      <form
        action={createPoll}
        className="space-y-3 rounded-2xl border border-line bg-surface p-4"
      >
        <p className="font-bold">+ Yeni sorğu</p>
        <input
          type="text"
          name="question"
          required
          maxLength={200}
          placeholder="Sual: Kənd meydanına nə əkilsin?"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <textarea
          name="options"
          required
          rows={4}
          placeholder={"Hər sətirdə bir variant:\nÇinar\nTut ağacı\nGül kolları"}
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Bağlanma vaxtı (istəyə bağlı, Bakı vaxtı)
          </span>
          <input
            type="datetime-local"
            name="closes_at"
            className="w-full rounded-xl border border-line bg-surface p-3"
          />
        </label>
        <button className="min-h-12 w-full rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong">
          Sorğunu aç
        </button>
      </form>

      <ul className="space-y-3">
        {rows.map((p) => {
          const closed = p.closes_at !== null && p.closes_at < now;
          return (
            <li key={p.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold">{p.question}</p>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    closed ? "bg-surface-2 text-ink-soft" : "bg-zeytun/15 text-zeytun"
                  }`}
                >
                  {closed ? "Bağlı" : "Açıq"}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {p.options.join(" · ")} · {formatDateTime(p.created_at)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!closed && (
                  <form action={closePoll}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="min-h-11 rounded-xl border border-line bg-surface-2 px-4 font-bold">
                      Sorğunu bağla
                    </button>
                  </form>
                )}
                <form action={deletePoll}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="min-h-11 rounded-xl border border-nar px-4 font-medium text-nar">
                    Sil
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
