# XIDIRLI KƏND TƏTBİQİ — Tam Plan

## Kontekst

Ağdam rayonunun Xıdırlı kəndi üçün "rəqəmsal ev" — kəndin tarixi yaddaşını (işğal, azadlıq, bərpa), bugünkü canlı məlumatlarını və iqtisadi gələcəyini (bazar, xidmətlər, turizm) bir platformada birləşdirən veb + mobil tətbiq. Tələblər [xidirli-kend-app-prompt.md](xidirli-kend-app-prompt.md) sənədindədir. Layihə sıfırdan qurulur (qovluqda yalnız tələblər sənədi var).

**Təsdiqlənmiş məhdudiyyətlər (istifadəçi cavabları):**
- Büdcə: minimal/pulsuz səviyyələr (~0–10 AZN/ay)
- Ödəniş: MVP-də onlayn ödəniş yoxdur — sifariş + chat + nağd/əlaqə
- Komanda: tək developer — sadəlik və az-baxım prioritetdir
- Mağazalar: əvvəlcə PWA, Google Play/App Store 2–3-cü mərhələdə (Capacitor)

**Əsas istifadəçi qrupu:** texnologiyadan uzaq, yaşlı kənd sakinləri → hər UX qərarı buna tabedir (2–3 klik qaydası, böyük elementlər, səsli oxu, offline dəstək).

---

## 1. Texnologiya seçimi və əsaslandırma

| Qat | Seçim | Əsaslandırma |
|---|---|---|
| Frontend + Admin | **Next.js 15 (App Router, TypeScript) + Tailwind CSS** | Bir kod bazası (sakin tətbiqi + `/admin` paneli); SSR/SSG zəif internetdə sürətli ilk yüklənmə verir; tək developer üçün ən böyük ekosistem. |
| Mobil yanaşma | **PWA (Serwist service worker) → 2-ci mərhələdə Capacitor wrapper** | Ayrıca native kod yazılmır; PWA Android-də (Azərbaycanda dominant) quraşdırma + push tam dəstəkləyir; iOS-da etibarlı push və mağaza mövcudluğu Capacitor ilə sonra gəlir. Flutter/React Native ayrıca kod bazası deməkdir — solo dev üçün rədd edilir. |
| Backend / DB | **Supabase (Postgres + Auth + Storage + Realtime + RLS)** | Pulsuz səviyyə kifayətdir (500MB DB, 1GB storage, sonra ~$25); ayrıca server yazılmır; Realtime alıcı-satıcı chatı üçün hazırdır; Row Level Security ilə rol icazələri DB səviyyəsində. |
| Xəritə | **MapLibre GL JS + Protomaps PMTiles** (kəndin əhatə dairəsi üçün tək statik fayl) | Google Maps billing tələb edir — rədd. Kənd + ətraf üçün PMTiles çıxarışı bir dəfə hazırlanır, Storage-dan verilir, **offline işləyir**. POI-lər öz DB-mizdədir. |
| Hava | **Open-Meteo API** | Pulsuz, açarsız, 7 günlük + saatlıq proqnoz; torpaq nəmliyi/yağış ehtimalı fermer tövsiyələri üçün də yetir. |
| Push bildiriş | **Firebase Cloud Messaging (web push)** | Pulsuz; Android PWA-da tam işləyir; iOS üçün Capacitor mərhələsində APNs eyni FCM üzərindən. |
| Səsli oxu (TTS) | **Azure Speech (az-AZ neural səslər, F0 pulsuz tier — 500K simvol/ay)** — statik məzmun üçün admin paneldən audio generasiya olunub Storage-da keşlənir | Web Speech API-nin AZ dəstəyi cihazdan asılı və etibarsızdır; öncədən generasiya + keş həm pulsuz tier-ə sığır, həm offline dinləməyə imkan verir. |
| Şifahi tarix (STT) | MVP: yalnız audio saxlanır; transkripsiya Whisper ilə (dev lokalda işlədir), insan yoxlaması ilə | Pulsuz, keyfiyyət nəzarəti insan əli ilə. |
| Şəkil optimallaşdırma | Yükləmə zamanı **client-side sıxma** (browser-image-compression → WebP, maks 1600px + thumbnail variant) + lazy-loading | Vercel/Supabase pulsuz limitlərini qorumaq üçün transformasiya serverdə yox, yükləmə anında edilir. |
| Hosting | **Vercel Hobby (frontend) + Supabase Cloud (backend)** | Hər ikisi pulsuz başlayır; deploy `git push` ilə; solo dev üçün sıfır server baxımı. |
| Auth | Supabase Auth: **Google ilə giriş (Android-də bir toxunuş) + telefon nömrəsi profildə məcburi sahə**; e-poçt/şifrə ehtiyat variant | SMS OTP hər girişdə pul tələb edir — büdcəyə görə 3-cü mərhələyə. **Baxış üçün giriş tələb olunmur** — yaşlı sakinlər qeydiyyatsız hər şeyi oxuya bilir. |
| Ödəniş (Mərhələ 3) | Payriff və ya Epoint (lokal şlüzlər) | MVP-də sifariş nağd/əlaqə ilə. |
| SMS/WhatsApp (Mərhələ 3) | Lokal SMS şlüzü (LSIM tipli) / WhatsApp Business API | Büdcə açılanda; arxitekturada `notifications.channels` sahəsi əvvəldən nəzərdə tutulur. |

