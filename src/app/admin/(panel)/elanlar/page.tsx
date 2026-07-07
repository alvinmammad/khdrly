import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { LISTING_META } from "@/lib/elanMeta";
import { formatDate } from "@/lib/format";
import type { ListingType } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Elanlar — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  type: string;
  title: string;
  valid_to: string | null;
  status: string;
  created_at: string;
};

export default async function AdminListingsPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("listings")
    .select("id, type, title, valid_to, status, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];
  const now = new Date().toISOString();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Elanlar</h1>
        <Link
          href="/admin/elanlar/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni elan
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ elan yoxdur.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((l) => {
            const expired = l.valid_to !== null && l.valid_to < now;
            const meta = LISTING_META[l.type as ListingType];
            return (
              <li key={l.id}>
                <Link
                  href={`/admin/elanlar/${l.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span>
                    <span className="block font-bold">
                      <span aria-hidden>{meta?.icon}</span> {l.title}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {meta?.label ?? l.type} · {formatDate(l.created_at)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      l.status === "approved" && !expired
                        ? "bg-zeytun/15 text-zeytun"
                        : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {l.status !== "approved"
                      ? "Qaralama"
                      : expired
                        ? "Bitib"
                        : "Dərcdə"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
