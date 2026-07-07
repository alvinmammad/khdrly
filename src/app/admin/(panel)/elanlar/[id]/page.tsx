import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import ListingForm from "../ListingForm";
import { deleteListing } from "../actions";

export const metadata: Metadata = {
  title: "Elana düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditListingPage({
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
    .from("listings")
    .select("id, type, title, body, phone, valid_to, status")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Elana düzəliş</h1>

      <ListingForm
        xeta={xeta}
        defaults={{
          id: data.id,
          type: data.type,
          title: data.title,
          body: data.body,
          phone: data.phone,
          validTo: data.valid_to,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Elanı sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Gizlətmək üçün bitmə tarixi
            qoymaq da olar.
          </p>
          <form action={deleteListing}>
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
