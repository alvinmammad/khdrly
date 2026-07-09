/*
  İllik arxiv ixracı — kəndin rəqəmsal yaddaşının tam nüsxəsi.
  Bütün cədvəllər JSON kimi, media bucket-dəki bütün fayllar isə
  olduğu kimi lokal qovluğa yüklənir. Nəticəni xarici diskə/buluda
  köçürün — yaddaş tək platformadan asılı qalmasın.

  İstifadə:
    node scripts/arxiv-ixrac.mjs        # nəticə: arxiv-YYYY-MM-DD/

  Tələb (.env.local): SUPABASE_SERVICE_ROLE_KEY (sb_secret_...)
  — yalnız bu skript üçün, heç vaxt commit etməyin.
*/

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const TABLES = [
  "profiles", "user_roles", "news", "events", "duty_info", "places",
  "martyrs", "notifications", "producers", "products", "listings",
  "timeline_entries", "media_items", "service_providers",
  "transport_routes", "stays", "notable_people", "donations",
  "memorial_candles", "guest_entries", "forum_topics", "forum_posts",
  "orders", "order_messages", "product_reviews", "families",
  "oral_histories", "then_now", "issues", "memory_pins",
  "event_rsvps", "polls", "poll_votes", "video_items",
];

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

const env = loadEnvLocal();
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error(
    "XƏTA: SUPABASE_SERVICE_ROLE_KEY lazımdır (.env.local). Dashboard → API Keys → secret."
  );
  process.exit(1);
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const outDir = `arxiv-${new Date().toISOString().slice(0, 10)}`;
mkdirSync(path.join(outDir, "cedveller"), { recursive: true });
mkdirSync(path.join(outDir, "media"), { recursive: true });

// ---------- Cədvəllər ----------
for (const t of TABLES) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(`${URL_}/rest/v1/${t}?select=*`, {
      headers: { ...headers, Range: `${from}-${from + 999}` },
    });
    if (!r.ok) {
      console.log(`  ⚠ ${t}: ${r.status} (ötürüldü)`);
      break;
    }
    const chunk = await r.json();
    rows.push(...chunk);
    if (chunk.length < 1000) {
      writeFileSync(
        path.join(outDir, "cedveller", `${t}.json`),
        JSON.stringify(rows, null, 1)
      );
      console.log(`  ✓ ${t}: ${rows.length} sətir`);
      break;
    }
  }
}

// ---------- Media faylları ----------
async function listAll(prefix) {
  const r = await fetch(`${URL_}/storage/v1/object/list/media`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix, limit: 1000 }),
  });
  if (!r.ok) return [];
  return r.json();
}

const folders = await listAll("");
let say = 0;
for (const f of folders) {
  if (f.id) continue; // fayldır, qovluq deyil (kökdə fayl gözlənilmir)
  const files = await listAll(f.name + "/");
  mkdirSync(path.join(outDir, "media", f.name), { recursive: true });
  for (const file of files) {
    if (!file.id) continue;
    const p = `${f.name}/${file.name}`;
    const r = await fetch(`${URL_}/storage/v1/object/media/${p}`, { headers });
    if (r.ok) {
      writeFileSync(
        path.join(outDir, "media", p),
        Buffer.from(await r.arrayBuffer())
      );
      say++;
    }
  }
}
console.log(`  ✓ media: ${say} fayl`);
console.log(`\nHazır: ${outDir}/ — bu qovluğu xarici diskə köçürün.`);
