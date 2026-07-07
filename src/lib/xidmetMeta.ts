import type { ServiceCategory } from "@/lib/data/types";

/** Xidmət kateqoriyaları üçün ikon və Azərbaycanca ad (server + client paylaşır) */
export const SERVICE_META: Record<ServiceCategory, { icon: string; label: string }> = {
  usta: { icon: "🔨", label: "Tikinti-təmir ustası" },
  elektrik: { icon: "💡", label: "Elektrik ustası" },
  santexnik: { icon: "🔧", label: "Santexnik" },
  berber: { icon: "💈", label: "Bərbər" },
  taksi: { icon: "🚕", label: "Taksi / sürücü" },
  toy: { icon: "🎉", label: "Toy-mərasim xidməti" },
  texnika: { icon: "🚜", label: "Kənd təsərrüfatı texnikası" },
  diger: { icon: "🧰", label: "Digər" },
};
