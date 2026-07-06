/*
  Azure TTS ilə "Səsli dinlə" audio fayllarının generasiyası.

  İstifadə:
    node scripts/tts.mjs            # content/tts/*.txt → public/audio/*.mp3

  Tələblər (.env.local və ya mühit dəyişəni):
    AZURE_SPEECH_KEY     — Azure Speech resursunun açarı (F0 pulsuz tier yetər)
    AZURE_SPEECH_REGION  — resursun regionu (məs. westeurope)

  Mətnləri content/tts/ qovluğunda saxlayın; fayl adı çıxış adını verir
  (tarix.txt → /audio/tarix.mp3). Səhifə mətni dəyişəndə txt faylını da
  yeniləyib skripti yenidən işlədin, mp3-ü commit edin.
*/

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const VOICE = "az-AZ-BanuNeural"; // qadın səsi; kişi səsi: az-AZ-BabekNeural
const FORMAT = "audio-24khz-48kbitrate-mono-mp3";
const CHUNK_LIMIT = 3000; // hər sorğuda maksimum simvol

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
const KEY = process.env.AZURE_SPEECH_KEY || envFile.AZURE_SPEECH_KEY;
const REGION =
  process.env.AZURE_SPEECH_REGION || envFile.AZURE_SPEECH_REGION || "westeurope";

if (!KEY) {
  console.error(
    "XƏTA: AZURE_SPEECH_KEY tapılmadı. .env.local faylına əlavə edin (bax: .env.example)."
  );
  process.exit(1);
}

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

async function synthesize(text) {
  const ssml = `<speak version="1.0" xml:lang="az-AZ"><voice name="${VOICE}"><prosody rate="-8%">${escapeXml(
    text
  )}</prosody></voice></speak>`;

  const res = await fetch(
    `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": FORMAT,
        "User-Agent": "xidirli-kend-tts",
      },
      body: ssml,
    }
  );
  if (!res.ok) {
    throw new Error(`Azure TTS xətası: ${res.status} ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

const srcDir = path.join(process.cwd(), "content", "tts");
const outDir = path.join(process.cwd(), "public", "audio");
mkdirSync(outDir, { recursive: true });

const files = readdirSync(srcDir).filter((f) => f.endsWith(".txt"));
if (files.length === 0) {
  console.log("content/tts/ qovluğunda .txt faylı yoxdur.");
  process.exit(0);
}

for (const file of files) {
  const name = path.basename(file, ".txt");
  const text = readFileSync(path.join(srcDir, file), "utf8");
  const chunks = chunkText(text);
  console.log(`→ ${name}: ${text.length} simvol, ${chunks.length} hissə...`);

  const buffers = [];
  for (const chunk of chunks) {
    buffers.push(await synthesize(chunk));
  }
  const out = path.join(outDir, `${name}.mp3`);
  writeFileSync(out, Buffer.concat(buffers));
  console.log(`  ✓ ${out} (${Math.round(Buffer.concat(buffers).length / 1024)} KB)`);
}

console.log("Hazır. mp3 faylları commit etməyi unutmayın.");
