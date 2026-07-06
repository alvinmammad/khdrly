import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tədbirlər — idarəetmə",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Qaralama",
  pending: "Gözləyir",
  approved: "Dərc olunub",
  rejected: "Rədd edilib",
};

type Row = {
  id: string;
  title: string;
  location: string | null;
  starts_at: string;
  status: string;
};

export default async function AdminEventsPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("events")
    .select("id, title, location, starts_at, status")
    .order("starts_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Tədbirlər</h1>
        <Link
          href="/admin/tedbirler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni tədbir
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ tədbir yoxdur. İlk tədbiri “+ Yeni tədbir” ilə yaradın.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((e) => (
            <li key={e.id}>
              <Link
                href={`/admin/tedbirler/${e.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <span>
                  <span className="block font-bold">{e.title}</span>
                  <span className="text-sm text-ink-soft">
                    {formatDateTime(e.starts_at)}
                    {e.location ? ` · ${e.location}` : ""}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    e.status === "approved"
                      ? "bg-zeytun/15 text-zeytun"
                      : "bg-surface-2 text-ink-soft"
                  }`}
                >
                  {STATUS_LABEL[e.status] ?? e.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
