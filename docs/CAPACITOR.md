# Google Play buraxılışı (Capacitor)

Tətbiq "qabıq" modelindədir: Android tətbiqi canlı saytı
(`https://xidirli.vercel.app`) yükləyir. Sayt yeniləndikcə tətbiq də
avtomatik yenilənmiş məzmun göstərir — mağazaya yenidən yükləmə yalnız
qabığın özü dəyişəndə lazımdır.

## Bir dəfəlik hazırlıq

1. **Android Studio** qur: https://developer.android.com/studio
   (ilk açılışda SDK-nı özü yükləyir).
2. **Google Play Developer hesabı** aç: https://play.google.com/console
   — birdəfəlik $25.

## Tətbiqi yığmaq

```bash
npx cap sync android      # konfiqi android/ layihəsinə köçürür
npx cap open android      # Android Studio-da açır
```

Android Studio-da:

1. **İmza açarı (bir dəfə):** Build → Generate Signed App Bundle →
   Create new keystore. Fayl və şifrələri **itirməyin** — Play
   yeniləmələri yalnız eyni açarla mümkündür (ehtiyat nüsxə saxlayın!).
2. **Build → Generate Signed App Bundle → release** → `.aab` faylı yaranır.

## Play Console-da

1. Create app → ad: **Xıdırlı**, dil: Azərbaycan dili, pulsuz.
2. App content bölməsində:
   - Privacy policy URL: `https://xidirli.vercel.app/gizlilik`
   - Data safety: yalnız Google girişində ad/e-poçt; satış/reklam yoxdur.
3. Store listing:
   - Qısa təsvir: "Xıdırlı kəndinin rəsmi tətbiqi — xəbərlər, bazar,
     tarix, xəritə."
   - İkon 512×512 PNG (`public/icon.svg`-dən eksport), ekran görüntüləri
     (telefonda saytdan 4–6 şəkil), banner 1024×500.
4. Production → Create release → `.aab` yüklə → Review-a göndər
   (ilk yoxlama adətən 1–7 gün).

## Yeniləmə lazım olanda

Qabıq dəyişməyibsə (yalnız sayt dəyişibsə) — heç nə etmə. Qabıq
dəyişəndə: `android/app/build.gradle`-də `versionCode`-u +1 artır,
yenidən Signed Bundle yığ və Play-də yeni release yarat.

## iOS (gələcək)

Mac + Apple Developer hesabı ($99/il) tələb edir:
`npm i @capacitor/ios && npx cap add ios`. Qeyd: Apple "yalnız sayt
qabığı" tətbiqlərini bəzən rədd edir — iOS üçün push bildiriş
plaginini də əlavə etmək məsləhətdir.