---

## 2. Tam sayt xəritəsi (Sitemap)

**Alt naviqasiya (həmişə görünən, 5 bənd):** 🏠 Ana səhifə · 📰 Xəbərlər · 🛒 Bazar · 🗺 Xəritə · ☰ Bölmələr

```
/                       Ana səhifə — plitə (tile) şəbəkəsi + bugünkü hava başlıqda
│                       + aktiv kəsinti/növbətçi banneri + SOS sabit düyməsi
│                       + "Kəndimiz nə ilə tanınır?" qaymaq bloku
├─ /haqqinda            MODUL 1 — Kənd haqqında
│   ├─ /haqqinda/tarix          Yaranma tarixi, adın mənşəyi, rəvayət
│   ├─ /haqqinda/brend          "Xıdırlı qaymağı" — kəndin vizit kartı (video, istehsal prosesi)
│   └─ /haqqinda/kohne-sekiller Köhnə şəkillər, qədim xəritələr
├─ /canli               MODUL 2 — Canlı məlumatlar
│   ├─ /hava                    Cari + 7 günlük proqnoz (+ fermer tövsiyəsi bloku)
│   ├─ /novbetci                Növbətçi aptek/feldşer, elektrik/su kəsintiləri
│   ├─ /xeberler  /xeberler/[id]
│   └─ /tedbirler               Kalendar formatında tədbirlər
├─ /xerite              MODUL 3 — İnteraktiv xəritə (POI qatları: ictimai yerlər,
│                       məhsul xəritəsi, turizm; qaymaq istehsalçıları xüsusi ikonla)
│   └─ /yer/[slug]              Hər məkanın səhifəsi (QR kodlar bura yönləndirir)
├─ /tarix               Tarixi bölmələrin girişi
│   ├─ /tarix/isgal             MODUL 4 — İşğal dövrü (xronologiya, mənbəli faktlar,
│   │   └─ /tarix/isgal/xatireler       arxiv foto/peyk görüntüləri, sakin xatirələri)
│   ├─ /tarix/azadliq           MODUL 5 — Azadlıq (xronologiya, ilk görüntülər)
│   │   └─ /tarix/berpa                 Bərpa timeline-ı (yol→elektrik→məktəb→qayıdış)
│   ├─ /tarix/onda-ve-indi      MODUL 7 — Müqayisə slaydları
│   └─ /tarix/usaqlar-ucun      Uşaqlar üçün illüstrativ tarix (Mərhələ 3)
├─ /sehidler            MODUL 6 — Şəhidlər (ayrıca vizual kimlik, hörmətli ton)
│   ├─ /sehidler/[id]           Profil: foto, bioqrafiya, təltiflər, xatirə şamı 🕯
│   ├─ /qaziler  /qaziler/[id]
│   └─ /anim-teqvimi            Anım günləri / ehsan təqvimi
├─ /insanlar            MODUL 8
│   ├─ /insanlar/secere         Ailə şəcərəsi
│   ├─ /insanlar/meshurlar      Kənddən çıxmış tanınmış şəxslər
│   ├─ /insanlar/sakinler       Könüllü sakin profilləri
│   └─ /insanlar/diaspora       Məzunlar/diaspora şəbəkəsi (Mərhələ 3)
├─ /arxiv               MODUL 9 — Media arxivi (foto/video/sənəd albomları)
│   ├─ /arxiv/[albom]
│   ├─ /arxiv/sifahi-tarix      Səsli xatirələr arxivi (Mərhələ 3)
│   └─ /arxiv/paylas            "Siz də paylaşın" yükləmə formu (giriş tələb edir)
├─ /icma                MODUL 10
│   ├─ /icma/xatire-divari      Qısa xatirə paylaşımları
│   ├─ /icma/forum  /icma/forum/[movzu]   (Mərhələ 3)
│   ├─ /icma/elanlar            Elanlar + itmiş/tapılmış
│   └─ /icma/iane               İanə layihələri + şəffaf hesabat (Mərhələ 3)
├─ /bazar               MODUL 11 — Marketplace
│   ├─ /bazar/qaymaq            ⭐ Flaqman: "Kəndimizin brendi" — sertifikatlı istehsalçılar
│   ├─ /bazar/[kateqoriya]      Mövsümi kateqoriyalar (tarixə görə avtomatik sıralanır)
│   ├─ /bazar/mehsul/[id]       Məhsul kartı → "Zəng et" / "Sifariş ver" / "Yazış"
│   ├─ /bazar/heyvanlar         🐄 Heyvan satışı
│   ├─ /bazar/xidmetler         MODUL 12 — Xidmətlər (traktor, qaynaq, usta...)
│   ├─ /fermer                  Fermer paneli: məhsullarım, sifarişlər, chat
│   └─ /sifarislerim            Alıcı paneli
├─ /turizm              MODUL 13 — Ev kirayəsi kartları, görməli yerlər, marşrutlar
├─ /neqliyyat           MODUL 14 — Nəqliyyat cədvəli
├─ /sos                 Tam ekran: 103 / 101 / 102 birbaşa zəng düymələri
├─ /parametrler         Şrift ölçüsü, kontrast, sadə görünüş, bildiriş seçimləri
├─ /giris  /profil
└─ /admin               Admin/moderasiya paneli (rol ilə qorunur)
    ├─ /admin/moderasiya        Növbə: gözləyən bütün UGC (növ üzrə filtr)
    ├─ /admin/hessas            Şəhid/qazi məzmunu — 2 imzalı təsdiq axını
    ├─ /admin/cms               Statik səhifələr, xəbər, tədbir, növbətçi, timeline
    ├─ /admin/bazar             Məhsul/istehsalçı təsdiqi, qaymaq sertifikatı
    ├─ /admin/istifadeciler     Rollar, ailə nümayəndəsi təyinatı
    ├─ /admin/bildirisler       Push göndərmə + anım günü avtomatlaşdırması
    ├─ /admin/qr                QR kod generasiyası + çap postere hazır PDF
    └─ /admin/audio             TTS audio generasiyası (Azure) statik səhifələr üçün
```

