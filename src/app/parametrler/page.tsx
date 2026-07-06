"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PREFS, readPrefs, savePrefs, type Prefs } from "@/lib/prefs";

/** Əlçatanlıq parametrləri — böyük, sadə idarəetmələr */
export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrefs(readPrefs());
    setLoaded(true);
  }, []);

  function update(patch: Partial<Prefs>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  }

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Parametrlər</h1>

      {/* Şrift ölçüsü */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-lg font-bold">🔠 Yazı ölçüsü</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(["Kiçik", "Normal", "Böyük", "Ən böyük"] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => update({ fontscale: i })}
              className={`min-h-14 rounded-xl border-2 font-bold ${
                prefs.fontscale === i
                  ? "border-kerpic bg-kerpic/10 text-kerpic"
                  : "border-line bg-surface"
              }`}
              aria-pressed={prefs.fontscale === i}
            >
              <span style={{ fontSize: `${0.8 + i * 0.18}rem` }}>A</span>
              <span className="block text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Tema */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-lg font-bold">🌗 Görünüş rejimi</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update({ theme: "light" })}
            className={`min-h-14 rounded-xl border-2 font-bold ${
              prefs.theme === "light"
                ? "border-kerpic bg-kerpic/10 text-kerpic"
                : "border-line"
            }`}
            aria-pressed={prefs.theme === "light"}
          >
            ☀️ İşıqlı
          </button>
          <button
            type="button"
            onClick={() => update({ theme: "dark" })}
            className={`min-h-14 rounded-xl border-2 font-bold ${
              prefs.theme === "dark"
                ? "border-kerpic bg-kerpic/10 text-kerpic"
                : "border-line"
            }`}
            aria-pressed={prefs.theme === "dark"}
          >
            🌙 Tünd
          </button>
        </div>
      </section>

      {/* Asan oxu */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">👁️ Asan oxu rejimi</p>
            <p className="text-ink-soft">Yüksək kontrast — daha aydın yazılar</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.contrast === "high"}
            onClick={() =>
              update({ contrast: prefs.contrast === "high" ? "normal" : "high" })
            }
            className={`h-9 w-16 shrink-0 rounded-full p-1 transition-colors ${
              prefs.contrast === "high" ? "bg-kerpic" : "bg-surface-2 border border-line"
            }`}
          >
            <span
              className={`block h-7 w-7 rounded-full bg-white shadow transition-transform ${
                prefs.contrast === "high" ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </section>

      {/* Sadə görünüş */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">🔳 Sadə görünüş</p>
            <p className="text-ink-soft">
              Ana səhifədə yalnız əsas düymələr, tək sütunda
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.simple}
            onClick={() => update({ simple: !prefs.simple })}
            className={`h-9 w-16 shrink-0 rounded-full p-1 transition-colors ${
              prefs.simple ? "bg-kerpic" : "bg-surface-2 border border-line"
            }`}
          >
            <span
              className={`block h-7 w-7 rounded-full bg-white shadow transition-transform ${
                prefs.simple ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </section>

      <p className="text-sm text-ink-soft">
        Seçimləriniz bu cihazda yadda saxlanılır və tətbiqi hər açanda tətbiq olunur.
      </p>
    </div>
  );
}
