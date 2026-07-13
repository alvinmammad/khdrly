import Link from "next/link";
import { getTimeline } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Xıdırlının azadlığı və bərpası — Böyük Qayıdış",
  description:
    "20 noyabr 2020-də Ağdamın azadlığı və Xıdırlı kəndinin Böyük Qayıdış proqramı ilə yenidən qurulması — bərpanın zaman xətti və ilk ailələrin qayıdışı.",
  path: "/haqqinda/azadliq",
});

export const revalidate = 300;

export default async function LiberationTimelinePage() {
  const entries = await getTimeline(["azadliq", "berpa"]);

  return (
    <div className="space-y-5">
      <Link href="/haqqinda" className="inline-block font-bold text-kerpic">
        ← Kəndimiz
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-bold">🇦🇿 Azadlıq və Bərpa</h1>
        <p className="mt-2 text-ink-soft">
          27 illik həsrətin sonu və Böyük Qayıdışın zaman xətti.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
          Zaman xətti hazırlanır — hadisələr rəsmi mənbələrlə daxil edildikcə
          burada görünəcək.
        </p>
      ) : (
        <ol className="relative ml-3 space-y-6 border-l-2 border-kerpic/40 pl-6">
          {entries.map((e) => (
            <li key={e.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-kerpic"
              />
              <p className="text-sm font-bold uppercase tracking-wide text-kerpic">
                {e.dateDisplay ?? formatDate(e.eventDate)}
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold">{e.title}</h2>
              <p className="mt-2 leading-relaxed">{e.body}</p>
              {e.sources.length > 0 && (
                <p className="mt-2 text-sm italic text-ink-soft">
                  Mənbə: {e.sources.join("; ")}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      <div className="carpet-divider" aria-hidden />

      <Link
        href="/haqqinda/isgal-dovru"
        className="block rounded-2xl border border-line bg-surface p-5 active:bg-surface-2"
      >
        <p className="font-bold">🕯️ İşğal dövrü (1993–2020)</p>
        <p className="mt-1 text-ink-soft">
          Yaddaş arxivi — o illərin xronologiyası →
        </p>
      </Link>
    </div>
  );
}