---

## 3. Verilənlər bazası modeli (Supabase Postgres)

Bütün UGC cədvəllərində ortaq moderasiya sahələri: `status (draft|pending|approved|rejected)`, `moderated_by`, `moderated_at`, `reject_reason`. RLS: `approved` hamıya, qalanı sahibinə + moderatora görünür.

**İstifadəçi və rollar**
- `profiles` (id→auth.users, full_name, phone, avatar_url, city/country — diaspora üçün, is_resident)
- `user_roles` (user_id, role: admin|moderator|farmer|service_provider|family_rep)
- `family_representatives` (user_id, martyr_id?, veteran_id?, qohumluq, verified_by, verified_at)

**CMS və canlı məlumat**
- `pages` (slug, section, title, body, audio_url) — statik məzmun + TTS audio
- `news` (title, body, cover_url, published_at, author_id)
- `events` (title, starts_at, ends_at, location, body)
- `duty_info` (type: aptek|feldser|elektrik|su, title, body, valid_from, valid_to, is_active)
- `notifications` (type, title, body, audience, channels: push|sms|whatsapp, sent_at)

**Tarix və yaddaş**
- `memories` (author_id, era: isgal|qayidis|diger, type: text|audio|video, title, body, media_url, transcript, consent_given)
- `martyrs` (full_name, birth_date, death_date, photo_url, bio, awards, military_unit, sources, family_rep_approved_by/at, anniversary_notify) — **ikiqat təsdiq**
- `veterans` (analoji)
- `memorial_candles` (martyr_id, user_id?, lit_at)
- `timeline_items` (module: azadliq|berpa, date, title, body, media_url, sort_order)
- `then_now_pairs` (place_id?, title, photo_1980, photo_pre, photo_post, photo_now, captions jsonb)
- `notable_people` (name, sahe, bio, photo_url)
- `ft_persons` (name, birth_year, death_year, father_id, mother_id, submitted_by) + `ft_marriages`
- `albums` / `media_items` (album_id, type: photo|video|document, url, thumb_url, caption, year, source, uploaded_by)

