import Link from "next/link";
import { getTimeline } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Xıdırlı işğal dövründə (1993–2020) — tarixi arxiv",
  description:
    "Xıdırlı kəndinin işğal dövrü (1993–2020): xronologiya, mənbəli tarixi faktlar, arxiv materialları və sakinlərin xatirələri.",
  path: "/haqqinda/isgal-dovru",
});

export const revalidate = 300;

/*
  Arxiv bölməsi ayrıca vizual kimlik daşıyır: sepiya tonlar, sakit,
  sənədli ton (bax: globals.css .archive-scope). Bütün faktlar yalnız
  mənbə istinadı ilə dərc olunur — DB CHECK bunu məcbur edir.
*/
export default async function OccupationArchivePage() {
  const entries = await getTimeline(["isgal"]);

  return (
    <div className="archive-scope -mx-4 -mt-4 min-h-screen bg-bg px-4 pb-8 pt-6 text-ink">
      <div className="space-y-5">
        <Link href="/haqqinda" className="inline-block font-bold">
          ← Kəndimiz
        </Link>
        <header>
          <h1 className="font-heading text-2xl font-bold">
            İşğal dövrü (1993–2020)
          </h1>
          <p className="mt-2 text-ink-soft">
            27 illik ayrılığın yaddaş arxivi. Buradakı hər fakt rəsmi mənbə
            istinadı ilə dərc olunur.
          </p>
        </header>

        {entries.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
            Arxiv hazırlanır. Xronologiya rəsmi mənbələr əsasında, sakinlərin
            xatirələri isə razılıq və yoxlamadan sonra əlavə olunacaq.
          </p>
        ) : (
          <ol className="space-y-4">
            {entries.map((e) => (
              <li key={e.id} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  {e.dateDisplay ?? formatDate(e.eventDate)}
                </p>
                <h2 className="mt-1 font-heading text-xl font-bold">{e.title}</h2>
                <p className="mt-2 leading-relaxed">{e.body}</p>
                {e.sources.length > 0 && (
                  <p className="mt-3 border-t border-line pt-2 text-sm italic text-ink-soft">
                    Mənbə: {e.sources.join("; ")}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-bold">📷 Xatirəniz, fotonuz var?</p>
          <p className="mt-1 text-ink-soft">
            İşğaldan əvvəlki kənd həyatına aid foto və xatirələr &quot;Siz də
            paylaşın&quot; bölməsi ilə toplanacaq — tezliklə.
          </p>
        </div>

        <Link
          href="/haqqinda/azadliq"
          className="block rounded-2xl border border-line bg-surface p-5 active:opacity-90"
        >
          <p className="font-bold">🇦🇿 Azadlıq və Bərpa</p>
          <p className="mt-1 text-ink-soft">Həsrətin sonu — zaman xətti →</p>
        </Link>
      </div>
    </div>
  );
}
