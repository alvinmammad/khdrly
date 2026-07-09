"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserAuth } from "@/lib/supabase/browserAuth";

/*
  Tədbirdə "Gələcəm" düyməsi — iməcilik/yığıncaq səfərbərliyi.
  Say hamıya görünür; işarələmək üçün giriş lazımdır (girişsizlərə
  düymə giriş səhifəsinə aparır). Hər şey client tərəfdə işlədiyindən
  tədbirlər səhifəsi statik (ISR) qalır.
*/
export default function EventRsvp({ eventId }: { eventId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [mine, setMine] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowserAuth();
    if (!sb) return;
    (async () => {
      const [{ count: c }, { data }] = await Promise.all([
        sb
          .from("event_rsvps")
          .select("event_id", { count: "exact", head: true })
          .eq("event_id", eventId),
        sb.auth.getUser(),
      ]);
      setCount(c ?? 0);
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: my } = await sb
          .from("event_rsvps")
          .select("event_id")
          .eq("event_id", eventId)
          .eq("user_id", uid)
          .maybeSingle();
        setMine(Boolean(my));
      }
    })();
  }, [eventId]);

  async function toggle() {
    const sb = getSupabaseBrowserAuth();
    if (!sb) return;
    if (!userId) {
      window.location.href = `/giris?next=/tedbirler`;
      return;
    }
    setBusy(true);
    if (mine) {
      await sb.from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", userId);
      setMine(false);
      setCount((c) => Math.max(0, (c ?? 1) - 1));
    } else {
      const { error } = await sb
        .from("event_rsvps")
        .insert({ event_id: eventId, user_id: userId });
      if (!error) {
        setMine(true);
        setCount((c) => (c ?? 0) + 1);
      }
    }
    setBusy(false);
  }

  if (count === null) return null; // env yoxdursa / hələ yüklənir

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 font-bold ${
        mine
          ? "border-zeytun bg-zeytun/10 text-zeytun"
          : "border-line bg-surface-2"
      } ${busy ? "opacity-60" : ""}`}
    >
      {mine ? "✅ Gəlirəm" : "🙋 Gələcəm"}
      {count > 0 && <span>· {count} nəfər</span>}
    </button>
  );
}
