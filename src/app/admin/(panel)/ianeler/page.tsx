import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "İanələr — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  donor_display: string;
  amount: number | null;
  in_kind: string | null;
  purpose: string;
  donated_at: string;
  status: string;
};

export default async function AdminDonationsPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("donations")
    .select("id, donor_display, amount, in_kind, purpose, donated_at, status")
    .order("donated_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">İanə reyestri</h1>
        <Link
          href="/admin/ianeler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni ianə
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ ianə qeydi yoxdur.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((d) => (
            <li key={d.id}>
              <Link
                href={`/admin/ianeler/${d.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <span>
                  <span className="block font-bold">
                    {d.donor_display} —{" "}
                    {d.amount !== null ? `${d.amount} AZN` : d.in_kind}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {d.purpose} · {formatDate(d.donated_at)}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    d.status === "approved"
                      ? "bg-zeytun/15 text-zeytun"
                      : "bg-surface-2 text-ink-soft"
                  }`}
                >
                  {d.status === "approved" ? "Reyestrdə" : "Qaralama"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
