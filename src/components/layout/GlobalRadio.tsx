"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

/*
  Qlobal kənd radiosu — layout səviyyəsindədir, ona görə səhifə
  keçidlərində SƏS KƏSİLMİR (Next.js layout naviqasiyada yenidən
  qurulmur; buradakı <audio> DOM elementi qorunur).

  Yalnız canlı yayım (stream) stansiyaları üçün. Autoplay brauzer
  qaydası ilə yalnız istifadəçi düyməyə basandan sonra başlayır —
  saytı açan kimi gözlənilməz səs çıxmır. Bir dəfə basandan sonra
  bütün sayt boyu davam edir.
*/

type Station = { id: string; title: string; url: string };

export default function GlobalRadio() {
  const [stations, setStations] = useState<Station[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    sb.from("radio_items")
      .select("id, title, url")
      .eq("status", "approved")
      .eq("kind", "stream")
      .order("sort_order")
      .then(({ data }) => setStations((data ?? []) as Station[]));
  }, []);

  if (stations.length === 0) return null;
  const current = stations[idx];

  function playStation(station: Station) {
    const a = audioRef.current;
    if (!a) return;
    setLoading(true);
    a.src = station.url;
    a.play()
      .then(() => {
        setPlaying(true);
        setLoading(false);
      })
      .catch(() => {
        setPlaying(false);
        setLoading(false);
      });
  }

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      playStation(current);
    }
  }

  function next() {
    const ni = (idx + 1) % stations.length;
    setIdx(ni);
    playStation(stations[ni]);
  }

  function close() {
    audioRef.current?.pause();
    setPlaying(false);
    setOpen(false);
  }

  return (
    <>
      {/* Tək audio elementi — bütün sayt boyu qorunur */}
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="fixed bottom-24 left-4 z-50 print:hidden">
        {!open ? (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              playStation(current);
            }}
            aria-label="Kənd radiosunu aç"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-kerpic text-2xl text-white shadow-lg shadow-black/25 active:scale-95"
          >
            📻
          </button>
        ) : (
          <div className="flex max-w-[min(78vw,20rem)] items-center gap-1.5 rounded-full border border-line bg-surface p-1.5 shadow-lg shadow-black/25">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Dayandır" : "Çal"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kerpic text-xl text-white active:scale-95"
            >
              {loading ? "…" : playing ? "⏸️" : "▶️"}
            </button>
            <span className="min-w-0 flex-1 truncate text-sm font-bold">
              {playing && (
                <span
                  className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-nar align-middle"
                  aria-hidden
                />
              )}
              {current.title}
            </span>
            {stations.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Növbəti stansiya"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm"
              >
                ⏭️
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Radionu bağla"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </>
  );
}
