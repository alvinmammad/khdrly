import Link from "next/link";
import { getOnThisDay } from "@/lib/data";

/*
  "Bu gün tariximizdə" — timeline məlumatından avtomatik. Uyğun hadisə
  olmayan günlərdə blok ümumiyyətlə görünmür.
*/
export default async function OnThisDay() {
  const entries = await getOnThisDay();
  if (entries.length === 0) return null;

  return (
    <section aria-label="Bu gün tariximizdə" className="space-y-2">
      {entries.map((e) => (
        <Link
          key={e.id}
          href={e.era === "isgal" ? "/haqqinda/isgal-dovru" : "/haqqinda/azadliq"}
          className="block rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-4 active:bg-gunebaxan/20"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
            📅 Bu gün tariximizdə
          </p>
          <p className="mt-1 font-heading text-lg font-bold">
            {e.yearsAgo} il əvvəl — {e.title}
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">Ətraflı oxu →</p>
        </Link>
      ))}
    </section>
  );
}
