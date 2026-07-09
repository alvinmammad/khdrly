import type { PlaceType } from "@/lib/data/types";

/** Xəritə POI növləri üçün ikon və Azərbaycanca ad (server + client paylaşır) */
export const PLACE_META: Record<PlaceType, { icon: string; label: string }> = {
  mekteb: { icon: "🏫", label: "Məktəb" },
  mescid: { icon: "🕌", label: "Məscid" },
  bulaq: { icon: "⛲", label: "Bulaq" },
  abide: { icon: "🗿", label: "Abidə" },
  qebiristanliq: { icon: "🪦", label: "Qəbiristanlıq" },
  saglamliq: { icon: "🏥", label: "Sağlamlıq məntəqəsi" },
  magaza: { icon: "🏪", label: "Mağaza" },
  tarixi_ev: { icon: "🏚️", label: "Tarixi ev" },
  tesserrufat: { icon: "🐃", label: "Təsərrüfat" },
  turizm: { icon: "📸", label: "Turizm" },
  bayraq_meydani: { icon: "🚩", label: "Bayraq meydanı" },
  futbol_stadionu: { icon: "⚽", label: "Futbol stadionu" },
  baghcha: { icon: "🏡", label: "Bağça" },
};
