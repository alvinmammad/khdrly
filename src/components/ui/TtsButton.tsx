"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Səsli dinlə" düyməsi — oxumaqda çətinlik çəkən sakinlər üçün.
 * Cihazın öz səsləndirməsindən (Web Speech API) istifadə edir; AZ səsi
 * olmayan cihazlarda mövcud ən yaxın səslə oxuyur. Mərhələ 2-də statik
 * səhifələr üçün Azure TTS ilə öncədən yazılmış audio əlavə olunacaq.
 */
export default function TtsButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "speaking" | "unsupported">("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setState("unsupported");
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (state === "unsupported") return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (state === "speaking") {
      synth.cancel();
      setState("idle");
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const azVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith("az")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("tr"));
    if (azVoice) u.voice = azVoice;
    u.lang = azVoice?.lang ?? "az-AZ";
    u.rate = 0.95;
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    utteranceRef.current = u;
    synth.speak(u);
    setState("speaking");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-surface px-4 font-bold active:bg-surface-2"
      aria-pressed={state === "speaking"}
    >
      <span className="text-xl" aria-hidden>
        {state === "speaking" ? "⏹️" : "🔊"}
      </span>
      {state === "speaking" ? "Dayandır" : "Səsli dinlə"}
    </button>
  );
}
