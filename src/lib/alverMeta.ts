import type { MarketCategory } from "@/lib/data/types";

/** Al-ver kateqoriyaları üçün ikon və Azərbaycanca ad (server + client paylaşır) */
export const MARKET_CATEGORY_META: Record<
  MarketCategory,
  { icon: string; label: string; hasPrice: boolean }
> = {
  satilir: { icon: "🏷️", label: "Satılır", hasPrice: true },
  axtariram: { icon: "🔍", label: "Axtarıram", hasPrice: false },
  icare: { icon: "🔧", label: "İcarə / borc", hasPrice: true },
  pulsuz: { icon: "🎁", label: "Pulsuz", hasPrice: false },
};

export const MARKET_CATEGORIES = Object.keys(MARKET_CATEGORY_META) as MarketCategory[];
