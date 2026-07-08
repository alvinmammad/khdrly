import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import PersonForm from "../PersonForm";
import { deletePerson } from "../actions";

export const metadata: Metadata = {
  title: "Şəxsə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditPersonPage({
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
    .from("notable_people")
    .select("id, full_name, years_display, field, description, sources, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Şəxsə düzəliş</h1>

      <PersonForm
        xeta={xeta}
        defaults={{
          id: data.id,
          fullName: data.full_name,
          yearsDisplay: data.years_display,
          field: data.field,
          description: data.description,
          sources: data.sources ?? [],
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Yazını sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">Bu əməliyyat geri qaytarıla bilməz.</p>
          <form action={deletePerson}>
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