**Xəritə**
- `places` (name, type: mekteb|mescid|bulaq|abide|qebiristanliq|tikili|tesserrufat|magaza|saglamliq|tarixi_ev|turizm, lat, lng, body, photos, qr_slug)

**Bazar və xidmətlər**
- `product_categories` (name, icon, season_months int[], is_flagship) — mövsümilik burada: cari ay `season_months`-dadırsa kateqoriya önə çıxır; qaymaq `is_flagship=true` ilə həmişə yuxarıda
- `producer_profiles` (user_id, farm_name, place_id — məhsul xəritəsi buradan, qaymaq_certified bool, rating_avg)
- `products` (producer_id, category_id, title, body, price, unit, photos, available)
- `orders` (buyer_id, producer_id, status: yeni|tesdiqlendi|hazir|catdirildi|legv, note, contact_phone) + `order_items`
- `reviews` (order_id, rating 1–5, comment) — "əsl Xıdırlı qaymağı" təminatının əsası
- `chats` (buyer_id, seller_id, order_id?) + `messages` (chat_id, sender_id, body, read_at) — Supabase Realtime
- `service_categories` + `services` (provider_id, category_id, title, body, price_from, phone)

**Turizm, nəqliyyat, icma**
- `rentals` (host_id, title, rooms, capacity, price_per_night, amenities jsonb, photos, phone)
- `tourism_routes` (name, body, place_ids uuid[])
- `transport_routes` (name, from_to, days, times jsonb, carrier_phone, price)
- `forum_topics` + `forum_posts`; `announcements` (type: elan|itmis|tapilmis, expires_at)
- `wall_posts` (xatirə divarı: author_id, body, photo_url)
- `donation_projects` (title, goal, collected, report_body) + `donations` (donor_name?, amount, method, note) — onlayn ödənişsiz: admin bank köçürmələrini şəffaf reyestr kimi daxil edir

**Sistem**
- `moderation_flags` (content_type, content_id, reporter_id, reason) — "şikayət et" düyməsi
- `audit_log` (actor_id, action, entity, entity_id, meta jsonb, created_at) — xüsusilə həssas bölmə üçün

---

## 4. İstifadəçi rolları və icazələr

| Rol | Nə edə bilir |
|---|---|
| **Qonaq** (girişsiz) | Bütün təsdiqlənmiş məzmuna baxış, xəritə, hava, SOS zəngləri, istehsalçıya `tel:` zəng. Heç bir baxış üçün qeydiyyat tələb olunmur. |
| **Sakin** (qeydiyyatlı) | + Xatirə/foto/sənəd yükləmə, xatirə divarı, elan, forum yazısı, sifariş vermə, chat, şam yandırma, şəcərəyə əlavə təklifi. Hamısı moderasiyadan keçir. |
| **Fermer** | + Məhsul əlavə/redaktə, sifariş idarəsi, satıcı chatı. İlk məhsulu admin təsdiqindən keçir; qaymaq sertifikatını yalnız admin verir. |
| **Xidmət göstərən** | + Xidmət elanı əlavə/redaktə (təsdiqlə). |
| **Ailə nümayəndəsi** | + Öz şəhid/qazisinə aid məzmuna baxış və **təsdiq imzası**; düzəliş tələbi göndərmə. Admin tərəfindən şəxsən yoxlanılıb təyin edilir. |
| **Moderator** | + Standart UGC təsdiqi/rəddi (səbəblə), şikayətlərə baxış, forum idarəsi. Həssas bölməyə tək başına dərc hüququ **yoxdur**. |
| **Admin** | + Hər şey: CMS, həssas məzmunun son dərci, rol təyinatı, bildiriş göndərmə, QR/audio generasiya, ianə reyestri. |

