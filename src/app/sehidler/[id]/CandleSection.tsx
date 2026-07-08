"use client";

import { useEffect, useState } from "react";
import { lightCandle } from "./actions";

/*
  Rəqəmsal xatirə şamı — sakit, hörmətli, animasiyasız (memorial qaydası).
  Təkrar yandırmanın qarşısı yumşaq üsulla alınır: cihazda localStorage
  işarəsi. Sayğac serverdən gəlir, yandırandan sonra lokal artırılır.
*/
export default function CandleSection({
  martyrId,
  initialCount,
}: {
  martyrId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [state, setState] = useState<"hazir" | "gonderilir" | "yanib">("hazir");
  const storageKey = `xdr-sam-${martyrId}`;

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) setState("yanib");
    } catch {
      /* localStorage bağlıdırsa sadəcə düymə aktiv qalır */
    }
  }, [storageKey]);

  async function onLight() {
    setState("gonderilir");
    const ok = await lightCandle(martyrId);
    if (ok) {
      setCount((c) => c + 1);
      setState("yanib");
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        /* yaddaş bağlıdırsa keçirik */
      }
    } else {
      setState("hazir");
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 text-center">
      <p className="text-3xl" aria-hidden>🕯️</p>
      {count > 0 && (
        <p className="mt-2 text-ink-soft">
          Bu profildə <strong>{count}</strong> xatirə şamı yanır
        </p>
      )}
      {state === "yanib" ? (
        <p className="mt-3 font-bold">Şamınız yanır. Ruhu şad olsun.</p>
      ) : (
        <button
          type="button"
          onClick={onLight}
          disabled={state === "gonderilir"}
          className={`mt-3 min-h-12 rounded-xl border border-line bg-surface-2 px-6 font-bold ${
            state === "gonderilir" ? "opacity-60" : ""
          }`}
        >
          Xatirə şamı yandır
        </button>
      )}
    </section>
  );
}
