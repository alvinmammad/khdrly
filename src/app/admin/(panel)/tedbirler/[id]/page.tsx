import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import EventForm from "../EventForm";
import { deleteEvent } from "../actions";

export const metadata: Metadata = {
  title: "Tədbirə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditEventPage({
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
    .from("events")
    .select("id, title, body, location, starts_at, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Tədbirə düzəliş</h1>

      <EventForm
        xeta={xeta}
        defaults={{
          id: data.id,
          title: data.title,
          body: data.body,
          location: data.location,
          startsAt: data.starts_at,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Tədbiri sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Tədbir saytdan və bazadan tam silinəcək.
          </p>
          <form action={deleteEvent}>
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