---

## 5. Moderasiya axınları

**A) Standart UGC** (foto, xatirə, divar yazısı, elan, forum, məhsul, xidmət, kirayə):
`Sakin göndərir → pending → Moderator baxır → approved (dərc) / rejected (səbəb bildirişlə göndərilir)`. Redaktə yenidən növbəyə düşür. Hər dərc olunan elementdə "🚩 Şikayət et" → `moderation_flags` → moderator növbəsi.

**B) Həssas məzmun — şəhid/qazi (ikiqat imza):**
```
Layihə (admin/moderator və ya ailə tərəfindən) 
  → 1-ci imza: Ailə nümayəndəsi (razılıq + faktların doğruluğu)
  → 2-ci imza: Admin (mənbə istinadlarını yoxlayır: təltif, hərbi hissə yalnız ictimai mənbə varsa)
  → Dərc. Hər sonrakı dəyişiklik hər iki imzanı yenidən tələb edir. Hamısı audit_log-a yazılır.
```
Ailə nümayəndəsi olmayan şəhid profili dərc olunmur — əvvəlcə admin ailə ilə şəxsən əlaqə saxlayıb nümayəndə təyin edir (kənd kiçikdir, bu realdır).

**C) Bazar:** yeni fermer profili + ilk məhsul admin təsdiqi; sonrakı məhsullar moderator təsdiqi. "Xıdırlı qaymağı" nişanı yalnız fiziki yoxlamadan sonra admin tərəfindən verilir; rəy sistemi (yalnız real sifarişdən sonra rəy yazıla bilir) nişanı dəstəkləyir.

**D) İşğal dövrü faktları:** yalnız admin daxil edir, hər faktın `sources` sahəsi məcburidir (rəsmi mənbə istinadı olmadan dərc yoxdur).

---

## 6. Dizayn dili

**Rəng palitrası** (isti torpaq + nar + günəbaxan; korporativ mavi-ağ yoxdur):

| Rol | Rəng | Hex |
|---|---|---|
| Əsas (primary) | Kərpic/torpaq terrakotu | `#B5542D` |
| Vurğu 1 | Nar qırmızısı | `#8E2A3A` |
| Vurğu 2 / CTA | Günəbaxan sarısı | `#E8A93C` |
| Fon | Buğda/krem | `#F6EFE2` (kart: `#FDFBF6`) |
| Uğur / Bazar-Bərpa tonu | Zeytun yaşılı | `#5A6B3F` |
| Mətn | Tünd qəhvə | `#33261D` |
| SOS | Tünd qırmızı | `#B3261E` |

**Bölmə-səviyyəli vizual kimlik:**
- *İşğal dövrü:* sepiya/arxiv — tutqun fon `#2E2A24`, solğun kağız tonu `#EAE3D2`, fotolar duotone, sənədli-arxiv hissi, animasiya minimal.
- *Şəhidlər:* tünd sürməyi-yaşıl `#1F2A24` + ağ + incə qızılı xətlər; **animasiyasız**, sakit, ləyaqətli; şam ikonası yeganə interaktiv element.
- *Bərpa və Bazar:* işıqlı krem fon, canlı yaşıl-sarı vurğular, ümidverici ton.

**Tipoqrafiya:** Başlıqlar — **Lora** (isti serif); mətn/UI — **Inter** (tam Azərbaycan hərf dəstəyi: ə, İ, ğ, ş). Hər ikisi Google Fonts-dan self-host edilir (offline + sürət). İmplementasiya zamanı ə/Ə glifi vizual yoxlanılır; problem olsa ehtiyat cütlük: Literata + Noto Sans. Baza ölçü **18px**, yaşlı rejimdə 22px+; sətir hündürlüyü 1.6.

**Vizual dil:** Qarabağ xalça naxışından götürülmüş incə SVG haşiyə/bölücü ornamentlər (bölmə başlıqlarında, ağır olmadan); buta + nar motivli loqo, içində camış buynuzuna incə işarə (qaymaq brendi); real kənd fotoları (stok yox) — hər bölmənin hero hissəsində; kartlar 16px radius, yumşaq kölgə; mikro-animasiyalar 150–250ms ease-out (kart hover qalxması, timeline scroll-reveal), `prefers-reduced-motion` hörmət olunur.

