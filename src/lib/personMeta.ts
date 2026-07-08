import type { PersonField } from "@/lib/data/types";

/** Məşhurlar sahələri üçün ikon və Azərbaycanca ad (server + client paylaşır) */
export const PERSON_META: Record<PersonField, { icon: string; label: string }> = {
  elm: { icon: "🎓", label: "Elm və təhsil" },
  medeniyyet: { icon: "🎭", label: "Mədəniyyət və incəsənət" },
  idman: { icon: "🏅", label: "İdman" },
  herbi: { icon: "🎖️", label: "Hərbi xidmət" },
  emek: { icon: "🌾", label: "Əmək qabaqcılları" },
  diger: { icon: "⭐", label: "Digər" },
};
