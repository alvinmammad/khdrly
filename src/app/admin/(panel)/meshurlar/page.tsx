import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { PERSON_META } from "@/lib/personMeta";
import type { PersonField } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Məşhurlar — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  full_name: string;
  years_display: string | null;
  field: string;
  sources: string[];
  status: string;
};

export default async function AdminPeoplePage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("notable_people")
    .select("id, full_name, years_display, field, sources, status")
    .order("field")
    .order("full_name");

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Məşhurlarımız</h1>
        <Link
          href="/admin/meshurlar/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni şəxs
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ yazı yoxdur. Şəxslər yalnız yoxlanıla bilən mənbə ilə dərc
          olunur.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((p) => {
            const meta = PERSON_META[p.field as PersonField];
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/meshurlar/${p.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span>
                    <span className="block font-bold">
                      <span aria-hidden>{meta?.icon}</span> {p.full_name}
                      {p.years_display ? ` (${p.years_display})` : ""}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {meta?.label ?? p.field}
                      {p.sources.length > 0 ? " · mənbə ✓" : " · mənbə yoxdur"}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      p.status === "approved"
                        ? "bg-zeytun/15 text-zeytun"
                        : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {p.status === "approved" ? "Dərcdə" : "Qaralama"}
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
