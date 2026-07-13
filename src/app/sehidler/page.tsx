import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { getMartyrs } from "@/lib/data";

export const metadata = pageMetadata({
  title: "Xıdırlı şəhidləri — əziz xatirələrinə",
  description:
    "Xıdırlı kəndinin şəhidləri — Vətənin azadlığı uğrunda canını fəda etmiş həmkəndlilərimizin xatirə səhifəsi. Allah rəhmət eləsin.",
  path: "/sehidler",
});

export const revalidate = 300;

export default async function MartyrsPage() {
  const martyrs = await getMartyrs();
  const hasOnlySamples = martyrs.every((m) => m.isSample);

  return (
    <div className="space-y-6">
      <header className="text-center">
        <p className="text-4xl" aria-hidden>🕯️</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Şəhidlərimiz</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Vətənin azadlığı uğrunda canını fəda etmiş həmkəndlilərimizin əziz
          xatirəsinə. Ruhları şad olsun.
        </p>
        <div className="mx-auto mt-4 h-px w-24 bg-kerpic" aria-hidden />
      </header>

      {hasOnlySamples ? (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="font-bold">Bu bölmə xüsusi həssaslıqla hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            Şəhidlərimiz haqqında məlumatlar yalnız ailələrin razılığı və
            məlumatların rəsmi mənbələrlə təsdiqindən sonra, ikiqat təsdiq
            prosedurası ilə dərc olunacaq. Ailə nümayəndələri kənd icra
            nümayəndəliyinə müraciət edə bilər.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {martyrs.map((m) => (
            <li key={m.id}>
              <Link
                href={`/sehidler/${m.id}`}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
              >
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt={m.fullName}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-full border border-line object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-2 text-2xl" aria-hidden>
                    🎗️
                  </span>
                )}
                <span>
                  <span className="block text-lg font-bold">{m.fullName}</span>
                  {m.birthYear && m.deathDate && (
                    <span className="text-ink-soft">
                      {m.birthYear} — {m.deathDate}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="font-bold">🎗️ Qazilərimiz və veteranlarımız</p>
        <p className="mt-1 text-ink-soft">
          Müharibə iştirakçıları üçün ayrıca hörmət bölməsi hazırlanır və
          növbəti mərhələdə əlavə olunacaq.
        </p>
      </div>
    </div>
  );
}
