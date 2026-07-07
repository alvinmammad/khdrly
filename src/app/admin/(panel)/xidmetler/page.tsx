import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { SERVICE_META } from "@/lib/xidmetMeta";
import type { ServiceCategory } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Xidmətlər — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  name: string;
  category: string;
  phone: string;
  status: string;
};

export default async function AdminServicesPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("service_providers")
    .select("id, name, category, phone, status")
    .order("category")
    .order("name");

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Xidmətlər</h1>
        <Link
          href="/admin/xidmetler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni xidmətçi
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ xidmətçi yoxdur.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((s) => {
            const meta = SERVICE_META[s.category as ServiceCategory];
            return (
              <li key={s.id}>
                <Link
                  href={`/admin/xidmetler/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{meta?.icon ?? "🧰"}</span>
                    <span>
                      <span className="block font-bold">{s.name}</span>
                      <span className="text-sm text-ink-soft">
                        {meta?.label ?? s.category} · {s.phone}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      s.status === "approved"
                        ? "bg-zeytun/15 text-zeytun"
                        : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {s.status === "approved" ? "Kataloqda" : "Qaralama"}
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
