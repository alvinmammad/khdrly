import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import DonationForm from "../DonationForm";
import { deleteDonation } from "../actions";

export const metadata: Metadata = {
  title: "İanəyə düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditDonationPage({
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
    .from("donations")
    .select("id, donor_display, amount, in_kind, purpose, donated_at, note, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">İanəyə düzəliş</h1>

      <DonationForm
        xeta={xeta}
        defaults={{
          id: data.id,
          donorDisplay: data.donor_display,
          amount: data.amount,
          inKind: data.in_kind,
          purpose: data.purpose,
          donatedAt: data.donated_at,
          note: data.note,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Qeydi sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Şəffaflıq üçün silmək əvəzinə qaralamaya keçirmək tövsiyə olunur.
          </p>
          <form action={deleteDonation}>
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
