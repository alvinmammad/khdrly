"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Place } from "@/lib/data/types";
import { PLACE_META } from "@/lib/placeMeta";

interface Props {
  center: { lat: number; lng: number };
  places: Place[];
}

/*
  Kənd xəritəsi. Hazırda OpenStreetMap raster mozaikaları ilə işləyir
  (yüngül istifadə üçün pulsuz). İstehsalda kəndin əhatə dairəsi üçün
  Protomaps PMTiles faylına keçiriləcək — bu, offline işləməyə imkan verir.
*/
export default function VillageMap({ center, places }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [center.lng, center.lat],
      zoom: 14.5,
      attributionControl: { compact: true },
    });

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
           <strong style="font-size:15px">${meta.icon} ${p.name}</strong>
           ${p.body ? `<p style="margin:6px 0 0;font-size:13px">${p.body}</p>` : ""}
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
    };
  }, [center, places]);

  return (
    <div
      ref={containerRef}
      className="h-[60vh] min-h-80 w-full overflow-hidden rounded-2xl border border-line"
      aria-label="Xıdırlı kəndinin xəritəsi"
    />
  );
}
