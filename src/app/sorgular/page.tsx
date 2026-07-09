import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase/client";
import PollCard, { type Poll } from "./PollCard";

export const metadata: Metadata = { title: "Sorğular" };

export const revalidate = 120;

type Row = {
  id: string;
  question: string;
  options: string[];
  closes_at: string | null;
};

async function getPolls(): Promise<Poll[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("polls")
    .select("id, question, options, closes_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);
  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id,
    question: r.question,
    options: r.options,
    closesAt: r.closes_at,
  }));
}

export default async function PollsPage() {
  const polls = await getPolls();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-bold">🗳️ Kənd sorğuları</h1>
        <p className="mt-2 text-ink-soft">
          Kəndlə bağlı qərarlar qabağı fikriniz soruşulur — nəticələr hamıya
          açıqdır.
        </p>
      </header>

      {polls.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🗳️</p>
          <p className="mt-3 text-xl font-bold">Hazırda aktiv sorğu yoxdur</p>
          <p className="mt-2 text-ink-soft">
            Yeni sorğu açılanda burada görünəcək.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((p) => (
            <PollCard key={p.id} poll={p} />
          ))}
        </div>
      )}
    </div>
  );
}
