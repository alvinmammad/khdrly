import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import DutyForm from "../DutyForm";
import { deleteDuty } from "../actions";

export const metadata: Metadata = {
  title: "Növbətçi məlumatına düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditDutyPage({
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
    .from("duty_info")
    .select("id, type, title, body, phone, is_alert, valid_from, valid_to")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Növbətçi məlumatına düzəliş</h1>

      <DutyForm
        xeta={xeta}
        defaults={{
          id: data.id,
          type: data.type,
          title: data.title,
          body: data.body,
          phone: data.phone,
          isAlert: data.is_alert,
          validFrom: data.valid_from,
          validTo: data.valid_to,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Məlumatı sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Köhnəlmiş məlumatı silmək əvəzinə
            bitmə tarixi qoymaq da olar — tarixçə qalsın deyə.
          </p>
          <form action={deleteDuty}>
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
