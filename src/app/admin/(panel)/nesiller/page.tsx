import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { deleteFamily, saveFamily } from "./actions";

export const metadata: Metadata = {
  title: "Nəsillər — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  status: string;
};

export default async function AdminFamiliesPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta } = await searchParams;
  const { data } = await sb
    .from("families")
    .select("id, name, description, sort_order, status")
    .order("sort_order")
    .order("name");
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">🌳 Nəsillər</h1>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Əməliyyat alınmadı — ad boş ola bilməz.
        </p>
      )}

      {/* Yeni nəsil */}
      <form
        action={saveFamily}
        className="space-y-3 rounded-2xl border border-line bg-surface p-4"
      >
        <p className="font-bold">+ Yeni nəsil</p>
        <input
          type="text"
          name="name"
          required
          placeholder="Nəslin adı (məs. Kərbəlayılar)"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <textarea
          name="description"
          rows={3}
          placeholder="Tarixi, məhəlləsi, tanınmış üzvləri..."
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <button className="min-h-12 w-full rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong">
          Əlavə et (dərc olunur)
        </button>
      </form>

      <ul className="space-y-3">
        {rows.map((f) => (
          <li key={f.id} className="rounded-2xl border border-line bg-surface p-4">
            {/* Düzəliş — hər kart öz formasıdır */}
            <form action={saveFamily} className="space-y-2">
              <input type="hidden" name="id" value={f.id} />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={f.name}
                  className="w-full rounded-xl border border-line bg-surface p-2.5 font-bold"
                />
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={f.sort_order}
                  title="Sıra"
                  className="w-20 rounded-xl border border-line bg-surface p-2.5"
                />
              </div>
              <textarea
                name="description"
                rows={2}
                defaultValue={f.description ?? ""}
                className="w-full rounded-xl border border-line bg-surface p-2.5"
              />
              <div className="flex flex-wrap items-center gap-2">
                <select
                  name="status"
                  defaultValue={f.status === "approved" ? "approved" : "draft"}
                  className="rounded-xl border border-line bg-surface p-2.5"
                >
                  <option value="approved">Dərcdə</option>
                  <option value="draft">Qaralama</option>
                </select>
                <button className="min-h-11 rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong">
                  Yadda saxla
                </button>
              </div>
            </form>
            <form action={deleteFamily} className="mt-2">
              <input type="hidden" name="id" value={f.id} />
              <button className="text-sm font-medium text-nar">Sil</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