---

## 7. Yaşlı istifadəçilər üçün UX qərarları (konkret axınlar)

- **Ana səhifə = plitə şəbəkəsi** (2 sütun, böyük ikon + 1 söz: Hava, Xəbərlər, Bazar, Xəritə, Tarix, Şəhidlər, Elanlar, Nəqliyyat). Menyu iyerarxiyası yoxdur.
- **Hava — 0/1 klik:** bugünkü hava ana səhifənin başlığında həmişə görünür (0 klik); "Hava" plitəsi → 7 günlük səhifə (1 klik).
- **SOS — maks 2 toxunuş:** ana səhifədə sabit qırmızı düymə → tam ekran 3 nəhəng düymə (Təcili yardım / Yanğın / Polis) → `tel:` ilə birbaşa zəng.
- **Kəsinti xəbərdarlığı — 0 klik:** aktiv `duty_info` varsa ana səhifənin üstündə sarı banner.
- **Xəbər oxu — 2 klik:** plitə → böyük kartlı siyahı → məqalə; hər məqalədə **"🔊 Səsli dinlə"** düyməsi.
- **Qaymaq sifarişi — 3 addım:** Bazar plitəsi → "Kəndimizin brendi" banneri → istehsalçı kartında **"📞 Zəng et"** (yaşlılar üçün əsas yol) və ya "Sifariş ver" (gənclər üçün).
- **Giriş yalnız məzmun yaratmaq/sifariş üçün** — baxış tam açıqdır; qeydiyyat Google ilə bir toxunuş, telefon nömrəsi profildə soruşulur.
- **Başlıqda daimi əlçatanlıq paneli:** `A− / A+` (şrift), `◐` (yüksək kontrast / tünd rejim), `🔊` (səhifəni oxu).
- **"Sadə görünüş" toggle:** plitələr 1 sütuna keçir, ikinci dərəcəli modullar gizlənir, düymələr böyüyür — parametr cihazda yadda saxlanılır.
- **Offline keş (service worker):** kənd haqqında, əlaqə/SOS nömrələri, aktiv növbətçi məlumatı, son baxılan xəbərlər, kənd xəritəsi (PMTiles) — internetsiz açılır.
- **Formalar əvəzinə `tel:` linkləri** hər yerdə (istehsalçı, usta, kirayə sahibi, nəqliyyat daşıyıcısı).

---

## 8. Mərhələli yol xəritəsi

**Mərhələ 1 — MVP (~6–8 həftə, solo):** kəndin gündəlik istifadə etdiyi nüvə.
- İnfra: Next.js + Supabase + Vercel, PWA + offline keş, FCM push
- Ana səhifə (plitələr, hava başlığı, kəsinti banneri, SOS)
- Modul 1 (kənd haqqında + qaymaq brend bloku), Modul 2 (hava, növbətçi, xəbərlər, tədbir kalendarı)
- Modul 3 (xəritə + POI, MapLibre/PMTiles)
- Modul 6 — **şəhidlər bölməsi admin-daxiletməli** (ikiqat təsdiq axını ilə birlikdə; kənd üçün emosional nüvə olduğundan MVP-dədir)
- Əlçatanlıq: şrift ölçüsü, kontrast, sadə görünüş; Azure TTS ilə statik səhifələrə audio
- Admin panel v1: CMS + moderasiya növbəsi + bildiriş göndərmə

**Mərhələ 2 (~8–10 həftə):** yaddaş + iqtisadiyyat.
- Modul 4 (işğal arxivi), Modul 5 (azadlıq/bərpa timeline), Modul 7 (onda-və-indi slider)
- Modul 9 (media arxivi + "Siz də paylaşın" yükləmə axını), Xatirə divarı
- Modul 11 v1: məhsul kataloqu, qaymaq flaqman bölməsi, mövsümi avtomatika, məhsul xəritəsi, sifariş (ödənişsiz) + Realtime chat, rəy sistemi
- Elanlar + itmiş/tapılmış; QR kod sistemi (+ çap posterləri); rəqəmsal xatirə şamı + anım bildirişləri
- **Capacitor ilə Google Play / App Store buraxılışı**

