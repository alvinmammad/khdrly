import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { approveMedia, deleteMedia, rejectMedia } from "./actions";

export const metadata: Metadata = {
  title: "Media moderasiyası — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  title: string;
  description: string | null;
  taken_period: string | null;
  storage_path: string;
  uploader_name: string | null;
  status: string;
  created_at: string;
};

function MediaCard({ item }: { item: Row }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mediaPublicUrl(item.storage_path)}
        alt={item.title}
        loading="lazy"
        className="max-h-72 w-full object-contain bg-surface-2"
      />
      <div className="space-y-2 p-4">
        <p className="font-bold">{item.title}</p>
        <p className="text-sm text-ink-soft">
          {item.taken_period ? `${item.taken_period} · ` : ""}
          {item.uploader_name ? `Paylaşdı: ${item.uploader_name} · ` : ""}
          {formatDateTime(item.created_at)}
        </p>
        {item.description && <p className="text-sm">{item.description}</p>}

        <div className="flex flex-wrap gap-2 pt-1">
          {item.status !== "approved" && (
            <form action={approveMedia}>
              <input type="hidden" name="id" value={item.id} />
              <button className="min-h-11 rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong">
                ✅ Təsdiqlə
              </button>
            </form>
          )}
          {item.status === "pending" && (
            <form action={rejectMedia}>
              <input type="hidden" name="id" value={item.id} />
              <button className="min-h-11 rounded-xl border border-line bg-surface-2 px-4 font-bold">
                Rədd et
              </button>
            </form>
          )}
          <form action={deleteMedia}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="storage_path" value={item.storage_path} />
            <button className="min-h-11 rounded-xl border border-nar px-4 font-medium text-nar">
              Sil (fayl da silinir)
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta } = await searchParams;

  const { data, error } = await sb
    .from("media_items")
    .select("id, title, description, taken_period, storage_path, uploader_name, status, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];
  const pending = rows.filter((r) => r.status === "pending");
  const approved = rows.filter((r) => r.status === "approved");
  const rejected = rows.filter((r) => r.status === "rejected");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Media moderasiyası</h1>

      {(xeta || error) && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Əməliyyat alınmadı — səhifəni yeniləyib təkrar edin.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">
          ⏳ Gözləyənlər ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-center text-ink-soft">
            Moderasiya növbəsi boşdur.
          </p>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <MediaCard key={r.id} item={r} />
            ))}
          </ul>
        )}
      </section>

      {approved.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">
            ✅ Dərcdə ({approved.length})
          </h2>
          <ul className="space-y-3">
            {approved.map((r) => (
              <MediaCard key={r.id} item={r} />
            ))}
          </ul>
        </section>
      )}

      {rejected.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">
            🚫 Rədd edilənlər ({rejected.length})
          </h2>
          <ul className="space-y-3">
            {rejected.map((r) => (
              <MediaCard key={r.id} item={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
