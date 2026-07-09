/*
  Şifahi tarix üçün transkripsiya (Whisper).

  İstifadə:
    node scripts/stt.mjs sohbet.m4a        # nəticə: sohbet.txt

  Açar (.env.local və ya mühit dəyişəni):
    WHISPER_API_KEY  — PULSUZ almaq üçün: https://console.groq.com
                       (Groq-un pulsuz tier-i Whisper large-v3 verir)
    WHISPER_BASE_URL — standart: https://api.groq.com/openai/v1
                       (OpenAI açarı ilə də işləyir: https://api.openai.com/v1)

  Nəticə mətni admin paneldəki "transkripsiya" sahəsinə yapışdırın.
  Azərbaycan dili dəstəklənir; ləhcəli danışıqda əl ilə düzəliş lazım
  ola bilər — mətn hər halda axtarış üçün böyük dəyərdir.
*/

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const env = {};
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {}
  return env;
}

const envFile = loadEnvLocal();
const KEY = process.env.WHISPER_API_KEY || envFile.WHISPER_API_KEY;
const BASE =
  process.env.WHISPER_BASE_URL ||
  envFile.WHISPER_BASE_URL ||
  "https://api.groq.com/openai/v1";
const MODEL = BASE.includes("groq") ? "whisper-large-v3" : "whisper-1";

const file = process.argv[2];
if (!file) {
  console.error("İstifadə: node scripts/stt.mjs <ses-fayli>");
  process.exit(1);
}
if (!KEY) {
  console.error(
    "XƏTA: WHISPER_API_KEY tapılmadı. Pulsuz açar: https://console.groq.com → API Keys.\n.env.local faylına əlavə edin: WHISPER_API_KEY=gsk_..."
  );
  process.exit(1);
}

const buf = readFileSync(file);
const fd = new FormData();
fd.append("file", new Blob([buf]), path.basename(file));
fd.append("model", MODEL);
fd.append("language", "az");
fd.append("response_format", "text");

console.log(`→ ${file} (${Math.round(buf.length / 1024)} KB) transkripsiya olunur...`);
const res = await fetch(`${BASE}/audio/transcriptions`, {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}` },
  body: fd,
});
if (!res.ok) {
  console.error(`Xəta: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const text = (await res.text()).trim();

const out = file.replace(/\.[^.]+$/, "") + ".txt";
writeFileSync(out, text + "\n");
console.log(`✓ ${out} yazıldı (${text.length} simvol). Admin panelə yapışdırın.`);
