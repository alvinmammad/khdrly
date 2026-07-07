import type { ListingType } from "@/lib/data/types";

/** Elan növləri üçün ikon və Azərbaycanca ad (server + client paylaşır) */
export const LISTING_META: Record<ListingType, { icon: string; label: string }> = {
  elan: { icon: "📢", label: "Elan" },
  itmis: { icon: "🔍", label: "İtmiş" },
  tapilmis: { icon: "🎉", label: "Tapılmış" },
};
