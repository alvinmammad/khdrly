import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMartyr } from "@/lib/data";

export const metadata: Metadata = { title: "Şəhidimiz" };

export const revalidate = 300;

export default async function MartyrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const martyr = await getMartyr(id);
  if (!martyr || martyr.isSample) notFound();

  return (
    <article className="mx-auto max-w-lg space-y-6">
      <header className="text-center">
        <p className="text-4xl" aria-hidden>🕯️</p>
        <h1 className="mt-3 font-heading text-3xl font-bold">{martyr.fullName}</h1>
        {martyr.birthYear && martyr.deathDate && (
          <p className="mt-2 text-xl text-ink-soft">
            {martyr.birthYear} — {martyr.deathDate}
          </p>
        )}
        <div className="mx-auto mt-5 h-px w-24 bg-kerpic" aria-hidden />
      </header>

      {martyr.bio && (
        <div className="space-y-4 text-lg leading-relaxed">
          {martyr.bio.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {martyr.awards && martyr.awards.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">Təltifləri</h2>
          <ul className="mt-2 space-y-1">
            {martyr.awards.map((a) => (
              <li key={a}>🎖️ {a}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-center text-ink-soft">Ruhu şad olsun.</p>

      <p className="text-center">
        <Link
          href="/sehidler"
          className="inline-flex min-h-12 items-center rounded-xl border border-line bg-surface px-5 font-bold"
        >
          ← Şəhidlərimiz
        </Link>
      </p>
    </article>
  );
}
