import { existsSync } from "node:fs";
import path from "node:path";
import { pageMetadata } from "@/lib/seo";
import VillageMap from "@/components/map/VillageMap";
import { PLACE_META } from "@/lib/placeMeta";
import { getPlaces } from "@/lib/data";
import { VILLAGE_CENTER } from "@/lib/data/mock";
import type { PlaceType } from "@/lib/data/types";

export const metadata = pageMetadata({
  title: "Xıdırlı kəndinin xəritəsi — məktəb, məscid, ictimai yerlər",
  description:
    "Xıdırlı kəndinin interaktiv xəritəsi: məktəb, məscid, sağlamlıq məntəqəsi, bulaq, mağaza və digər ictimai yerlər ikonlarla — koordinatlarla birlikdə.",
  path: "/xerite",
});

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

      <a
        href="/haqqinda/xatire-xeritesi"
        className="block rounded-2xl border border-line bg-surface p-4 active:bg-surface-2"
      >
        <p className="font-bold">💭 Xatirə xəritəsi</p>
        <p className="mt-1 text-sm text-ink-soft">
          Köhnə kəndin yerləri — sakinlərin yaddaşından →
        </p>
      </a>
    </div>
  );
}
