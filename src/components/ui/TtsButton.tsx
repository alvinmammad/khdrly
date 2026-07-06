"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Səsli dinlə" düyməsi — oxumaqda çətinlik çəkən sakinlər üçün.
 * audioSrc verilsə, Azure TTS ilə öncədən yazılmış audio çalınır
 * (keyfiyyətli AZ səsi, SW keşi ilə oflayn da işləyir); verilməsə,
 * cihazın öz səsləndirməsi (Web Speech API) istifadə olunur.
 * Audio yaratmaq üçün: scripts/tts.mjs (AZURE_SPEECH_KEY tələb edir).
 */
export default function TtsButton({
  text,
  audioSrc,
}: {
  text: string;
  audioSrc?: string;
}) {
  const [state, setState] = useState<"idle" | "speaking" | "unsupported">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (
      !audioSrc &&
      typeof window !== "undefined" &&
      !("speechSynthesis" in window)
    ) {
      setState("unsupported");
    }
    return () => {
      audioRef.current?.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioSrc]);

  if (state === "unsupported") return null;

  function toggleAudio(src: string) {
    if (state === "speaking") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }
    if (!audioRef.current) {
      const a = new Audio(src);
      a.onended = () => setState("idle");
      a.onerror = () => setState("idle");
      audioRef.current = a;
    }
    audioRef.current.play().catch(() => setState("idle"));
    setState("speaking");
  }

  function toggleSpeech() {
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
    synth.speak(u);
    setState("speaking");
  }

  return (
    <button
      type="button"
      onClick={() => (audioSrc ? toggleAudio(audioSrc) : toggleSpeech())}
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
