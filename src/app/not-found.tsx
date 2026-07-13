import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Səhifə tapılmadı",
  robots: { index: false },
};

/** Xüsusi 404 — yaşlı istifadəçini çıxılmaz vəziyyətdə qoymur */
export default function NotFound() {
  return (
    <div className="space-y-5 py-8 text-center">
      <p className="text-6xl" aria-hidden>🧭</p>
      <h1 className="font-heading text-2xl font-bold">Səhifə tapılmadı</h1>
      <p className="mx-auto max-w-sm text-ink-soft">
        Axtardığınız səhifə mövcud deyil və ya ünvanı dəyişib. Narahat olmayın —
        aşağıdakı düymələrlə davam edin.
      </p>
      <div className="mx-auto grid max-w-sm gap-3">
        <Link
          href="/"
          className="flex min-h-14 items-center justify-center rounded-2xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          🏠 Ana səhifəyə qayıt
        </Link>
        <Link
          href="/bolmeler"
          className="flex min-h-14 items-center justify-center rounded-2xl border border-line bg-surface font-bold active:bg-surface-2"
        >
          ☰ Bütün bölmələrə bax
        </Link>
      </div>
    </div>
  );
}
