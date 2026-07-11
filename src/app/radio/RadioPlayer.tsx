"use client";

import { useRef, useState } from "react";

export type Station = { id: string; title: string; url: string; description?: string };

/*
  Canlı radio pleyeri — eyni anda yalnız bir stansiya çalır. Böyük
  düymələr (yaşlı-dostu). preload="none" — yalnız basanda yüklənir.
  Qeyd: yalnız https yayımlar işləyir (sayt https-dədir, mixed content
  bloklanır); admin tərəfi bunu yoxlayır.
*/
export default function RadioPlayer({ stations }: { stations: Station[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [xeta, setXeta] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function play(st: Station) {
    setXeta(null);
    if (!audioRef.current) return;
    if (active === st.id) {
      // Eyni stansiya — dayandır
      audioRef.current.pause();
      setActive(null);
      return;
    }
    audioRef.current.src = st.url;
    audioRef.current
      .play()
      .then(() => setActive(st.id))
      .catch(() => {
        setActive(null);
        setXeta(`"${st.title}" hazırda yayımda deyil və ya yüklənmədi.`);
      });
  }

  return (
    <div className="space-y-2">
      {/* Gizli audio elementi — bütün stansiyalar üçün tək */}
      <audio ref={audioRef} preload="none" onEnded={() => setActive(null)} />

      {xeta && (
        <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
          {xeta}
        </p>
      )}

      {stations.map((st) => {
        const oynayir = active === st.id;
        return (
          <button
            key={st.id}
            type="button"
            onClick={() => play(st)}
            className={`flex min-h-16 w-full items-center gap-4 rounded-2xl border-2 p-4 text-left ${
              oynayir
                ? "border-kerpic bg-kerpic/10"
                : "border-line bg-surface active:bg-surface-2"
            }`}
          >
            <span className="text-3xl" aria-hidden>
              {oynayir ? "⏸️" : "▶️"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-bold">{st.title}</span>
              {st.description && (
                <span className="block text-sm text-ink-soft">{st.description}</span>
              )}
            </span>
            {oynayir && (
              <span className="flex items-center gap-1.5 rounded-full bg-nar px-3 py-1 text-sm font-bold text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden />
                CANLI
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
