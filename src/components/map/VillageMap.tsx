"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Place } from "@/lib/data/types";
import { PLACE_META } from "@/lib/placeMeta";
import {
  ensurePmtilesProtocol,
  osmRasterStyle,
  pmtilesVectorStyle,
} from "@/lib/mapStyle";

interface Props {
  center: { lat: number; lng: number };
  places: Place[];
  /** public/ daxilində PMTiles faylı varsa verilir — oflayn işləyən vektor xəritə */
  pmtilesUrl?: string;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/*
  Kənd xəritəsi. pmtilesUrl veriləndə Protomaps vektor mozaikaları
  işlədilir — fayl SW keşinə düşdükdən sonra xəritə OFLAYN da açılır
  (zəif internet qaydası). Fayl yoxdursa OSM raster fallback qalır.
  Fayl generasiyası: docs/XERITE.md
*/
export default function VillageMap({ center, places, pmtilesUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

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

    // Vektor (PMTiles) yüklənməsə — avtomatik OSM raster-ə keç ki, xəritə
    // heç vaxt boz qalmasın (etibarlılıq zəif internet/uyğunsuzluqda).
    if (useVector) {
      let switched = false;
      map.on("error", (e) => {
        if (switched) return;
        switched = true;
        console.warn("Xəritə vektor rejimi alınmadı, OSM-ə keçilir:", e?.error);
        map.setStyle(osmRasterStyle());
      });
    }

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({ trackUserLocation: true }),
      "top-right"
    );

    for (const p of places) {
      const meta = PLACE_META[p.type];
      const el = document.createElement("div");
      el.textContent = meta.icon;
      el.style.fontSize = "26px";
      el.style.cursor = "pointer";
      el.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,.4))";
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", `${meta.label}: ${p.name}`);

      const popup = new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(
        `<div style="font-family:inherit">
           <strong style="font-size:15px">${meta.icon} ${escapeHtml(p.name)}</strong>
           ${p.body ? `<p style="margin:6px 0 0;font-size:13px">${escapeHtml(p.body)}</p>` : ""}
         </div>`
      );

      new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      // Protokol qlobal qalır (module-level, bir dəfə) — silmirik.
    };
  }, [center, places, pmtilesUrl]);

  return (
    <div
      ref={containerRef}
      className="h-[60vh] min-h-80 w-full overflow-hidden rounded-2xl border border-line"
      aria-label="Xıdırlı kəndinin xəritəsi"
    />
  );
}
