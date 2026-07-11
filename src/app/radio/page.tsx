import type { Metadata } from "next";
import { getRadioItems } from "@/lib/data";

export const metadata: Metadata = { title: "Kənd radiosu" };

export const revalidate = 300;

/*
  Canlı yayım artıq QLOBAL mini pleyerdədir (sol-aşağı 📻 düyməsi,
  sayt boyu davam edir) — burada təkrarlanmır ki, iki səs toqquşmasın.
  Bu səhifə yalnız YouTube musiqi pleyləstləri üçündür.
*/
export default async function RadioPage() {
  const items = await getRadioItems();
  const playlists = items.filter((i) => i.kind === "youtube");
  const hasStream = items.some((i) => i.kind === "stream");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">📻 Kənd radiosu</h1>
        <p className="mt-2 text-ink-soft">
          Köhnə Azərbaycan musiqiləri və canlı radio — kəndin havası.
        </p>
      </header>

      {hasStream && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-kerpic bg-kerpic/5 p-4">
          <span className="text-3xl" aria-hidden>📻</span>
          <p>
            <strong>Canlı radio</strong> ekranın sol-aşağı küncündəki{" "}
            <span className="font-bold text-kerpic">📻 düyməsindən</span> açılır —
            bütün səhifələrdə çalmağa davam edir.
          </p>
        </div>
      )}

      {playlists.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold">🎵 Köhnə mahnılar</h2>
          {playlists.map((p) => {
            const embed = p.playlistId
              ? `https://www.youtube-nocookie.com/embed/videoseries?list=${p.playlistId}`
              : `https://www.youtube-nocookie.com/embed/${p.videoId}`;
            return (
              <div key={p.id} className="space-y-2">
                <p className="font-bold">{p.title}</p>
                {p.description && (
                  <p className="text-sm text-ink-soft">{p.description}</p>
                )}
                <div className="overflow-hidden rounded-2xl border border-line">
                  <iframe
                    src={embed}
                    title={p.title}
                    loading="lazy"
                    allow="encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        !hasStream && (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-5xl" aria-hidden>📻</p>
            <p className="mt-3 text-xl font-bold">Radio hazırlanır</p>
            <p className="mt-2 text-ink-soft">
              Tezliklə köhnə mahnılar və canlı yayımlar burada olacaq.
            </p>
          </div>
        )
      )}
    </div>
  );
}
