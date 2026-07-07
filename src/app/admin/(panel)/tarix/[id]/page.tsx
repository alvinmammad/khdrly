import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import TimelineForm from "../TimelineForm";
import { deleteTimelineEntry } from "../actions";

export const metadata: Metadata = {
  title: "Tarix hadisəsinə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditTimelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const [{ id }, { xeta }] = await Promise.all([params, searchParams]);

  const { data } = await sb
    .from("timeline_entries")
    .select("id, era, event_date, date_display, title, body, sources, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Tarix hadisəsinə düzəliş</h1>

      <TimelineForm
        xeta={xeta}
        defaults={{
          id: data.id,
          era: data.era,
          eventDate: data.event_date,
          dateDisplay: data.date_display,
          title: data.title,
          body: data.body,
          sources: data.sources ?? [],
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Hadisəni sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">Bu əməliyyat geri qaytarıla bilməz.</p>
          <form action={deleteTimelineEntry}>
            <input type="hidden" name="id" value={data.id} />
            <button className="min-h-12 rounded-xl bg-nar px-5 font-bold text-white">
              Bəli, sil
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
