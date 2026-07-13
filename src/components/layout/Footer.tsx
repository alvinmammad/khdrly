import Link from "next/link";

/*
  Sayt sonluğu — hər səhifədən əsas bölmələrə daxili linklər (SEO + naviqasiya).
  Sadə görünüş rejimində gizlənir (yaşlı istifadəçini yormasın), çapda çıxmır.
*/

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Kəndimiz",
    links: [
      ["/haqqinda", "Xıdırlı haqqında"],
      ["/haqqinda/tarix", "Kəndin tarixi"],
      ["/sehidler", "Şəhidlərimiz"],
      ["/haqqinda/brend", "Xıdırlı qaymağı"],
      ["/haqqinda/meshurlar", "Məşhurlarımız"],
      ["/haqqinda/kohne-sekiller", "Media arxivi"],
    ],
  },
  {
    title: "Canlı məlumat",
    links: [
      ["/xeberler", "Xəbərlər"],
      ["/hava", "Hava proqnozu"],
      ["/tedbirler", "Tədbirlər"],
      ["/novbetci", "Növbətçi"],
      ["/xerite", "Kənd xəritəsi"],
      ["/sos", "Təcili yardım"],
    ],
  },
  {
    title: "Bazar və icma",
    links: [
      ["/bazar", "Kənd bazarı"],
      ["/al-ver", "Al-ver elanları"],
      ["/xidmetler", "Xidmətlər"],
      ["/turizm", "Turizm və kirayə"],
      ["/neqliyyat", "Nəqliyyat"],
      ["/forum", "Forum"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="simple-hide border-t border-line bg-surface print:hidden">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-heading text-base font-bold">{col.title}</p>
              <ul className="mt-2 space-y-1.5">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      prefetch={false}
                      className="text-sm text-ink-soft underline-offset-2 hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="carpet-divider mt-6" aria-hidden />
        <p className="mt-4 text-sm text-ink-soft">
          © {new Date().getFullYear()} Xıdırlı kəndi · Ağdam rayonu, Qarabağ,
          Azərbaycan ·{" "}
          <Link href="/gizlilik" className="underline underline-offset-2">
            Gizlilik
          </Link>{" "}
          ·{" "}
          <Link href="/komek" className="underline underline-offset-2">
            Kömək
          </Link>
        </p>
      </div>
    </footer>
  );
}
