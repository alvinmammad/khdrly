import type { Metadata } from "next";
import Link from "next/link";
import { AQRO_TEQVIM } from "@/lib/aqroTeqvim";

export const metadata: Metadata = { title: "Təsərrüfat təqvimi" };

export const revalidate = 3600;

export default function AgroCalendarPage() {
  // Bakı vaxtı ilə cari ay (0-indeksli)
  const currentMonth = new Date(Date.now() + 4 * 60 * 60 * 1000).getUTCMonth();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-bold">🌾 Təsərrüfat təqvimi</h1>
        <p className="mt-2 text-ink-soft">
          Qarabağ düzü üçün aylıq bağ-bostan və təsərrüfat məsləhətləri.
          Bu günün havasına görə tövsiyələr{" "}
          <Link href="/hava" className="font-bold text-kerpic">
            Hava səhifəsində
          </Link>
          .
        </p>
      </header>

      <div className="space-y-3">
        {AQRO_TEQVIM.map((m, i) => (
          <section
            key={m.ay}
            className={`rounded-2xl border bg-surface p-5 ${
              i === currentMonth
                ? "border-2 border-kerpic"
                : "border-line"
            }`}
          >
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <span aria-hidden>{m.icon}</span> {m.ay}
              {i === currentMonth && (
                <span className="rounded-full bg-kerpic/10 px-3 py-0.5 text-sm font-bold text-kerpic">
                  bu ay
                </span>
              )}
            </h2>
            <ul className="mt-2 space-y-1.5">
              {m.isler.map((is) => (
                <li key={is} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{is}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="simple-hide text-sm text-ink-soft">
        Məsləhətlər ümumidir — konkret sahəniz üçün aqronomla məsləhətləşin.
      </p>
    </div>
  );
}
