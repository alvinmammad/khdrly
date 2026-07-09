import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import VillageMap from "@/components/map/VillageMap";
import { PLACE_META } from "@/lib/placeMeta";
import { getPlaces } from "@/lib/data";
import { VILLAGE_CENTER } from "@/lib/data/mock";
import type { PlaceType } from "@/lib/data/types";

export const metadata: Metadata = { title: "Xəritə" };

export const revalidate = 300;

export default async function MapPage() {
  const places = await getPlaces();
  const usedTypes = [...new Set(places.map((p) => p.type))] as PlaceType[];
  // PMTiles faylı varsa vektor (oflayn işləyən) xəritə, yoxsa OSM raster
  const hasPmtiles = existsSync(path.join(process.cwd(), "public", "xerite.pmtiles"));

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Kənd xəritəsi</h1>
      <p className="text-ink-soft">
        İctimai yerlər ikonlarla işarələnib — ikona toxununca məlumat açılır.
      </p>

      <VillageMap
        center={VILLAGE_CENTER}
        places={places}
        pmtilesUrl={hasPmtiles ? "/xerite.pmtiles" : undefined}
      />

      {/* Leqenda */}
      <div className="flex flex-wrap gap-2">
        {usedTypes.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium"
          >
            <span aria-hidden>{PLACE_META[t].icon}</span> {PLACE_META[t].label}
          </span>
        ))}
      </div>

      {hasPmtiles && (
        <p className="text-sm text-ink-soft">
          📶 Xəritə bir dəfə açılandan sonra internetsiz də işləyir.
        </p>
      )}
    </div>
  );
}
