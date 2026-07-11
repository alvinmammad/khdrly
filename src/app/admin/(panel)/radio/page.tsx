import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { deleteRadio, saveRadio } from "./actions";

export const metadata: Metadata = {
  title: "Radio — idarəetmə",
  robots: { index: false, follow: false },
};

const XETALAR: Record<string, string> = {
  bos: "Başlıq və növ boş ola bilməz.",
  youtube: "YouTube linki düzgün deyil — pleyləst (list=...) və ya video linki olmalıdır.",
  stream: "Canlı yayım linki https:// ilə başlamalıdır (http işləmir).",
};

type Row = {
  id: string;
  kind: string;
  title: string;
  url: string;
  description: string | null;
  sort_order: number;
};

export default async function AdminRadioPage({
  searchParams,
}: {
  searchParams: Promise<{ xeta?: string }>;
}) {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { xeta } = await searchParams;
  const { data } = await sb
    .from("radio_items")
    .select("id, kind, title, url, description, sort_order")
    .order("sort_order")
    .order("created_at");
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">📻 Kənd radiosu</h1>

      <div className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        <p className="font-bold">İki cür əlavə etmək olar:</p>
        <p className="mt-1">
          🎵 <strong>YouTube pleyləsti</strong> — köhnə mahnı toplusunu YouTube-da
          tapın, ünvan sətrindəki linki kopyalayın (məs.
          youtube.com/playlist?list=...). Avtomatik dalə-dalə çalacaq.
        </p>
        <p className="mt-1">
          📡 <strong>Canlı yayım</strong> — onlayn radio stansiyasının birbaşa
          yayım (stream) linki. <strong>https://</strong> ilə başlamalıdır.
        </p>
      </div>

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {XETALAR[xeta] ?? XETALAR.bos}
        </p>
      )}

      <form
        action={saveRadio}
        className="space-y-3 rounded-2xl border border-line bg-surface p-4"
      >
        <p className="font-bold">+ Yeni radio</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-medium">Növ</span>
            <select
              name="kind"
              className="w-full rounded-xl border border-line bg-surface p-3"
            >
              <option value="youtube">🎵 YouTube pleyləsti</option>
              <option value="stream">📡 Canlı yayım</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block font-medium">Başlıq</span>
            <input
              type="text"
              name="title"
              required
              placeholder="Köhnə Azərbaycan mahnıları"
              className="w-full rounded-xl border border-line bg-surface p-3"
            />
          </label>
        </div>
        <input
          type="url"
          name="url"
          required
          placeholder="https://www.youtube.com/playlist?list=..."
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
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-bold">
                {r.kind === "youtube" ? "🎵" : "📡"} {r.title}
              </p>
              <p className="truncate text-sm text-ink-soft">{r.url}</p>
            </div>
            <form action={deleteRadio}>
              <input type="hidden" name="id" value={r.id} />
              <button className="shrink-0 text-sm font-medium text-nar">Sil</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
