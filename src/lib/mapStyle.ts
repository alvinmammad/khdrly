import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import protomapsLayers from "protomaps-themes-base";

/*
  Xəritə stilləri — VillageMap və MemoryMap paylaşır.

  DİQQƏT: `addProtocol` QLOBALDIR. Onu yalnız BİR DƏFƏ qeydiyyatdan
  keçiririk (module səviyyəsində) — əks halda ikinci xəritə mount olanda
  MapLibre "protocol already added" xətası verib xəritəni boz saxlayır.
  Protokolu heç vaxt removeProtocol ilə silmirik (qlobal qalır).
*/

let registered = false;

export function ensurePmtilesProtocol() {
  if (registered || typeof window === "undefined") return;
  maplibregl.addProtocol("pmtiles", new Protocol().tile);
  registered = true;
}

/** OSM raster — həmişə işləyən etibarlı fallback. */
export function osmRasterStyle(): maplibregl.StyleSpecification {
  return {
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
  };
}

/** Protomaps vektor stili — oflayn işləyən PMTiles faylı üçün. */
export function pmtilesVectorStyle(url: string): maplibregl.StyleSpecification {
  return {
    version: 8,
    glyphs:
      "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
    sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${url}`,
        attribution: "© OpenStreetMap, Protomaps",
      },
    },
    layers: protomapsLayers("protomaps", "light", "az"),
  };
}
