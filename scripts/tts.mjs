/*
  Gemini TTS ilə "Səsli dinlə" audio fayllarının generasiyası.

  İstifadə:
    node scripts/tts.mjs            # content/tts/*.txt → public/audio/*.mp3

  Tələblər (.env.local və ya mühit dəyişəni):
    GEMINI_API_KEY      — Google AI Studio açarı (aistudio.google.com → "Get API key")

  İstəyə bağlı:
    GEMINI_TTS_MODEL    — default: gemini-3.1-flash-tts-preview
                          (açarınızın səviyyəsində işləməsə: gemini-2.5-flash-preview-tts)
    GEMINI_TTS_VOICE    — default: Sulafat (isti ton). Digərləri: Kore, Aoede, Leda,
                          Charon, Puck, Zephyr və s. (cəmi 30 səs, hamısı AZ oxuyur)

  Model 24kHz 16-bit mono PCM qaytarır; skript onu 48 kbps mp3-ə çevirir
  (zəif internet üçün kiçik fayl). Mətnləri content/tts/ qovluğunda saxlayın;
  fayl adı çıxış adını verir (tarix.txt → /audio/tarix.mp3). Səhifə mətni
  dəyişəndə txt faylını da yeniləyib skripti yenidən işlədin, mp3-ü commit edin.
*/

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as lame from "@breezystack/lamejs";

const Mp3Encoder = lame.Mp3Encoder ?? lame.default?.Mp3Encoder;

const CHUNK_LIMIT = 3500; // hər sorğuda maksimum simvol (limit 32k tokendir, ehtiyatla)
const SAMPLE_RATE = 24000;
const MP3_KBPS = 48;
// Oxunuş üslubu — sorğunun əvvəlinə qoyulur, səsləndirilmir (Gemini TTS bunu
// təlimat kimi başa düşür)
const STYLE = "Aşağıdakı mətni Azərbaycan dilində sakit, aydın və isti tonda oxu: ";

function loadEnvLocal() {
  const env = {};
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {
    /* .env.local yoxdursa yalnız mühit dəyişənləri işlədilir */
  }
  return env;
}

const envFile = loadEnvLocal();
const KEY = process.env.GEMINI_API_KEY || envFile.GEMINI_API_KEY;
const MODEL =
  process.env.GEMINI_TTS_MODEL ||
  envFile.GEMINI_TTS_MODEL ||
  "gemini-3.1-flash-tts-preview";
const VOICE = process.env.GEMINI_TTS_VOICE || envFile.GEMINI_TTS_VOICE || "Sulafat";

if (!KEY) {
  console.error(
    "XƏTA: GEMINI_API_KEY tapılmadı. aistudio.google.com-dan açar alıb .env.local faylına əlavə edin (bax: .env.example)."
  );
  process.exit(1);
}

/** Mətni cümlə sərhədlərində CHUNK_LIMIT-ə sığan hissələrə bölür. */
function chunkText(text) {
  const sentences = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/);
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).length > CHUNK_LIMIT && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Cavabdan base64 PCM-i çıxarır — API-nin bir neçə mümkün forması üçün. */
function extractAudio(j) {
  // Yeni "interactions" formatı: steps[].content[] içində audio elementi
  // (gemini-3.1-flash-tts-preview → mime_type "audio/l16", 24kHz mono PCM)
  for (const step of j?.steps ?? []) {
    for (const c of step?.content ?? []) {
      if (c?.data && (c.type === "audio" || String(c.mime_type ?? "").startsWith("audio")))
        return c.data;
    }
  }
  // Köhnə/alternativ formalar
  return (
    j?.output_audio?.data ??
    j?.outputAudio?.data ??
    j?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
    j?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data
  );
}

async function synthesize(text) {
  const body = {
    model: MODEL,
    input: `${STYLE}${text}`,
    response_format: { type: "audio" },
    generation_config: { speech_config: [{ voice: VOICE }] },
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (res.status === 429 || res.status === 503) {
      // preview modellərin dəqiqəlik limiti dardır — gözləyib təkrar cəhd
      console.log(`  ... limit (${res.status}), 20 saniyə gözlənilir (cəhd ${attempt}/3)`);
      await sleep(20000);
      continue;
    }
    if (!res.ok) {
      throw new Error(`Gemini TTS xətası: ${res.status} ${await res.text()}`);
    }
    const j = await res.json();
    const b64 = extractAudio(j);
    if (!b64) {
      throw new Error(
        `Cavabda audio tapılmadı. Cavabın başlanğıcı: ${JSON.stringify(j).slice(0, 400)}`
      );
    }
    return Buffer.from(b64, "base64"); // xam PCM (24kHz, 16-bit, mono)
  }
  throw new Error("Gemini TTS: limit 3 cəhddən sonra da keçilmədi. Bir az sonra yenidən işlədin.");
}

/** 24kHz 16-bit mono PCM → 48 kbps mp3 */
function pcmToMp3(pcm) {
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
  const encoder = new Mp3Encoder(1, SAMPLE_RATE, MP3_KBPS);
  const parts = [];
  const BLOCK = 1152;
  for (let i = 0; i < samples.length; i += BLOCK) {
    const out = encoder.encodeBuffer(samples.subarray(i, i + BLOCK));
    if (out.length) parts.push(Buffer.from(out));
  }
  const end = encoder.flush();
  if (end.length) parts.push(Buffer.from(end));
  return Buffer.concat(parts);
}

const srcDir = path.join(process.cwd(), "content", "tts");
const outDir = path.join(process.cwd(), "public", "audio");
mkdirSync(outDir, { recursive: true });

const files = readdirSync(srcDir).filter((f) => f.endsWith(".txt"));
if (files.length === 0) {
  console.log("content/tts/ qovluğunda .txt faylı yoxdur.");
  process.exit(0);
}

console.log(`Model: ${MODEL} · Səs: ${VOICE}`);
for (const file of files) {
  const name = path.basename(file, ".txt");
  const text = readFileSync(path.join(srcDir, file), "utf8");
  const chunks = chunkText(text);
  console.log(`→ ${name}: ${text.length} simvol, ${chunks.length} hissə...`);

  const pcmParts = [];
  for (const chunk of chunks) {
    pcmParts.push(await synthesize(chunk));
    await sleep(3000); // preview limitlərinə hörmət
  }
  const mp3 = pcmToMp3(Buffer.concat(pcmParts));
  const out = path.join(outDir, `${name}.mp3`);
  writeFileSync(out, mp3);
  console.log(`  ✓ ${out} (${Math.round(mp3.length / 1024)} KB)`);
}

console.log("Hazır. mp3 faylları commit etməyi unutmayın.");
