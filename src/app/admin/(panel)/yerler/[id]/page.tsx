import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import PlaceForm from "../PlaceForm";
import { deletePlace } from "../actions";

export const metadata: Metadata = {
  title: "Yerə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditPlacePage({
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
    .from("places")
    .select("id, name, type, lat, lng, body, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Yerə düzəliş</h1>

      <PlaceForm
        xeta={xeta}
        defaults={{
          id: data.id,
          name: data.name,
          type: data.type,
          lat: data.lat,
          lng: data.lng,
          body: data.body,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Yeri sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Yer xəritədən və bazadan tam silinəcək.
          </p>
          <form action={deletePlace}>
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
