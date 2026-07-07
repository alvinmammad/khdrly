import type { Metadata } from "next";
import { getTransportRoutes } from "@/lib/data";

export const metadata: Metadata = { title: "Nəqliyyat" };

export const revalidate = 300;

export default async function TransportPage() {
  const routes = await getTransportRoutes();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-bold">🚌 Nəqliyyat</h1>
        <p className="mt-2 text-ink-soft">
          Kənddən gediş-gəliş marşrutları və sürücü əlaqələri.
        </p>
      </header>

      {routes.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-5xl" aria-hidden>🚌</p>
          <p className="mt-3 text-xl font-bold">Cədvəl hazırlanır</p>
          <p className="mt-2 text-ink-soft">
            Marşrut məlumatları dəqiqləşdirilib tezliklə əlavə olunacaq.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {routes.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-lg font-bold">{r.title}</p>
              <p className="mt-2 flex items-start gap-2">
                <span aria-hidden>🕐</span>
                <span>{r.schedule}</span>
              </p>
              {r.note && <p className="mt-1 text-sm text-ink-soft">{r.note}</p>}
              {r.phone && (
                <a
                  href={`tel:${r.phone}`}
                  className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-kerpic font-bold text-white active:bg-kerpic-strong"
                >
                  📞 {r.driverName ? `${r.driverName} — zəng et` : "Sürücüyə zəng et"}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="simple-hide text-sm text-ink-soft">
        Cədvəllərdə dəyişiklik ola bilər — çıxmazdan əvvəl sürücü ilə
        əlaqə saxlamaq məsləhətdir.
      </p>
    </div>
  );
}
