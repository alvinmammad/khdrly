import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import ProducerForm from "../ProducerForm";
import { deleteProducer } from "../../actions";

export const metadata: Metadata = {
  title: "İstehsalçıya düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditProducerPage({
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
    .from("producers")
    .select("id, name, phone, description, is_flagship, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">İstehsalçıya düzəliş</h1>

      <ProducerForm
        xeta={xeta}
        defaults={{
          id: data.id,
          name: data.name,
          phone: data.phone,
          description: data.description,
          isFlagship: data.is_flagship,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">İstehsalçını sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz — istehsalçı ilə birlikdə{" "}
            <strong>bütün məhsulları da silinir</strong>. Müvəqqəti gizlətmək
            üçün vəziyyəti "Qaralama" edin.
          </p>
          <form action={deleteProducer}>
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
