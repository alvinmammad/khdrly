import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { ERA_LABEL } from "./TimelineForm";

export const metadata: Metadata = {
  title: "Tarix xronologiyası — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  era: string;
  event_date: string;
  date_display: string | null;
  title: string;
  sources: string[];
  status: string;
};

export default async function AdminTimelinePage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("timeline_entries")
    .select("id, era, event_date, date_display, title, sources, status")
    .order("event_date", { ascending: true });

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Tarix xronologiyası</h1>
        <Link
          href="/admin/tarix/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni hadisə
        </Link>
      </div>

      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Hadisələr &quot;Azadlıq və Bərpa&quot; və &quot;İşğal dövrü&quot;
        səhifələrində dövrə görə göstərilir. İşğal dövrünə aid fakt{" "}
        <strong>mənbəsiz dərc oluna bilməz</strong>.
      </p>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ hadisə yoxdur.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((t) => (
            <li key={t.id}>
              <Link
                href={`/admin/tarix/${t.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <span>
                  <span className="block font-bold">{t.title}</span>
                  <span className="text-sm text-ink-soft">
                    {ERA_LABEL[t.era] ?? t.era} ·{" "}
                    {t.date_display ?? formatDate(t.event_date)}
                    {t.sources.length > 0 ? " · mənbə ✓" : ""}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    t.status === "approved"
                      ? "bg-zeytun/15 text-zeytun"
                      : "bg-surface-2 text-ink-soft"
                  }`}
                >
                  {t.status === "approved" ? "Dərcdə" : "Qaralama"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
