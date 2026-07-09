"use client";

import { useEffect, useState } from "react";
import { readPrefs } from "@/lib/prefs";

/*
  Az-data rejimini bilən şəkil: rejim açıqdırsa şəkil yüklənmir,
  yerində "Şəkli göstər" düyməsi durur — bir toxunuşla yüklənir.
  Rejim bağlıdırsa adi şəkil kimi işləyir (lazy).
*/
export default function SmartImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  // İlk render placeholder-dir (server HTML-ə şəkil düşmür, data sərf olunmur)
  const [mode, setMode] = useState<"gozleyir" | "goster" | "soruş">("gozleyir");

  useEffect(() => {
    setMode(readPrefs().lowData ? "soruş" : "goster");
  }, []);

  if (mode === "goster") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={className} />;
  }

  return (
    <button
      type="button"
      disabled={mode === "gozleyir"}
      onClick={() => setMode("goster")}
      aria-label={`Şəkli göstər: ${alt}`}
      className={`flex items-center justify-center bg-surface-2 text-ink-soft ${className ?? ""}`}
    >
      {mode === "soruş" ? (
        <span className="p-3 text-center text-sm font-bold">
          📷 Şəkli göstər
        </span>
      ) : (
        <span aria-hidden>📷</span>
      )}
    </button>
  );
}
