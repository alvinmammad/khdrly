import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/data";
import { MARKET_CATEGORY_META } from "@/lib/alverMeta";
import { formatDateTime } from "@/lib/format";
import type { MarketCategory } from "@/lib/data/types";
import { removeMarketItem } from "./actions";

export const metadata: Metadata = {
  title: "Al-ver — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  category: string;
  title: string;
  body: string;
  price: number | null;
  photo_path: string | null;
  phone: string;
  author_name: string;
  valid_to: string | null;
  created_at: string;
};

export default async function AdminAlVerPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("market_items")
    .select("id, category, title, body, price, photo_path, phone, author_name, valid_to, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data ?? []) as Row[];
  const now = new Date().toISOString();

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold">🏷️ Al-ver elanları</h1>
      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Elanlar sakinlər tərəfindən dərhal dərc olunur. Buradan yalnız yersiz
        və ya qaydalara zidd olanları silin.
      </p>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ elan yoxdur.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const meta = MARKET_CATEGORY_META[r.category as MarketCategory];
            const expired = r.valid_to !== null && r.valid_to < now;
            return (
              <li key={r.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">
                    <span aria-hidden>{meta?.icon}</span> {r.title}
                    {meta?.hasPrice && r.price !== null ? ` — ${r.price} AZN` : ""}
                  </p>
                  {expired && (
                    <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-sm font-bold text-ink-soft">
                      vaxtı bitib
                    </span>
                  )}
                </div>
                <p className="mt-1">{r.body}</p>
                {r.photo_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPublicUrl(r.photo_path)}
                    alt={r.title}
                    loading="lazy"
                    className="mt-2 max-h-56 rounded-xl object-cover"
                  />
                )}
                <p className="mt-1 text-sm text-ink-soft">
                  {meta?.label} · {r.author_name} · 📞 {r.phone} ·{" "}
                  {formatDateTime(r.created_at)}
                </p>
                <form action={removeMarketItem} className="mt-3">
                  <input type="hidden" name="id" value={r.id} />
                  <button className="min-h-11 rounded-xl border border-nar px-4 font-medium text-nar">
                    Sil (foto da silinir)
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
