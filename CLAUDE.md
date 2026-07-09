# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web + mobile (PWA) app for Xıdırlı village, Ağdam district, Azerbaijan — a "digital home" combining the village's historical memory (occupation 1993–2020, liberation, rebuilding), live information (weather, duty rosters, news), an interactive map, and future marketplace/community modules. The full requirements are in `xidirli-kend-app-prompt.md`; the approved architecture/roadmap plan is in `docs/PLAN.md`. Phase 1 (MVP) is partially done; Phase 1 code is complete: `/admin` CRUD for all 5 content types (martyrs dual-approval flow; martyrs admin section requires the `admin` role specifically, not just staff), Web Push notifications, and TTS audio. Phase 2 core is done: **Bazar v1** (producer/product catalog with seasonal auto-hiding, qaymaq flagship section, `tel:` call buttons; orders/Realtime chat/reviews deferred), **Elanlar** (listings + lost/found with `valid_to` auto-expiry), **timeline** (`/haqqinda/azadliq` + sepia `/haqqinda/isgal-dovru`; occupation-era facts require sources — server action + DB CHECK), **media archive + "Siz də paylaşın"** (anonymous upload → browser-side compression `src/lib/imageCompress.ts` → Storage `media` bucket `paylasilan/` folder → `pending` row → staff moderation at `/admin/media`; bucket + policies created in migration 0006). Phase 3 is mostly done: **Xidmətlər** (`/xidmetler`, categories in `src/lib/xidmetMeta.ts`), **Nəqliyyat** (`/neqliyyat`), **Turizm/kirayə** (`/turizm`, stays), **Məşhurlarımız** (`/haqqinda/meshurlar`, notable_people — publish requires ≥1 source like martyrs/occupation facts), **İanə reyestri** (`/ianeler`, transparent donations list + AZN total; no online payments) — all staff-entered with `tel:` buttons where relevant. QR system is done (`/q/[slug]` stable redirect → `/yer/[slug]` public place page; printable posters at `/admin/qr` — needs `NEXT_PUBLIC_SITE_URL`; layout chrome is `print:hidden`). Memorial candles are done (migration 0012, anonymous counter on martyr pages, RLS allows inserts only for approved profiles; localStorage soft-guard). Then-and-now slider is done (migration 0013, `then_now` table, staff uploads via `src/lib/supabase/browserAuth.ts` cookie-authed browser client → `onda-indi/` storage folder, sliders render on the media archive page). Anniversary push, prayer times widget (`adhan`, offline calc) and "Bu gün tariximizdə" home block are done. Children's history (`/haqqinda/usaqlar-ucun`), guest book (migration 0014, anon `pending` entries → staff moderation at `/admin/qonaq-kitabi`), and low-data mode (`lowData` pref; `SmartImage` + ThenNowSlider load images on demand) are done; farmer weather tips existed since Phase 1 (`farmerAdvice` in `src/lib/weather.ts`). Remainders — Phase 2: bazar orders/chat/reviews, Capacitor store release; Phase 3: forum, şəcərə/diaspora, oral history (needs audio + Whisper), PMTiles map switch. Deployment-side steps that may still be pending: running migration 0012 (0001–0011 are applied), generating TTS mp3s (needs an Azure key), Vercel env vars. (Read-path Supabase wiring and Supabase Auth + `/admin` shell are done — see "Data layer" and "Admin panel" below.)

**All UI text is Azerbaijani.** Communication with the project owner is also in Azerbaijani.

## Commands

```bash
npm run dev      # dev server (service worker disabled in dev)
npm run build    # production build — also generates public/sw.js via Serwist
npm run start    # serve the production build
```

No test runner or linter is configured yet. `npm run build` is the verification gate: it type-checks and prerenders all pages. Prerendering fetches Open-Meteo live, so builds need network; `getWeather()` returns `null` on failure and pages must render a fallback for that case.

## Architecture

