"use client";

/** Gözlənilməz xəta ekranı — texniki jarqonsuz, bir düymə ilə bərpa */
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-5 py-8 text-center">
      <p className="text-6xl" aria-hidden>⚠️</p>
      <h1 className="font-heading text-2xl font-bold">Nə isə səhv getdi</h1>
      <p className="mx-auto max-w-sm text-ink-soft">
        Səhifə yüklənərkən xəta baş verdi. Bu, adətən müvəqqəti olur — bir daha
        cəhd edin.
      </p>
      <div className="mx-auto grid max-w-sm gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex min-h-14 items-center justify-center rounded-2xl bg-kerpic text-lg font-bold text-white active:bg-kerpic-strong"
        >
          🔄 Yenidən cəhd et
        </button>
        <a
          href="/"
          className="flex min-h-14 items-center justify-center rounded-2xl border border-line bg-surface font-bold active:bg-surface-2"
        >
          🏠 Ana səhifəyə qayıt
        </a>
      </div>
    </div>
  );
}
