import type { Metadata } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/data";
import UploadOral from "./UploadOral";
import { deleteOralHistory, updateTranscript } from "./actions";

export const metadata: Metadata = {
  title: "Şifahi tarix — idarəetmə",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  title: string;
  narrator: string;
  narrator_info: string | null;
  audio_path: string;
  transcript: string | null;
};

export default async function AdminOralPage() {
  const sb = await getSupabaseServer();
  if (!sb) return null;

  const { data } = await sb
    .from("oral_histories")
    .select("id, title, narrator, narrator_info, audio_path, transcript")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">🎙️ Şifahi tarix</h1>
      <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Telefonla yazılmış söhbəti yükləyin. Mətnini avtomatik çıxarmaq üçün
        kompüterdə: <code>node scripts/stt.mjs fayl.m4a</code> (pulsuz Groq
        açarı ilə — bax skriptin başlığına), nəticəni transkripsiya sahəsinə
        yapışdırın.
      </p>

      <UploadOral />

      <ul className="space-y-3">
        {rows.map((h) => (
          <li key={h.id} className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-bold">{h.title}</p>
            <p className="text-sm text-ink-soft">
              🗣️ {h.narrator}
              {h.narrator_info ? ` (${h.narrator_info})` : ""}
            </p>
            <audio
              controls
              preload="none"
              src={mediaPublicUrl(h.audio_path)}
              className="mt-2 w-full"
            />
            <form action={updateTranscript} className="mt-2 space-y-2">
              <input type="hidden" name="id" value={h.id} />
              <textarea
                name="transcript"
                rows={3}
                defaultValue={h.transcript ?? ""}
                placeholder="Transkripsiya..."
                className="w-full rounded-xl border border-line bg-surface p-2.5"
              />
              <button className="min-h-11 rounded-xl bg-kerpic px-4 font-bold text-white active:bg-kerpic-strong">
                Mətni yadda saxla
              </button>
            </form>
            <form action={deleteOralHistory} className="mt-2">
              <input type="hidden" name="id" value={h.id} />
              <button className="text-sm font-medium text-nar">
                Sil (səs faylı da silinir)
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
