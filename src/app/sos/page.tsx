import type { Metadata } from "next";

export const metadata: Metadata = { title: "SOS — Təcili yardım" };

const NUMBERS = [
  { tel: "103", icon: "🚑", label: "Təcili tibbi yardım", color: "bg-sos" },
  { tel: "101", icon: "🚒", label: "Yanğınsöndürmə", color: "bg-kerpic" },
  { tel: "102", icon: "🚓", label: "Polis", color: "bg-zeytun" },
  { tel: "112", icon: "🆘", label: "FHN — Fövqəladə Hallar", color: "bg-nar" },
];

/** Təcili nömrələr — hər düymə birbaşa zəng açır (tel:), maksimum sadəlik */
export default function SosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center font-heading text-3xl font-bold">Təcili yardım</h1>
      <p className="text-center text-lg text-ink-soft">
        Nömrəyə toxunun — zəng dərhal açılacaq
      </p>

      <div className="space-y-4 pt-2">
        {NUMBERS.map((n) => (
          <a
            key={n.tel}
            href={`tel:${n.tel}`}
            className={`flex min-h-24 items-center gap-4 rounded-2xl ${n.color} px-6 text-white shadow-md active:scale-[0.98]`}
          >
            <span className="text-5xl" aria-hidden>{n.icon}</span>
            <span className="flex-1">
              <span className="block text-xl font-bold leading-tight">{n.label}</span>
              <span className="text-white/85">Zəng etmək üçün toxunun</span>
            </span>
            <span className="text-4xl font-extrabold tracking-wider">{n.tel}</span>
          </a>
        ))}
      </div>

      <p className="pt-2 text-center text-ink-soft">
        Növbətçi feldşer və aptek üçün{" "}
        <a href="/novbetci" className="font-bold text-kerpic underline">
          Növbətçi bölməsinə
        </a>{" "}
        baxın.
      </p>
    </div>
  );
}
