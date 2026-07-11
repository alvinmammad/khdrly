"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ensurePmtilesProtocol,
  osmRasterStyle,
  pmtilesVectorStyle,
} from "@/lib/mapStyle";
import { createMemoryPin } from "./actions";

export type MemoryPin = {
  id: string;
  title: string;
  body: string;
  lat: number;
  lng: number;
  authorName: string | null;
};

interface Props {
  center: { lat: number; lng: number };
  pins: MemoryPin[];
  pmtilesUrl?: string;
  canAdd: boolean; // giriş varsa
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export default function MemoryMap({ center, pins, pmtilesUrl, canAdd }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const draftMarkerRef = useRef<maplibregl.Marker | null>(null);
  const addingRef = useRef(false);

  const [adding, setAdding] = useState(false);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"bos" | "gonderilir" | "ugur" | "xeta">("bos");

  useEffect(() => {
    addingRef.current = adding;
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = adding ? "crosshair" : "";
    }
  }, [adding]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const useVector = Boolean(pmtilesUrl);
    if (useVector) ensurePmtilesProtocol();

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: useVector ? pmtilesVectorStyle(pmtilesUrl!) : osmRasterStyle(),
      center: [center.lng, center.lat],
      zoom: 14.5,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Vektor yüklənməsə OSM raster-ə keç (xəritə boz qalmasın)
    if (useVector) {
      let switched = false;
      map.on("error", (e) => {
        if (switched) return;
        switched = true;
        console.warn("Xatirə xəritəsi vektor rejimi alınmadı, OSM-ə keçilir:", e?.error);
        map.setStyle(osmRasterStyle());
      });
    }

    for (const p of pins) {
      const el = document.createElement("div");
      el.textContent = "💭";
      el.style.fontSize = "24px";
      el.style.cursor = "pointer";
      el.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,.4))";
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", `Xatirə: ${p.title}`);

      const popup = new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(
        `<div style="font-family:inherit;max-width:230px">
           <strong style="font-size:15px">💭 ${escapeHtml(p.title)}</strong>
           <p style="margin:6px 0 0;font-size:13px">${escapeHtml(p.body)}</p>
           ${p.authorName ? `<p style="margin:4px 0 0;font-size:12px;opacity:.7">— ${escapeHtml(p.authorName)}</p>` : ""}
         </div>`
      );

      new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);
    }

    map.on("click", (e) => {
      if (!addingRef.current) return;
      const { lat, lng } = e.lngLat;
      setPicked({ lat, lng });
      if (!draftMarkerRef.current) {
        const el = document.createElement("div");
        el.textContent = "📍";
        el.style.fontSize = "28px";
        draftMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        draftMarkerRef.current.setLngLat([lng, lat]);
      }
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      draftMarkerRef.current = null;
      // Protokol qlobal qalır (module-level, bir dəfə) — silmirik.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, pins, pmtilesUrl]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!picked) return;
    const fd = new FormData(e.currentTarget);
    setStatus("gonderilir");
    const ok = await createMemoryPin({
      title: String(fd.get("title") ?? ""),
      body: String(fd.get("body") ?? ""),
      authorName: String(fd.get("author_name") ?? ""),
      lat: picked.lat,
      lng: picked.lng,
    });
    if (ok) {
      setStatus("ugur");
      setAdding(false);
      setPicked(null);
      draftMarkerRef.current?.remove();
      draftMarkerRef.current = null;
    } else {
      setStatus("xeta");
    }
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="h-[55vh] min-h-72 w-full overflow-hidden rounded-2xl border border-line"
        aria-label="Xatirə xəritəsi"
      />

      {status === "ugur" && (
        <p className="rounded-xl border-2 border-zeytun bg-zeytun/10 p-4 text-center font-medium">
          🙏 Xatirəniz qəbul olundu — yoxlanıldıqdan sonra xəritədə görünəcək.
        </p>
      )}

      {canAdd && !adding && status !== "ugur" && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-kerpic font-bold text-kerpic active:bg-kerpic/10"
        >
          💭 Xatirə əlavə et
        </button>
      )}

      {adding && (
        <div className="space-y-3 rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-4">
          {!picked ? (
            <p className="text-center font-medium">
              👆 Xəritədə xatirənin yerinə toxunun
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              {status === "xeta" && (
                <p role="alert" className="rounded-xl border border-nar bg-nar/10 p-3 font-medium">
                  Göndərmək alınmadı — sahələri yoxlayın.
                </p>
              )}
              <input
                type="text"
                name="title"
                required
                maxLength={100}
                placeholder="Bura nə idi? (məs: Köhnə dəyirman)"
                className="w-full rounded-xl border border-line bg-surface p-3"
              />
              <textarea
                name="body"
                required
                rows={3}
                maxLength={1000}
                placeholder="Xatirəniz: kim yaşayırdı, nə olardı, nə xatırlayırsınız..."
                className="w-full rounded-xl border border-line bg-surface p-3"
              />
              <input
                type="text"
                name="author_name"
                maxLength={80}
                placeholder="Adınız (istəyə bağlı — xəritədə görünür)"
                className="w-full rounded-xl border border-line bg-surface p-3"
              />
              <button
                type="submit"
                disabled={status === "gonderilir"}
                className={`flex min-h-12 w-full items-center justify-center rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong ${
                  status === "gonderilir" ? "opacity-60" : ""
                }`}
              >
                {status === "gonderilir" ? "Göndərilir..." : "Göndər"}
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setPicked(null);
              draftMarkerRef.current?.remove();
              draftMarkerRef.current = null;
            }}
            className="w-full text-center text-sm font-medium text-ink-soft"
          >
            İmtina
          </button>
        </div>
      )}
    </div>
  );
}
