# Xıdırlı — kəndimizin rəqəmsal evi 🏡

Ağdam rayonunun Xıdırlı kəndi üçün veb + mobil (PWA) tətbiq: kəndin tarixi
yaddaşı, canlı məlumatlar (hava, növbətçi, xəbərlər), interaktiv xəritə və
gələcəkdə bazar (Xıdırlı qaymağı 🐃), icma və turizm modulları.

Tam plan: `xidirli-kend-app-prompt.md` (tələblər) əsasında hazırlanmış yol
xəritəsi üzrə qurulur — Mərhələ 1 (MVP) hazırda icra olunur.

## İşə salma

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # istehsal build-i (PWA service worker daxil)
```

Hazırda tətbiq **nümunə (mock) data** ilə işləyir — Supabase açarları
(`.env.example` → `.env.local`) əlavə olunanda məlumat qatı
(`src/lib/data/index.ts`) real bazaya keçiriləcək; səhifələr dəyişməyəcək.

## Texnologiyalar

| Qat | Seçim |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 |
| Mobil | PWA (Serwist) → Mərhələ 2-də Capacitor ilə mağazalar |
| Backend | Supabase (Postgres + Auth + Storage + Realtime), sxem: `supabase/migrations/` |
| Xəritə | MapLibre GL (hazırda OSM raster, istehsalda Protomaps PMTiles — offline) |
| Hava | Open-Meteo (pulsuz, açarsız) |
| Səsli oxu | Öncədən yazılmış Gemini TTS mp3-ləri (scripts/tts.mjs), ehtiyat: cihazın Web Speech API-si |

## Struktur

```
src/app/            # səhifələr (hava, xeberler, novbetci, xerite, sehidler, ...)
src/components/     # layout (Header, BottomNav, SosFab) + ui (Tile, TtsButton) + map
src/lib/data/       # məlumat qatı: tiplər, mock, getter-lər (Supabase-ə keçid nöqtəsi)
src/lib/weather.ts  # Open-Meteo müştərisi + fermer tövsiyə qaydaları
src/lib/prefs.ts    # əlçatanlıq seçimləri (şrift, tema, kontrast, sadə görünüş)
supabase/           # SQL migrasiyaları (RLS siyasətləri ilə)
```

## Əlçatanlıq prinsipləri (dəyişməz)

- Hər məlumata **maksimum 2–3 klik**; baxış üçün qeydiyyat tələb olunmur
- Baza şrift 18px; başlıqdakı A−/A+ ilə 4 pillə; yüksək kontrast "asan oxu" rejimi
- **SOS** düyməsi hər ekranda; təcili nömrəyə maks. 2 toxunuş
- "Sadə görünüş" rejimi: tək sütun, yalnız əsas bölmələr
- Şəhidlər bölməsi: ayrıca ləyaqətli dizayn, ikiqat təsdiq (ailə + admin) olmadan dərc yoxdur

## Növbəti addımlar (Mərhələ 1 qalıqları)

- [ ] Supabase layihəsi yaradıb migrasiyanı tətbiq etmək, data qatını qoşmaq
- [ ] Admin panel v1 (`/admin`): CMS + moderasiya növbəsi + bildiriş göndərmə
- [ ] FCM push bildirişləri
- [ ] Gemini TTS ilə statik səhifələr üçün audio generasiyası (`node scripts/tts.mjs`)
- [ ] Kəndin real POI koordinatlarının dəqiqləşdirilməsi, PMTiles çıxarışı
