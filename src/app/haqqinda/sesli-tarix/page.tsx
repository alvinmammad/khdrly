import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { mediaPublicUrl } from "@/lib/data";

export const metadata: Metadata = { title: "Şifahi tarix" };

export const revalidate = 300;

type Row = {
  id: string;
  title: string;
  narrator: string;
  narrator_info: string | null;
  audio_path: string;
  transcript: string | null;
};

async function getOralHistories(): Promise<Row[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("oral_histories")
    .select("id, title, narrator, narrator_info, audio_path, transcript")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  return (data ?? []) as Row[];
}

export default async function OralHistoryPage() {
  const items = await getOralHistories();

  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">🎙️ Şifahi tarix</h1>
        <p className="mt-2 text-ink-soft">
          Ağsaqqallarımızın öz səsi ilə — kəndin canlı yaddaşı. Hər söhbət
          gələcək nəsillər üçün qorunur.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🎙️</p>
          <p className="mt-3 text-xl font-bold">Arxiv toplanır</p>
          <p className="mt-2 text-ink-soft">
            Yaşlı sakinlərimizin xatirələri yazılıb bura əlavə olunacaq.
            Danışmaq istəyən ağsaqqallar üçün kənd icra nümayəndəliyinə
            müraciət edin.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((h) => (
            <li key={h.id} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-lg font-bold">{h.title}</p>
              <p className="text-sm text-ink-soft">
                🗣️ {h.narrator}
                {h.narrator_info ? ` (${h.narrator_info})` : ""}
              </p>
              {/* preload="none" — zəif internetdə səs yalnız basılanda yüklənir */}
              <audio
                controls
                preload="none"
                src={mediaPublicUrl(h.audio_path)}
                className="mt-3 w-full"
              />
              {h.transcript && (
                <details className="mt-3 rounded-xl border border-line bg-surface-2 p-3">
                  <summary className="cursor-pointer font-bold">
                    📄 Mətnini oxu
                  </summary>
                  <p className="mt-2 whitespace-pre-line leading-relaxed">
                    {h.transcript}
                  </p>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