**Mərhələ 3 — tam versiya:**
- Modul 12 (xidmətlər), Modul 8 (şəcərə, məşhurlar, diaspora), Modul 13 (turizm/kirayə), Modul 14 (nəqliyyat), Modul 10 forum
- Şifahi tarix arxivi (səs yazma + Whisper transkripsiya), uşaqlar üçün tarix, ianə modulu (şəffaf reyestr)
- Fermer hava tövsiyələri, sosial media inteqrasiyası
- Büdcə açıldıqca: SMS/WhatsApp bildirişləri, SMS OTP girişi, onlayn ödəniş (Payriff/Epoint), qaymaq üçün coğrafi göstərici təşəbbüsünə məlumat bazası dəstəyi

---

## 9. Əlavə təkliflər (sənəddəki 13 təklifə üstəlik)

1. **Namaz vaxtları vidjeti** — məscidli kənd üçün gündəlik istifadə səbəbi; ana səhifə başlığında (hesablama kitabxanası ilə, offline işləyir).
2. **"Bu gün tariximizdə"** ana səhifə bloku — timeline məlumatından avtomatik (məs. "3 il əvvəl bu gün məktəb açıldı").
3. **"Zəng et, dinlə" IVR xətti** (büdcə açılanda) — smartfonsuz yaşlılar adi telefonla zəng edib xəbərləri TTS səsi ilə dinləyir.
4. **Skan günü kampaniyası** (əməliyyat təklifi) — məktəbdə gənclər yaşlıların köhnə fotolarını telefon ilə skan edib arxivə yükləyir; "Siz də paylaşın" axını bunun üçün toplu yükləmə rejimi alır.
5. **Az-data rejimi** — şəkilləri yalnız istəklə yükləyən toggle (zəif internet üçün).
6. **İllik arxiv ixracı** — media arxivinin hər il tam nüsxəsinin soyuq saxlamaya (xarici disk + bulud) ixracı; kəndin rəqəmsal yaddaşı tək platformadan asılı qalmamalıdır.
7. **Razılıq qeydi** — hər yükləmədə sadə razılıq checkbox-u + şəhid/ailə məzmunu üçün yazılı razılıq sənədinin admin tərəfindən fayl kimi saxlanması (hüquqi qorunma).
8. **Qonaq kitabı** — kəndə gələn ziyarətçilərin (QR-dan daxil olanların) qısa təəssürat yazması.

---

## 10. İcra qeydləri (developer üçün)

- Layihə strukturu: tək Next.js repo — `app/(public)/...` sakin tətbiqi, `app/admin/...` panel, `lib/supabase/`, `components/ui/` (plitə, kart, əlçatanlıq paneli ortaq komponentlər).
- Supabase sxemi SQL migrasiya faylları ilə (`supabase/migrations/`) — reproduksiya oluna bilən.
- RLS siyasətləri hər cədvəldə əvvəldən: `approved`-hamıya / sahibinə / rola görə şablonu.
- İlk sprint: layout + dizayn tokenləri (rənglər, fontlar, plitə komponenti) → sonra modullar.
- Bütün tarix/şəhid məzmununun daxil edilməsi üçün admin CMS kifayət etməlidir — kod dəyişikliyi olmadan.

## Yoxlama (verifikasiya)

1. `npm run dev` — bütün əsas axınlar əl ilə: plitə → hava (1 klik), SOS zəng linki, xəbər + səsli dinləmə, sifariş + chat (iki fərqli hesabla).
2. **Moderasiya testi:** sakin hesabı foto yükləyir → moderator hesabı təsdiq/rədd edir → bildiriş gəlir; şəhid profili ailə imzası olmadan dərc olunmur.
3. **Offline test:** DevTools → Offline — ana səhifə, əlaqə nömrələri, xəritə, növbətçi məlumatı açılmalıdır.
4. **Zəif internet:** DevTools Slow 3G — ilk yüklənmə < 5s, şəkillər lazy.
5. **Lighthouse:** PWA quraşdırıla bilən; Accessibility ≥ 95; kontrast yoxlaması hər iki rejimdə.
6. **Real istifadəçi testi:** 3–5 yaşlı sakinlə "hava proqnozunu tap", "aptekə zəng et", "qaymaq sifariş et" tapşırıqları — 3 klikdən artıq çəkərsə axın sadələşdirilir.
7. Push bildiriş testi: admin paneldən test bildirişi → Android PWA-da qəbul.
