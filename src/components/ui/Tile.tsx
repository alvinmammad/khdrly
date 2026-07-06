import Link from "next/link";

interface TileProps {
  href: string;
  icon: string;
  label: string;
  hint?: string;
  soon?: boolean; // hələ hazır olmayan modullar üçün "Tezliklə" nişanı
}

/** Ana ekranın böyük plitəsi: ikon + 1-2 söz — yaşlı istifadəçi üçün əsas naviqasiya */
export default function Tile({ href, icon, label, hint, soon }: TileProps) {
  return (
    <Link
      href={href}
      className="relative flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-surface p-4 text-center shadow-sm transition-transform duration-200 active:scale-[0.97]"
    >
      {soon && (
        <span className="absolute right-2 top-2 rounded-full bg-gunebaxan px-2 py-0.5 text-xs font-bold text-[#33261d]">
          Tezliklə
        </span>
      )}
      <span className="text-4xl leading-none" aria-hidden>
        {icon}
      </span>
      <span className="text-lg font-bold leading-tight">{label}</span>
      {hint && <span className="text-sm text-ink-soft leading-tight">{hint}</span>}
    </Link>
  );
}
