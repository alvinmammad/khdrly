/** Problem statusları üçün etiket/ikon (server + client paylaşır) */
export const ISSUE_STATUS_META: Record<
  string,
  { icon: string; label: string; open: boolean }
> = {
  yeni: { icon: "🆕", label: "Yeni", open: true },
  baxilir: { icon: "👀", label: "Baxılır", open: true },
  hell_olunur: { icon: "🔧", label: "Həll olunur", open: true },
  hell_olundu: { icon: "✅", label: "Həll olundu", open: false },
  redd: { icon: "✖️", label: "Yersiz sayıldı", open: false },
};

export const ISSUE_STATUSES = Object.keys(ISSUE_STATUS_META);
