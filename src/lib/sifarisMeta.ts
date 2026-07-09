/** Sifariş statusları üçün etiket və ikon (server + client paylaşır) */
export const ORDER_STATUS_META: Record<
  string,
  { icon: string; label: string; active: boolean }
> = {
  yeni: { icon: "🆕", label: "Yeni — baxılır", active: true },
  tesdiqlendi: { icon: "✅", label: "Təsdiqləndi", active: true },
  hazirdir: { icon: "📦", label: "Hazırdır — təhvil gözləyir", active: true },
  catdirildi: { icon: "🤝", label: "Təhvil verildi", active: false },
  legv: { icon: "✖️", label: "Ləğv olundu", active: false },
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_META);
