import type { Metadata } from "next";
import Link from "next/link";
import { getStaffUser, getSupabaseServer } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Şəhidlər — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  full_name: string;
  death_date: string | null;
  status: string;
  family_rep_approved_at: string | null;
  admin_approved_at: string | null;
  sources: string[];
};

export default async function AdminMartyrsPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const staff = await getStaffUser();
  if (!staff?.roles.includes("admin")) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="font-bold">Yalnız admin</p>
        <p className="mt-2 text-ink-soft">
          Şəhidlər bölməsini yalnız admin rolu olan istifadəçilər idarə edə bilər.
        </p>
      </div>
    );
  }

  const { data, error } = await sb
    .from("martyrs")
    .select("id, full_name, death_date, status, family_rep_approved_at, admin_approved_at, sources")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Şəhidlər</h1>
        <Link
          href="/admin/sehidler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni profil
        </Link>
      </div>

      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Profil sayta yalnız <strong>ailə razılığı + admin təsdiqi + mənbə</strong>{" "}
        olduqda çıxır. Qaralamalar ictimai səhifədə heç vaxt görünmür.
      </p>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ profil yoxdur. Profillər ailələrin müraciəti əsasında yaradılır.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/sehidler/${m.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <span>
                  <span className="block font-bold">{m.full_name}</span>
                  <span className="text-sm text-ink-soft">
                    {m.death_date ? `Şəhidlik: ${formatDate(m.death_date)} · ` : ""}
                    Ailə {m.family_rep_approved_at ? "✓" : "—"} · Admin{" "}
                    {m.admin_approved_at ? "✓" : "—"} · Mənbə{" "}
                    {m.sources.length > 0 ? "✓" : "—"}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    m.status === "approved"
                      ? "bg-zeytun/15 text-zeytun"
                      : "bg-surface-2 text-ink-soft"
                  }`}
                >
                  {m.status === "approved" ? "Dərcdə" : "Qaralama"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
