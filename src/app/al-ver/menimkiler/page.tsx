import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, getSupabaseServer } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/data";
import { MARKET_CATEGORY_META } from "@/lib/alverMeta";
import { formatDate } from "@/lib/format";
import type { MarketCategory } from "@/lib/data/types";
import { deleteMarketItem } from "../actions";

export const metadata: Metadata = {
  title: "Elanlarım",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  category: string;
  title: string;
  photo_path: string | null;
  valid_to: string | null;
  created_at: string;
};

export default async function MyMarketItemsPage() {
  const sb = await getSupabaseServer();
  if (!sb) redirect("/al-ver");

  const user = await getSessionUser();
  if (!user) redirect("/giris?next=/al-ver/menimkiler");

  const { data } = await sb
    .from("market_items")
    .select("id, category, title, photo_path, valid_to, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  const now = new Date().toISOString();

  return (
    <div className="space-y-5">
      <Link href="/al-ver" className="inline-block font-bold text-kerpic">
        ← Al-ver
      </Link>
      <h1 className="font-heading text-2xl font-bold">🏷️ Elanlarım</h1>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🏷️</p>
          <p className="mt-3 text-xl font-bold">Hələ elanınız yoxdur</p>
          <Link
            href="/al-ver/yeni"
            className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white"
          >
            + Elan yerləşdir
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const meta = MARKET_CATEGORY_META[r.category as MarketCategory];
            const expired = r.valid_to !== null && r.valid_to < now;
            return (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
              >
                {r.photo_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPublicUrl(r.photo_path)}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-2xl" aria-hidden>
                    {meta?.icon ?? "🏷️"}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{r.title}</p>
                  <p className="text-sm text-ink-soft">
                    {meta?.label} · {formatDate(r.created_at)}
                    {expired ? " · vaxtı bitib" : ""}
                  </p>
                </div>
                <form action={deleteMarketItem}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="shrink-0 rounded-xl border border-nar px-4 py-2 text-sm font-medium text-nar">
                    Sil
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
