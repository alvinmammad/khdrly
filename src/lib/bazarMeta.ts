import type { ProductCategory } from "@/lib/data/types";

/** Bazar kateqoriyaları üçün ikon və Azərbaycanca ad (server + client paylaşır) */
export const CATEGORY_META: Record<ProductCategory, { icon: string; label: string }> = {
  sud: { icon: "🥛", label: "Süd məhsulları" },
  terevez: { icon: "🥬", label: "Tərəvəz" },
  meyve: { icon: "🍎", label: "Meyvə" },
  corek: { icon: "🍞", label: "Çörək və şirniyyat" },
  et: { icon: "🥩", label: "Ət məhsulları" },
  bal: { icon: "🍯", label: "Bal və arıçılıq" },
  el_isi: { icon: "🧶", label: "Əl işləri" },
  diger: { icon: "🧺", label: "Digər" },
};

/** Ay indeksinə (1–12) görə məhsulun mövsümdə olub-olmadığını yoxlayır. */
export function inSeason(
  seasonStart: number | undefined,
  seasonEnd: number | undefined,
  month: number
): boolean {
  if (!seasonStart || !seasonEnd) return true; // bütün il
  return seasonStart <= seasonEnd
    ? month >= seasonStart && month <= seasonEnd
    : month >= seasonStart || month <= seasonEnd; // ili aşan mövsüm (noy–mart)
}
