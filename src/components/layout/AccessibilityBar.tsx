"use client";

import { useEffect, useState } from "react";
import { readPrefs, savePrefs, type Prefs } from "@/lib/prefs";

/** Başlıqdakı daimi əlçatanlıq paneli: A− / A+ / tema */
export default function AccessibilityBar() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);

  useEffect(() => {
    setPrefs(readPrefs());
  }, []);

  function update(patch: Partial<Prefs>) {
    const next = { ...(prefs ?? readPrefs()), ...patch };
    setPrefs(next);
    savePrefs(next);
  }

  const fs = prefs?.fontscale ?? 1;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Əlçatanlıq">
      <button
        type="button"
        onClick={() => update({ fontscale: Math.max(0, fs - 1) })}
        className="h-11 w-11 rounded-xl border border-line bg-surface text-base font-bold active:bg-surface-2"
        aria-label="Şrifti kiçilt"
        title="Şrifti kiçilt"
      >
        A−
      </button>
      <button
        type="button"
        onClick={() => update({ fontscale: Math.min(3, fs + 1) })}
        className="h-11 w-11 rounded-xl border border-line bg-surface text-lg font-bold active:bg-surface-2"
        aria-label="Şrifti böyüt"
        title="Şrifti böyüt"
      >
        A+
      </button>
      <button
        type="button"
        onClick={() => update({ theme: prefs?.theme === "dark" ? "light" : "dark" })}
        className="h-11 w-11 rounded-xl border border-line bg-surface text-lg active:bg-surface-2"
        aria-label="Tünd / işıqlı rejim"
        title="Tünd / işıqlı rejim"
      >
        ◐
      </button>
    </div>
  );
}
