import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Statik səhifə üçün öncədən yazılmış TTS audio faylının yolunu qaytarır (varsa).
 * Fayllar scripts/tts.mjs ilə content/tts/<ad>.txt → public/audio/<ad>.mp3
 * kimi yaradılır və commit olunur. Yalnız server komponentlərində çağırıla
 * bilər (node:fs istifadə edir).
 */
export function ttsAudioSrc(name: string): string | undefined {
  return existsSync(path.join(process.cwd(), "public", "audio", `${name}.mp3`))
    ? `/audio/${name}.mp3`
    : undefined;
}
