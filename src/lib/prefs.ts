"use client";

// İstifadəçi seçimləri (şrift ölçüsü, tema, kontrast, sadə görünüş) —
// localStorage-da saxlanılır, <html> data-atributları ilə tətbiq olunur.
// İlk render-dən əvvəl tətbiq edən inline skript layout.tsx-dədir.

export interface Prefs {
  fontscale: number; // 0..3 (1 = standart 18px)
  theme: "light" | "dark";
  contrast: "normal" | "high";
  simple: boolean;
}

const KEY = "xdr-prefs";

export const DEFAULT_PREFS: Prefs = {
  fontscale: 1,
  theme: "light",
  contrast: "normal",
  simple: false,
};

export function readPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function applyPrefs(p: Prefs) {
  const d = document.documentElement;
  d.dataset.fontscale = String(p.fontscale);
  d.dataset.theme = p.theme;
  d.dataset.contrast = p.contrast;
  if (p.simple) d.dataset.simple = "1";
  else delete d.dataset.simple;
}

export function savePrefs(p: Prefs) {
  localStorage.setItem(KEY, JSON.stringify(p));
  applyPrefs(p);
}

/** layout.tsx <head>-də işlədilir — fərqli tema seçən istifadəçidə "parıltı" olmasın */
export const PREFS_BOOT_SCRIPT = `try{var p=JSON.parse(localStorage.getItem("${KEY}")||"{}");var d=document.documentElement;if(p.fontscale!=null)d.dataset.fontscale=String(p.fontscale);if(p.theme)d.dataset.theme=p.theme;if(p.contrast)d.dataset.contrast=p.contrast;if(p.simple)d.dataset.simple="1";}catch(e){}`;
