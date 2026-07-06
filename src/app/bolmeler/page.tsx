import type { Metadata } from "next";
import Tile from "@/components/ui/Tile";

export const metadata: Metadata = { title: "Bölmələr" };

/** Bütün bölmələrin tam siyahısı — gələcək modullar "Tezliklə" nişanı ilə */
export default function SectionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Bütün bölmələr</h1>

      <div className="tile-grid grid grid-cols-2 gap-3">
        <Tile href="/hava" icon="☀️" label="Hava" />
        <Tile href="/xeberler" icon="📰" label="Xəbərlər" />
        <Tile href="/novbetci" icon="🏥" label="Növbətçi" />
        <Tile href="/tedbirler" icon="📅" label="Tədbirlər" />
        <Tile href="/xerite" icon="🗺️" label="Xəritə" />
        <Tile href="/haqqinda" icon="🏡" label="Kəndimiz" />
        <Tile href="/sehidler" icon="🕯️" label="Şəhidlərimiz" />
        <Tile href="/sos" icon="🆘" label="Təcili yardım" />
        <Tile href="/bazar" icon="🛒" label="Bazar" soon />
        <Tile href="/bazar" icon="🐄" label="Heyvan satışı" soon />
        <Tile href="/bazar" icon="🔧" label="Xidmətlər" soon />
        <Tile href="/haqqinda/tarix" icon="📜" label="Tarix arxivi" soon />
        <Tile href="/haqqinda/kohne-sekiller" icon="🖼️" label="Media arxivi" soon />
        <Tile href="/haqqinda" icon="👥" label="İcma" soon />
        <Tile href="/haqqinda" icon="🏘️" label="Turizm" soon />
        <Tile href="/haqqinda" icon="🚌" label="Nəqliyyat" soon />
        <Tile href="/parametrler" icon="⚙️" label="Parametrlər" />
      </div>

      <p className="text-sm text-ink-soft">
        &quot;Tezliklə&quot; işarəli bölmələr növbəti mərhələlərdə açılacaq.
      </p>
    </div>
  );
}
