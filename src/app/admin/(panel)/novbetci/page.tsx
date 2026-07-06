import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Növbətçi məlumatlar — idarəetmə",
  robots: { index: false, follow: false },
};

const TYPE_LABEL: Record<string, string> = {
  aptek: "💊 Aptek",
  feldser: "🩺 Feldşer",
  elektrik: "⚡ Elektrik",
  su: "🚰 Su",
};

type Row = {
  id: string;
  type: string;
  title: string;
  is_alert: boolean;
  valid_from: string;
  valid_to: string | null;
};

export default async function AdminDutyPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("duty_info")
    .select("id, type, title, is_alert, valid_from, valid_to")
    .order("valid_from", { ascending: false });

  const rows = (data ?? []) as Row[];
  const now = new Date().toISOString();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Növbətçi məlumatlar</h1>
        <Link
          href="/admin/novbetci/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni məlumat
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ məlumat yoxdur. İlk yazını “+ Yeni məlumat” ilə yaradın.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((d) => {
            const expired = d.valid_to !== null && d.valid_to < now;
            return (
              <li key={d.id}>
                <Link
                  href={`/admin/novbetci/${d.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span>
                    <span className="block font-bold">
                      {d.is_alert && <span aria-hidden>⚠️ </span>}
                      {d.title}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {TYPE_LABEL[d.type] ?? d.type} ·{" "}
                      {d.valid_to
                        ? `${formatDateTime(d.valid_from)} — ${formatDateTime(d.valid_to)}`
                        : `${formatDateTime(d.valid_from)}-dən müddətsiz`}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      expired ? "bg-surface-2 text-ink-soft" : "bg-zeytun/15 text-zeytun"
                    }`}
                  >
                    {expired ? "Bitib" : "Aktiv"}
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
