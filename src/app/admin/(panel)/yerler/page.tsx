import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { PLACE_META } from "@/lib/placeMeta";
import type { PlaceType } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Xəritə yerləri — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status: string;
};

export default async function AdminPlacesPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data, error } = await sb
    .from("places")
    .select("id, name, type, lat, lng, status")
    .order("name");

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Xəritə yerləri</h1>
        <Link
          href="/admin/yerler/yeni"
          className="flex min-h-12 items-center rounded-xl bg-kerpic px-5 font-bold text-white active:bg-kerpic-strong"
        >
          + Yeni yer
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Siyahını yükləmək alınmadı — səhifəni yeniləyin.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Hələ yer yoxdur. İlk yeri “+ Yeni yer” ilə əlavə edin.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((p) => {
            const meta = PLACE_META[p.type as PlaceType];
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/yerler/${p.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{meta?.icon ?? "📍"}</span>
                    <span>
                      <span className="block font-bold">{p.name}</span>
                      <span className="text-sm text-ink-soft">
                        {meta?.label ?? p.type} · {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      p.status === "approved"
                        ? "bg-zeytun/15 text-zeytun"
                        : "bg-surface-2 text-ink-soft"
                    }`}
                  >
                    {p.status === "approved" ? "Xəritədə" : "Qaralama"}
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
