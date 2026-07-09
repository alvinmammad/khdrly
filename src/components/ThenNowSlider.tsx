"use client";

import { useEffect, useState } from "react";
import { readPrefs } from "@/lib/prefs";

/*
  Onda-və-indi müqayisə slideri — sürgünü çəkdikcə "indi" şəkli açılır.
  Böyük toxunma sahəli sadə range input (yaşlı-dostu), kitabxanasız.
*/
export default function ThenNowSlider({
  title,
  note,
  beforeUrl,
  afterUrl,
}: {
  title: string;
  note?: string;
  beforeUrl: string;
  afterUrl: string;
}) {
  const [pos, setPos] = useState(50);
  // Az-data rejimi: şəkillər yalnız istəklə yüklənir
  const [show, setShow] = useState<"gozleyir" | "goster" | "soruş">("gozleyir");

  useEffect(() => {
    setShow(readPrefs().lowData ? "soruş" : "goster");
  }, []);

  if (show !== "goster") {
    return (
      <button
        type="button"
        disabled={show === "gozleyir"}
        onClick={() => setShow("goster")}
        className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-line bg-surface-2 text-ink-soft"
      >
        {show === "soruş" ? (
          <span className="p-3 text-center font-bold">
            ↔️ {title}
            <span className="mt-1 block text-sm font-medium">
              📷 Müqayisəni göstər
            </span>
          </span>
        ) : (
          <span aria-hidden>📷</span>
        )}
      </button>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-[4/3] select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={`${title} — onda`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt={`${title} — indi`}
          loading="lazy"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div
          aria-hidden
          style={{ left: `${pos}%` }}
          className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white/90 shadow"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-3 py-1 text-sm font-bold text-white">
          Onda
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-sm font-bold text-white">
          İndi
        </span>
      </div>
      <div className="p-4">
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`${title} — onda və indi müqayisəsi`}
          className="h-8 w-full accent-[var(--kerpic)]"
        />
        <figcaption className="mt-1">
          <span className="font-bold">{title}</span>
          {note && <span className="text-ink-soft"> · {note}</span>}
        </figcaption>
      </div>
    </figure>
  );
}
