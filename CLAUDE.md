# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web + mobile (PWA) app for Xıdırlı village, Ağdam district, Azerbaijan — a "digital home" combining the village's historical memory (occupation 1993–2020, liberation, rebuilding), live information (weather, duty rosters, news), an interactive map, and future marketplace/community modules. The full requirements are in `xidirli-kend-app-prompt.md`; the approved architecture/roadmap plan is in `docs/PLAN.md`. Phase 1 (MVP) is partially done; remaining Phase 1 work: Supabase wiring, `/admin` panel, FCM push, Azure TTS audio cache.

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
All pages read data through async getters in `src/lib/data/index.ts` (currently backed by mock data in `src/lib/data/mock.ts`). When Supabase is wired up, only the getter bodies change — page signatures stay stable. Types in `src/lib/data/types.ts` deliberately mirror the SQL schema in `supabase/migrations/0001_init.sql` (same enums/field names). Keep them in sync when adding tables.

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
- Roadmap gating: Bazar/marketplace, media archive, "Siz də paylaşın" uploads are Phase 2; forum, services, tourism, transport, donations are Phase 3. Placeholder pages marked "Tezliklə" already exist and should link somewhere real when their module ships.
