import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";
import { deleteProduct } from "../../actions";

export const metadata: Metadata = {
  title: "Məhsula düzəliş",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const [{ id }, { xeta }] = await Promise.all([params, searchParams]);

  const [{ data }, { data: producers }] = await Promise.all([
    sb
      .from("products")
      .select(
        "id, producer_id, name, category, price, unit, description, season_start, season_end, available, status"
      )
      .eq("id", id)
      .maybeSingle(),
    sb.from("producers").select("id, name").order("name"),
  ]);
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Məhsula düzəliş</h1>

      <ProductForm
        xeta={xeta}
        producers={producers ?? []}
        defaults={{
          id: data.id,
          producerId: data.producer_id,
          name: data.name,
          category: data.category,
          price: data.price,
          unit: data.unit,
          description: data.description,
          seasonStart: data.season_start,
          seasonEnd: data.season_end,
          available: data.available,
          status: data.status,
        }}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-bold">Məhsulu sil</summary>
        <div className="mt-3 space-y-3">
          <p className="text-ink-soft">
            Bu əməliyyat geri qaytarıla bilməz. Müvəqqəti gizlətmək üçün
            "Satışdadır" işarəsini götürmək kifayətdir.
          </p>
          <form action={deleteProduct}>
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
