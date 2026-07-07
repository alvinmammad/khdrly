import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import RouteForm from "../RouteForm";
import { deleteRoute } from "../actions";

export const metadata: Metadata = {
  title: "Marşruta düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditRoutePage({
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
    .from("transport_routes")
    .select("id, title, schedule, driver_name, phone, note, sort_order, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Marşruta düzəliş</h1>

      <RouteForm
        xeta={xeta}
        defaults={{
          id: data.id,
          title: data.title,
          schedule: data.schedule,
          driverName: data.driver_name,
          phone: data.phone,
          note: data.note,
          sortOrder: data.sort_order,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Marşrutu sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">Bu əməliyyat geri qaytarıla bilməz.</p>
          <form action={deleteRoute}>
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