### Data layer is the swap point
All pages read data through async getters in `src/lib/data/index.ts`. When `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set (`.env.local`), getters read Supabase via the read-only client in `src/lib/supabase/client.ts`; when unset they fall back to mock data in `src/lib/data/mock.ts`, so the app runs without credentials (dev/CI). In Supabase mode a query error logs and returns an empty result — never mock — so fake content can't appear in production; pages already render empty states. Types in `src/lib/data/types.ts` deliberately mirror the SQL schema in `supabase/migrations/0001_init.sql` (same enums/field names); mappers in `index.ts` convert snake_case rows to camelCase types — keep all three in sync when adding tables. `supabase/seed.sql` holds optional sample content (mirrors mock; deliberately contains no martyrs). Data-driven pages export `revalidate = 300` (ISR) so CMS edits appear without a rebuild.

### Admin panel (`/admin`)
Auth is cookie-based via `@supabase/ssr`: `src/lib/supabase/server.ts` (`getSupabaseServer()` — null when env unset; `getStaffUser()` — user + roles) and `src/middleware.ts` (token refresh, matcher scoped to `/admin/:path*` only, so public pages/PWA caching are untouched). `/admin/login` is public; everything else lives in the `src/app/admin/(panel)/` route group whose layout redirects to login without a session and blocks non-staff (`admin`/`moderator` roles from `user_roles`). Writes go through server actions using the logged-in user's session — RLS staff policies authorize them, **no service_role key anywhere**. After each mutation call `revalidatePath` on the affected public routes so edits appear instantly instead of waiting out ISR. Admin accounts are created manually (Dashboard → Auth → Add user, then insert `profiles` + `user_roles` rows in SQL editor); there is deliberately no self-signup. Follow the news CRUD (`src/app/admin/(panel)/xeberler/`) as the template for the remaining tables; deletes use the two-step `<details>` confirm pattern.

### Push notifications & TTS
Push deliberately uses **standard Web Push (VAPID), not FCM** — no Firebase account, fully free, same result. Keys: `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + server-only `VAPID_PRIVATE_KEY`/`VAPID_SUBJECT`; when unset the whole feature hides itself. Subscribe toggle lives in `/parametrler` (`PushSettings.tsx`) and works **without login** — migration `0002_push_web.sql` adds a `subscription jsonb` column and anon insert/delete policies (no anon select; endpoints are unguessable secrets). Rows store endpoint in `fcm_token` (legacy column name) + full JSON in `subscription`. Sending happens in `/admin/bildirisler` via the `web-push` package; dead subscriptions (404/410) are pruned on send, and each send is logged to `notifications`. Push handlers live at the bottom of `src/app/sw.ts`. Sending logic is shared in `src/lib/push.ts` (`sendPushToAll`). Anniversary notifications: Vercel Cron (`vercel.json`, daily 05:00 UTC) calls `/api/cron/anim`, guarded by `CRON_SECRET`; that route is the **only** place `SUPABASE_SERVICE_ROLE_KEY` is used (subscriptions aren't anon-readable) — never expose it as `NEXT_PUBLIC_`.

"Səsli dinlə" (`TtsButton`) plays a pre-generated Azure mp3 when `audioSrc` is passed, else falls back to device speechSynthesis. Generate mp3s with `node scripts/tts.mjs` (needs `AZURE_SPEECH_KEY`; runs offline from the site) from texts in `content/tts/*.txt` → `public/audio/*.mp3` (committed). If a page's text changes, update its txt twin and regenerate. Pages check `existsSync` for the mp3 at build time.

### Design system: semantic tokens only
`src/app/globals.css` defines semantic CSS variables (`--bg`, `--surface`, `--ink`, `--kerpic`, `--nar`, `--gunebaxan`, `--zeytun`, ...) that are remapped by `[data-theme="dark"]` and `[data-contrast="high"]` on `<html>`, and exposed to Tailwind via `@theme inline` (classes `bg-bg`, `text-ink`, `border-line`, `bg-kerpic`, etc.). **Never hardcode colors in components** — that breaks dark/high-contrast modes. Two section scopes override the palette wholesale: `.memorial-scope` (Şəhidlər — dark green/gold, transitions/animations forcibly disabled) and `.archive-scope` (occupation-era archive — sepia, reserved for Phase 2).

### Accessibility preferences pipeline
User prefs (font scale 0–3, theme, contrast, simple view) live in `localStorage` under `xdr-prefs` and are applied as `data-*` attributes on `<html>` (`src/lib/prefs.ts`). `PREFS_BOOT_SCRIPT` is inlined in `layout.tsx` `<head>` to apply them before first paint — don't move prefs application into React-only code or themes will flash. CSS hooks: `html[data-fontscale]` steps root font-size (base is 18px = 112.5%); `html[data-simple="1"]` collapses `.tile-grid` to one column and hides `.simple-hide` elements. Mark any non-essential home/list blocks with `simple-hide`.

### Server/client component split
Shared constants used by both server pages and `"use client"` components must live in `src/lib/` (see `src/lib/placeMeta.ts`). Importing a non-component export from a client module into a server component yields a client-reference proxy, which fails only at prerender time — this already bit `/xerite` once.

### PWA
`@serwist/next` builds `src/app/sw.ts` → `public/sw.js` (gitignored, prod-only). Offline caching of essentials (SOS numbers, village info, duty data) is a core requirement for this weak-internet region, not an optional enhancement.

## Non-negotiable product rules

- **Elderly-first UX:** any content reachable in ≤2–3 taps; browsing never requires login; large touch targets (min ~44px, buttons typically `min-h-12`+); direct `tel:` links instead of forms; SOS FAB visible on every screen (`SosFab` hides only on `/sos` itself).
- **Şəhidlər (martyrs) section is sensitive:** never invent or enter real names/biographies. The DB enforces dual approval (family representative + admin) via a CHECK constraint before `status='approved'`; the UI shows a respectful empty state until real, approved data exists. Design stays static and dignified — no animations, no playful elements. Occupation-era facts require source citations (`sources` field is mandatory).
- **No generic corporate look:** warm earth/pomegranate/sunflower palette, Lora (headings) + Inter (body), carpet-motif dividers (`.carpet-divider`). Both fonts are loaded with `latin-ext` subsets — required for Azerbaijani `ə/Ə`.
- **Budget constraint:** free tiers only (Vercel Hobby, Supabase free, Open-Meteo, OSM tiles → Protomaps PMTiles planned). Don't introduce paid services; images get compressed client-side at upload rather than server-transformed.

## Key facts

- Village center coordinates: `VILLAGE_CENTER` in `src/lib/data/mock.ts` (40.0156°N, 46.8906°E, ~3 km NW of Ağdam city). Mock POI coordinates are placeholders pending real data.
- Emergency numbers used on `/sos`: 103 (ambulance), 101 (fire), 102 (police), 112 (FHN).
- Date formatting goes through `src/lib/format.ts` (`az-Latn-AZ` locale) — don't format dates ad hoc.
- Roadmap gating: media archive, "Siz də paylaşın" uploads, occupation archive/timeline, then-and-now, elanlar, QR system, memorial candle are the rest of Phase 2 (bazar v1 shipped; its orders/chat/reviews come later in Phase 2); forum, services, tourism, transport, donations are Phase 3. Placeholder pages marked "Tezliklə" already exist and should link somewhere real when their module ships.
- Bazar specifics: category enums/labels live in `src/lib/bazarMeta.ts` (`CATEGORY_META`, `inSeason()` — handles year-wrapping seasons like Nov–Mar). Products join their producer via `producers!inner` and both must be `approved` to appear. Seasonal filtering uses the current Baku month; out-of-season products are hidden from the catalog but their detail page stays reachable.
