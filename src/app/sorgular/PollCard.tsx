"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";

export type Poll = {
  id: string;
  question: string;
  options: string[];
  closesAt: string | null;
};

/*
  Sorğu kartı: səslər client tərəfdə oxunur/verilir ki, səhifə statik
  qalsın. Bir istifadəçi — bir səs (yenidən basanda dəyişir).
  Bağlanmış sorğuda yalnız nəticə görünür.
*/
export default function PollCard({ poll }: { poll: Poll }) {
  const [counts, setCounts] = useState<number[] | null>(null);
  const [mine, setMine] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const closed = poll.closesAt !== null && new Date(poll.closesAt) < new Date();

  useEffect(() => {
    const sb = getSupabaseBrowserAuth();
    if (!sb) return;
    (async () => {
      const [{ data: votes }, { data: auth }] = await Promise.all([
        sb.from("poll_votes").select("option_index, user_id").eq("poll_id", poll.id),
        sb.auth.getUser(),
      ]);
      const c = poll.options.map(() => 0);
      for (const v of votes ?? []) {
        if (v.option_index >= 0 && v.option_index < c.length) c[v.option_index] += 1;
      }
      setCounts(c);
      const uid = auth.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const my = (votes ?? []).find((v) => v.user_id === uid);
        setMine(my ? my.option_index : null);
      }
    })();
  }, [poll.id, poll.options]);

  async function vote(index: number) {
    const sb = getSupabaseBrowserAuth();
    if (!sb || closed) return;
    if (!userId) {
      window.location.href = `/giris?next=/sorgular`;
      return;
    }
    setBusy(true);
    const { error } = await sb
      .from("poll_votes")
      .upsert(
        { poll_id: poll.id, user_id: userId, option_index: index },
        { onConflict: "poll_id,user_id" }
      );
    if (!error && counts) {
      const next = [...counts];
      if (mine !== null) next[mine] = Math.max(0, next[mine] - 1);
      next[index] += 1;
      setCounts(next);
      setMine(index);
    }
    setBusy(false);
  }

  const total = counts?.reduce((s, n) => s + n, 0) ?? 0;
  const showResults = closed || mine !== null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-lg font-bold leading-snug">{poll.question}</p>
      {closed && (
        <p className="mt-1 text-sm font-bold text-ink-soft">
          Sorğu bağlanıb — nəticə:
        </p>
      )}

      <div className="mt-3 space-y-2">
        {poll.options.map((opt, i) => {
          const n = counts?.[i] ?? 0;
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          return (
            <button
              key={i}
              type="button"
              disabled={busy || closed}
              onClick={() => vote(i)}
              className={`relative block min-h-12 w-full overflow-hidden rounded-xl border-2 px-4 py-2.5 text-left font-medium ${
                mine === i ? "border-kerpic" : "border-line"
              }`}
            >
              {showResults && (
                <span
                  aria-hidden
                  style={{ width: `${pct}%` }}
                  className="absolute inset-y-0 left-0 bg-kerpic/15"
                />
              )}
              <span className="relative flex items-center justify-between gap-2">
                <span>
                  {mine === i ? "✅ " : ""}
                  {opt}
                </span>
                {showResults && (
                  <span className="shrink-0 text-sm font-bold text-ink-soft">
                    {pct}% ({n})
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-sm text-ink-soft">
        {total} səs
        {!userId && !closed ? " · səs vermək üçün giriş lazımdır" : ""}
        {mine !== null && !closed ? " · seçiminizi dəyişə bilərsiniz" : ""}
      </p>
    </div>
  );
}
