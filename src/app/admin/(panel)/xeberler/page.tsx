import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Xəbərlər — idarəetmə",
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
  status: string;
  published_at: string | null;
  created_at: string;
};

export default async function AdminNewsPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null; // layout onsuz da env mesajını göstərir

  const { data, error } = await sb
    .from("news")
    .select("id, title, status, published_at, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Xəbərlər</h1>
        <Link
          href="/admin/xeberler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni xəbər
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ xəbər yoxdur. İlk xəbəri “+ Yeni xəbər” ilə yaradın.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((n) => (
            <li key={n.id}>
              <Link
                href={`/admin/xeberler/${n.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <span>
                  <span className="block font-bold">{n.title}</span>
                  <span className="text-sm text-ink-soft">
                    {n.published_at
                      ? `Dərc: ${formatDate(n.published_at)}`
                      : `Yaradılıb: ${formatDate(n.created_at)}`}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    n.status === "approved"
                      ? "bg-zeytun/15 text-zeytun"
                      : "bg-surface-2 text-ink-soft"
                  }`}
                >
                  {STATUS_LABEL[n.status] ?? n.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
