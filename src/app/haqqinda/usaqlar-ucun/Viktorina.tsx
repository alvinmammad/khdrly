"use client";

import { useState } from "react";

/*
  Uşaq viktorinası — kənd tarixi oyunla öyrənilir.
  Yalnız təsdiqlənmiş, hamıya məlum faktlar.
*/

const SUALLAR: { sual: string; variantlar: string[]; duz: number }[] = [
  {
    sual: "Xıdırlı hansı rayondadır?",
    variantlar: ["Bərdə", "Ağdam", "Tərtər"],
    duz: 1,
  },
  {
    sual: "Kəndimiz ən çox nə ilə məşhurdur?",
    variantlar: ["Qaymaq", "Xalça", "Bal"],
    duz: 0,
  },
  {
    sual: "Xıdırlı qaymağı hansı heyvanın südündən hazırlanır?",
    variantlar: ["İnək", "Keçi", "Camış"],
    duz: 2,
  },
  {
    sual: "Ağdam neçənci ildə işğal olunmuşdu?",
    variantlar: ["1993", "1988", "2003"],
    duz: 0,
  },
  {
    sual: "Torpaqlarımız neçənci ildə azad olundu?",
    variantlar: ["2016", "2020", "2023"],
    duz: 1,
  },
  {
    sual: "İşğal neçə il davam etdi?",
    variantlar: ["10 il", "27 il", "40 il"],
    duz: 1,
  },
  {
    sual: "Vətən müharibəsi neçə gün çəkdi?",
    variantlar: ["44 gün", "30 gün", "100 gün"],
    duz: 0,
  },
  {
    sual: "Kəndlərin bərpası proqramının adı nədir?",
    variantlar: ["Yeni Kənd", "Böyük Qayıdış", "Doğma Yurd"],
    duz: 1,
  },
];

export default function Viktorina() {
  const [addim, setAddim] = useState(0);
  const [bal, setBal] = useState(0);
  const [secim, setSecim] = useState<number | null>(null);

  const bitdi = addim >= SUALLAR.length;

  function cavabla(i: number) {
    if (secim !== null) return;
    setSecim(i);
    if (i === SUALLAR[addim].duz) setBal((b) => b + 1);
    setTimeout(() => {
      setSecim(null);
      setAddim((a) => a + 1);
    }, 1200);
  }

  function yeniden() {
    setAddim(0);
    setBal(0);
    setSecim(null);
  }

  if (bitdi) {
    const emoji = bal === SUALLAR.length ? "🏆" : bal >= 5 ? "🌟" : "💪";
    return (
      <div className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-6 text-center">
        <p className="text-5xl" aria-hidden>{emoji}</p>
        <p className="mt-2 text-2xl font-bold">
          {bal} / {SUALLAR.length}
        </p>
        <p className="mt-1 text-ink-soft">
          {bal === SUALLAR.length
            ? "Əla! Sən əsl Xıdırlı bilicisisən!"
            : bal >= 5
              ? "Çox yaxşı! Bir az da oxu, hamısını biləcəksən."
              : "Yaxşı başlanğıcdır — yuxarıdakı hekayəni bir də oxu!"}
        </p>
        <button
          type="button"
          onClick={yeniden}
          className="mt-4 min-h-12 rounded-xl bg-kerpic px-6 font-bold text-white active:bg-kerpic-strong"
        >
          🔄 Yenidən oyna
        </button>
      </div>
    );
  }

  const s = SUALLAR[addim];

  return (
    <div className="rounded-2xl border-2 border-gunebaxan bg-gunebaxan/10 p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
        🧠 Sual {addim + 1} / {SUALLAR.length} · Bal: {bal}
      </p>
      <p className="mt-2 text-lg font-bold">{s.sual}</p>
      <div className="mt-3 space-y-2">
        {s.variantlar.map((v, i) => {
          let stil = "border-line bg-surface";
          if (secim !== null) {
            if (i === s.duz) stil = "border-zeytun bg-zeytun/15";
            else if (i === secim) stil = "border-nar bg-nar/10";
          }
          return (
            <button
              key={v}
              type="button"
              disabled={secim !== null}
              onClick={() => cavabla(i)}
              className={`block min-h-12 w-full rounded-xl border-2 px-4 text-left font-medium ${stil}`}
            >
              {secim !== null && i === s.duz ? "✅ " : ""}
              {secim === i && i !== s.duz ? "❌ " : ""}
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
