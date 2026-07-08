import type { Metadata } from "next";
import { getDonations } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "İanələr" };

export const revalidate = 300;

export default async function DonationsPage() {
  const donations = await getDonations();
  const totalAzn = donations.reduce((sum, d) => sum + (d.amount ?? 0), 0);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-bold">🤝 İanə reyestri</h1>
        <p className="mt-2 text-ink-soft">
          Kənd üçün toplanan bütün ianələr şəffaf şəkildə burada göstərilir —
          kim, nə üçün, nə qədər.
        </p>
      </header>

      {donations.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="text-sm uppercase tracking-wide text-ink-soft">
            Ümumi toplanmış vəsait
          </p>
          <p className="mt-1 font-heading text-3xl font-bold text-kerpic">
            {totalAzn.toLocaleString("az-AZ")} AZN
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {donations.length} ianə (əşya/əmək ianələri məbləğə daxil deyil)
          </p>
        </div>
      )}

      {donations.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🤝</p>
          <p className="mt-3 text-xl font-bold">Reyestr hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            İanə etmək istəyirsinizsə, kənd icra nümayəndəliyi ilə əlaqə
            saxlayın. Hər ianə bu səhifədə açıq göstəriləcək.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {donations.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <div>
                <p className="font-bold">{d.donorDisplay}</p>
                <p className="text-sm text-ink-soft">
                  {d.purpose} · {formatDate(d.donatedAt)}
                </p>
                {d.note && <p className="mt-1 text-sm text-ink-soft">{d.note}</p>}
              </div>
              <span className="shrink-0 text-lg font-bold text-kerpic">
                {d.amount !== undefined
                  ? `${d.amount.toLocaleString("az-AZ")} AZN`
                  : d.inKind}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="simple-hide rounded-xl border border-line bg-surface-2 p-3 text-sm">
        Reyestr kənd icra nümayəndəliyi tərəfindən aparılır. Onlayn ödəniş
        imkanı gələcəkdə əlavə oluna bilər — hazırda ianələr yerində və ya
        bank köçürməsi ilə qəbul edilir.
      </p>
    </div>
  );
}
