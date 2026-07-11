import type { Metadata } from "next";
import { getRadioItems } from "@/lib/data";
import RadioPlayer, { type Station } from "./RadioPlayer";

export const metadata: Metadata = { title: "Kənd radiosu" };

export const revalidate = 300;

export default async function RadioPage() {
  const items = await getRadioItems();
  const streams: Station[] = items
    .filter((i) => i.kind === "stream")
    .map((i) => ({ id: i.id, title: i.title, url: i.url, description: i.description }));
  const playlists = items.filter((i) => i.kind === "youtube");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">📻 Kənd radiosu</h1>
        <p className="mt-2 text-ink-soft">
          Köhnə Azərbaycan musiqiləri və canlı radio — kəndin havası.
        </p>
      </header>

      {items.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>📻</p>
          <p className="mt-3 text-xl font-bold">Radio hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            Tezliklə köhnə mahnılar və canlı yayımlar burada olacaq.
          </p>
        </div>
      )}

      {/* Canlı yayımlar */}
      {streams.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold">📡 Canlı radio</h2>
          <RadioPlayer stations={streams} />
        </section>
      )}

      {/* YouTube musiqi pleyləstləri */}
      {playlists.length > 0 && (
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
      )}

      <p className="simple-hide text-sm text-ink-soft">
        Musiqilər YouTube və radio stansiyalarında saxlanılır — dinləmək üçün
        internet lazımdır. ▶️ düyməsinə basın; başqa səhifəyə keçəndə səs dayanır.
      </p>
    </div>
  );
}
