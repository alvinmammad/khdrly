import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { youtubeId } from "@/lib/data";
import { deleteVideo, saveVideo } from "./actions";

export const metadata: Metadata = {
  title: "Videolar — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  title: string;
  youtube_url: string;
  description: string | null;
};

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta } = await searchParams;
  const { data } = await sb
    .from("video_items")
    .select("id, title, youtube_url, description")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">📼 Video xatirələr</h1>
      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Videolar YouTube-da saxlanılır (pulsuz) — kanala yükləyib linkini bura
        əlavə edin. Media arxivi səhifəsində görünəcək.
      </p>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          Başlıq boş ola bilməz və link düzgün YouTube linki olmalıdır.
        </p>
      )}

      <form
        action={saveVideo}
        className="space-y-3 rounded-2xl border border-line bg-surface p-4"
      >
        <p className="font-bold">+ Yeni video</p>
        <input
          type="text"
          name="title"
          required
          placeholder="Kəndin açılış mərasimi"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <input
          type="url"
          name="youtube_url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <input
          type="text"
          name="description"
          placeholder="Qısa təsvir (istəyə bağlı)"
          className="w-full rounded-xl border border-line bg-surface p-3"
        />
        <button className="min-h-12 w-full rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong">
          Əlavə et
        </button>
      </form>

      <ul className="space-y-2">
        {rows.map((v) => (
          <li
            key={v.id}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${youtubeId(v.youtube_url) ?? ""}/default.jpg`}
              alt=""
              className="h-16 w-24 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{v.title}</p>
              {v.description && (
                <p className="truncate text-sm text-ink-soft">{v.description}</p>
              )}
            </div>
            <form action={deleteVideo}>
              <input type="hidden" name="id" value={v.id} />
              <button className="shrink-0 text-sm font-medium text-nar">Sil</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
