import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import ServiceForm from "../ServiceForm";
import { deleteService } from "../actions";

export const metadata: Metadata = {
  title: "Xidmətçiyə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditServicePage({
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
    .from("service_providers")
    .select("id, name, category, phone, description, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Xidmətçiyə düzəliş</h1>

      <ServiceForm
        xeta={xeta}
        defaults={{
          id: data.id,
          name: data.name,
          category: data.category,
          phone: data.phone,
          description: data.description,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Xidmətçini sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">Bu əməliyyat geri qaytarıla bilməz.</p>
          <form action={deleteService}>
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
