import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/data";
import UploadThenNow from "./UploadThenNow";
import { deleteThenNow, toggleThenNow } from "./actions";

export const metadata: Metadata = {
  title: "Onda və indi — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  title: string;
  note: string | null;
  before_path: string;
  after_path: string;
  status: string;
};

export default async function AdminThenNowPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("then_now")
    .select("id, title, note, before_path, after_path, status")
    .order("sort_order")
    .order("created_at");
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">↔️ Onda və indi</h1>
      <p className="text-ink-soft">
        Dağıntı/bərpa foto müqayisələri — media arxivi səhifəsində slider
        kimi görünür.
      </p>

      <UploadThenNow />

      {rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((t) => (
            <li key={t.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold">
                  {t.title}
                  {t.note ? <span className="text-ink-soft"> · {t.note}</span> : ""}
                </p>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    t.status === "approved"
                      ? "bg-zeytun/15 text-zeytun"
                      : "bg-surface-2 text-ink-soft"
                  }`}
                >
                  {t.status === "approved" ? "Dərcdə" : "Qaralama"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaPublicUrl(t.before_path)}
                  alt={`${t.title} — onda`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaPublicUrl(t.after_path)}
                  alt={`${t.title} — indi`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={toggleThenNow}>
                  <input type="hidden" name="id" value={t.id} />
                  <input
                    type="hidden"
                    name="to"
                    value={t.status === "approved" ? "draft" : "approved"}
                  />
                  <button className="min-h-11 rounded-xl border border-line bg-surface-2 px-4 font-bold">
                    {t.status === "approved" ? "Dərcdən çıxar" : "Dərc et"}
                  </button>
                </form>
                <form action={deleteThenNow}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="min-h-11 rounded-xl border border-nar px-4 font-medium text-nar">
                    Sil (şəkillər də silinir)
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
