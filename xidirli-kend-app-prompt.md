# XIDIRLI KƏND TƏTBİQİ — Fable 5 Plan Mode üçün Tam Prompt

## KONTEKST (niyə bu layihə var)

Bu, Azərbaycanın Ağdam rayonunun Xıdırlı kəndi üçün hazırlanan bir tətbiqdir (həm veb, həm mobil). Kənd 1-ci Qarabağ müharibəsində işğal olunub, 2020-ci il 44 günlük müharibədən sonra azad edilib, qısa müddətdə yenidən tikilib və məcburi köçkünlər (mən də daxil olmaqla) geri köçürülüb. Bu tətbiq sadəcə funksional alət deyil — kəndin yaddaşını, kimliyini və gələcəyini bir yerə toplayan RƏQƏMSAL EV kimi qurulmalıdır. Bunu Fable 5 planlaşdırarkən daim yadda saxlamalıdır: bu, sadə bir "kənd saytı" deyil, işğaldan azad olunmuş, yenidən doğulmuş bir icmanın həm keçmişini, həm bugününü, həm də iqtisadi/sosial gələcəyini əhatə edən canlı bir platformadır.

## LAYİHƏNİN MƏQSƏDİ

Fable 5-dən istənilən: yuxarıda və aşağıda göstərilən bütün tələbləri əsas götürərək, bu tətbiq üçün TAM BİR PLAN hazırlamaq — memarlıq, texnologiya seçimi, verilənlər bazası modeli, səhifə/ekran xəritəsi, istifadəçi rolları, admin/moderasiya axını və mərhələli yol xəritəsi daxil olmaqla. Kod yazmadan əvvəl, aydın və icra oluna bilən bir plan qur.

## HƏDƏF İSTİFADƏÇİLƏR VƏ UX PRİNSİPLƏRİ (ÇOX VACİB)

- İstifadəçilərin böyük əksəriyyəti **texnologiyadan uzaq, yaşlı kənd sakinləridir**. Tətbiq onlar üçün intuitiv, sadə və rahat olmalıdır.
- Naviqasiya **maksimum 2-3 klikdə** istənilən məlumata çatmalıdır.
- Böyük şriftlər, böyük düymələr, aydın ikonlar, minimal mətn, maksimum vizual izahat (ikon + şəkil + qısa yazı).
- Mürəkkəb menyu strukturları yox — sadə, ikon-əsaslı əsas ekran (ev səhifəsi kart/plitə formatında: "Hava", "Xəbərlər", "Tarix", "Bazar" və s.).
- Dil yalnız Azərbaycan dili (lazım olsa gələcəkdə diaspora üçün əlavə dil dəstəyi nəzərdə tutulsun, amma default və əsas AZ olsun).
- Mətnin səsli oxunması (text-to-speech) seçimi olsun — oxumaqda çətinlik çəkən yaşlı sakinlər üçün.
- Şrift ölçüsünü böyütmə/kiçiltmə düyməsi, yüksək kontrastlı "asan oxu" rejimi olsun.
- Offline/zəif internet şəraitində də əsas məlumatların (kənd haqqında, əlaqə nömrələri, növbətçi məlumatlar) işləməsi üçün minimal keşləmə nəzərdə tutulsun.

## DİZAYN FƏLSƏFƏSİ — ŞABLONDAN TAM UZAQ

- Generic "Bootstrap admin panel" görünüşü, standart mavi-ağ korporativ dizayn QADAĞANDIR.
- Dizayn Qarabağ/Azərbaycan kənd mühitinin ruhunu əks etdirməlidir: isti torpaq tonları, günəbaxan/nar (rəmzi motivlər), xalça naxışlarından ilhamlanan incə dekorativ elementlər, real kənd fotoları (stok şəkil yox).
- Tipoqrafiya xarakterli olsun — sadə sistem fontu deyil, isti və oxunaqlı bir font cütlüyü seçilsin.
- Hər bölmənin öz vizual kimliyi ola bilər: məsələn "İşğal dövrü" bölməsi tutqun, sənədli-arxiv tonlarında; "Bərpa" və "Bazar" bölmələri isə canlı, işıqlı, ümidverici tonlarda.
- Mikro-animasiyalar (yumşaq keçidlər, kartların yüngül hərəkəti) istifadə olunsun ki, tətbiq "canlı" hiss olunsun, statik broşura kimi görünməsin.
- Fable 5-dən xahiş: bu hissi əks etdirən konkret rəng palitrası, font tövsiyəsi və vizual dil (design language) təklif etsin.

## TEXNİKİ TƏLƏBLƏR

- Tətbiq HƏM veb, HƏM mobil üçün tam responsiv olmalıdır (bir kod bazası, PWA və ya cross-platform yanaşma tövsiyə oluna bilər — Fable 5 bunu əsaslandırıb seçsin).
- Zəif internetli bölgə nəzərə alınaraq performans optimallaşdırılsın (şəkil sıxılması, lazy-loading).
- Bildiriş sistemi (push notification) — xəbərlər, tədbirlər, növbətçi məlumatlar üçün.
- Admin/moderasiya paneli ayrıca, təhlükəsiz giriş.

---

## MODUL 1 — Kənd Haqqında Ümumi Məlumat
- Ümumi məlumat, əhali sayı, relyefi, yaranma tarixi, adının mənşəyi haqqında rəvayət/tarixi izah
- Xəritədə yeri (koordinatlarla)
- Köhnə şəkillər, qədim xəritələr
- **Kəndin brendi/simvolu**: Xıdırlı Ağdam və Qarabağ bazarlarında məhz **"Xıdırlı qaymağı"** (camış qaymağı) ilə tanınır. Bu, kəndin tanıtım hissəsində fəxarətlə vurğulanan bir kimlik elementi kimi göstərilsin (məs. ev səhifəsində "Kənd nə ilə tanınır?" bloku, vizual kimlikdə/loqoda incə bir işarə).

## MODUL 2 — Canlı Məlumatlar
- Cari hava + tam dəqiq 7 günlük proqnoz
- Növbətçi məlumatlar (məs. növbətçi aptek/feldşer, elektrik/su kəsintiləri barədə bildiriş)
- Son xəbərlər və qarşıdan gələn tədbirlər (kalendar formatında)

## MODUL 3 — İnteraktiv Xəritə
- Kəndin tam xəritəsi, bütün ictimai yerlər ikonlarla işarələnsin: Məktəb, Məscid, Şəhid bulağı, Tarixi evlər, Abidələr, Qəbiristanlıq, Yeni tikililər, sağlamlıq məntəqəsi, mağazalar
- Xəritə üzərində məhsul xəritəsi (bazar modulu ilə əlaqəli) və turizm obyektləri də göstərilsin

## MODUL 4 — İşğal Dövrü (Tarixi Arxiv)
- İşğal tarixi və o dövrün xronologiyası
- Rəsmi mənbələrdən məlumatlar (dəqiq mənbə istinadları ilə)
- Arxiv fotoları, peyk görüntüləri (mövcud olduqda)
- Kənd sakinləri danışır: "1993-cü ildə kəndi necə tərk etdik..." formatında video/audio/mətn xatirələr

## MODUL 5 — Azadlıq və Bərpa
- Azad olunma tarixi, hərbi əməliyyatların ümumi xronologiyası, rəsmi açıqlamalar
- Azad olunandan sonrakı ilk görüntülər
- Bərpa prosesi — **zaman xətti (timeline) formatında**: Yol çəkildi → Elektrik bərpa olundu → Məktəb tikildi → Məscid təmir edildi → İlk ailələr qayıtdı və s.
- "2020-ci ildə ilk dəfə geri qayıtdım..." formatında sakin xatirələri

## MODUL 6 — Şəhidlər və Qazilər (hörmətlə, ayrıca bölmə)
- Şəhid şəkli, bioqrafiyası, təltifləri, xidmət etdiyi hərbi hissə (ictimai mənbələrdə varsa), ailə xatirələri
- Qazilər bölməsi: bioqrafiya, müsahibə, xatirələr
- Veteranlar üçün ayrıca hörmət bölməsi
- Bu bölmə üçün moderasiya prosesi xüsusilə diqqətli olmalıdır — ailə razılığı və doğruluq təsdiqi əsas şərtdir

## MODUL 7 — "Onda və İndi"
- Eyni məkanın müqayisəli görüntüləri: 1980-ci il → İşğaldan əvvəl → İşğaldan sonra → Bugünkü vəziyyət (slider ilə müqayisə effekti)

## MODUL 8 — Kənd Sakinləri və Şəcərə
- Kəndin ailə şəcərəsi (family tree) modulu
- Kənddən çıxmış məşhur şəxslər: müəllimlər, həkimlər, alimlər, idmançılar, sənət adamları
- Kənd sakinləri profilləri (könüllü şəkildə paylaşılan)

## MODUL 9 — Media Arxivi
- Foto qalereya, video arxiv
- Rəqəmsal arxiv: köhnə şəkillər, məktəb albomları, qəzetlər, xəritələr, sənədlər
- **"Siz də paylaşın"** funksiyası: istifadəçilər köhnə şəkil, video, xatirə, sənəd yükləyə bilsin → admin təsdiqindən sonra dərc olunsun

## MODUL 10 — İcma Bölmələri
- Xatirə Divarı: "20 ildən sonra ilk dəfə doğulduğum küçəni gördüm" kimi qısa paylaşımlar, moderasiyadan keçərək dərc olunur
- Kənd Forumu: sakinlərin müzakirə platforması
- İtmiş Əşyalar bölməsi (tapılan/itirilən elanlar)
- Elanlar bölməsi

## MODUL 11 — Bazar (Marketplace) — Fermer və Alıcı Panelləri
- İki ayrı panel: **Fermer paneli** (məhsul əlavə etmə, sifariş idarəsi) və **Alıcı paneli**
- **Flaqman məhsul: "Xıdırlı qaymağı"** — kənd Ağdam və Qarabağ bazarlarında məhz camış qaymağı ilə tanınır. Bazar modulunda bu məhsul üçün ayrıca, önə çıxarılan bir kateqoriya/bannerlə vurğulanmalıdır (məs. "Kəndimizin brendi" bölməsi, əsl istehsalçıların siyahısı, mənşə/keyfiyyət təminatı işarəsi — bir növ "Xıdırlı qaymağı" üçün rəqəmsal mənşə sertifikatı kimi düşünülə bilər).
- **Mövsümi məhsullar avtomatik göstərilsin** — tətbiq tarixə görə hansı məhsulun mövsümü olduğunu bilib avtomatik önə çıxarsın (məs. yay aylarında ərik/gavalı, payızda nar/alma, qaymaq isə il boyu flaqman kimi sabit qalsın)
- **Məhsul xəritəsi**: turist kəndə gələndə xəritədə hansı təsərrüfatın harada olduğunu görüb birbaşa istehsalçıya yaxınlaşa bilsin (qaymaq istehsalçıları xəritədə xüsusi ikonla fərqləndirilsin)
- Heyvan satışı bölməsi (🐄) — camış saxlayan təsərrüfatlar da burada görünə bilər
- Sifariş sistemi və inteqrasiya olunmuş chat (alıcı-satıcı arasında birbaşa yazışma)

## MODUL 12 — Xidmətlər Bazarı
Kəndlilər xidmət təklif edə bilər: Traktor icarəsi, Ot biçmə, Qazma, Tikinti, Qaynaq, Dülgər, Elektrik ustası və s. (kateqoriyalı, axtarışlı siyahı, əlaqə/sifariş imkanı ilə)

## MODUL 13 — Turizm və Ev Kirayəsi
- Əgər kənd turistik potensiallıdırsa: ev kirayəsi elanları (məs. "2 otaqlı həyət evi, 80 AZN, Barbekü, WiFi, 5 nəfərlik" formatında kart)
- Görməli yerlər bölməsi, turizm marşrutları

## MODUL 14 — Nəqliyyat
- Kəndə/kənddən nəqliyyat cədvəli, marşrut məlumatları

---

## MƏNİM ƏLAVƏ TƏKLİFLƏRİM (Fable 5 bunları da nəzərə alıb özü daha da inkişaf etdirsin)

Aşağıdakılar mənim tərəfimdən əlavə olunan, əsas siyahıda olmayan, amma layihəni gücləndirə biləcək fikirlərdir. Fable 5, bunlardan əlavə öz təkliflərini də əlavə etsin:

1. **SOS/Təcili Yardım Düyməsi** — ev səhifəsində sabit, böyük bir düymə: təcili tibbi yardım, yanğınsöndürən, polis nömrələrinə birbaşa zəng.
2. **SMS/WhatsApp inteqrasiyası** — smartfonu olmayan və ya tətbiqi az istifadə edən yaşlı sakinlər üçün vacib bildirişlərin (növbətçi, tədbir, elan) SMS və ya WhatsApp vasitəsilə də göndərilməsi.
3. **Rəqəmsal Xatirə Şamı / Ehsan Təqvimi** — şəhidlər üçün anım günlərində icmaya bildiriş, rəqəmsal şam yandırma simvolikası.
4. **Yerlərdə QR kod sistemi** — fiziki məkanlarda (məscid, abidə, tarixi ev) QR kod yerləşdirilsin, skan edəndə həmin yerin tarixi/tətbiqdəki səhifəsi açılsın.
5. **Səs yazılı şifahi tarix arxivi** — yaşlı sakinlərin sadəcə danışaraq (yazmadan) xatirələrini qeyd edə bilməsi üçün səs qeydi funksiyası, sonra mətnə çevrilsin.
6. **Məzunlar/Diaspora şəbəkəsi** — kənddən çıxıb başqa şəhər/ölkələrdə yaşayan sakinlərin bir-biri ilə əlaqə saxlaya bildiyi ayrıca bölmə.
7. **Fermer üçün hava-əsaslı tövsiyələr** — hava proqnozuna əsasən əkin/suvarma tövsiyələri (məs. "sabah yağış gözlənilir, suvarmanı təxirə salın").
8. **İanə/dəstək modulu** — kənddə konkret layihə üçün (məs. uşaq meydançası, yol təmiri) şəffaf ianə toplama və hesabat bölməsi.
9. **Uşaqlar üçün "Kənd Tarixi" interaktiv bölməsi** — sadə, illüstrativ formada uşaqların kəndin tarixini öyrənməsi üçün.
10. **Admin/Moderasiya Paneli detalları** — bütün istifadəçi-yaradılan məzmun (şəkil, xatirə, forum yazısı, elan) admin təsdiqindən keçmədən dərc olunmasın; şəhid/qazi bölməsi üçün əlavə təsdiq səviyyəsi (ailə/icma nümayəndəsi) olsun.
11. **Əlçatanlıq rejimləri** — tünd/işıqlı rejim, "asan oxu" rejimi, böyük düymə rejimi (yaşlılar üçün xüsusi "sadə görünüş" toggle).
12. **Kəndin rəsmi sosial media/kanal inteqrasiyası** — Youtube/Facebook kimi mövcud kanallardan avtomatik video/xəbər çəkilməsi (əgər varsa).
13. **"Xıdırlı qaymağı" brend strategiyası** — kənd artıq bazarda tanınan bir məhsula (camış qaymağı) malik olduğu üçün, tətbiq bunu sadəcə bazar məhsulu kimi deyil, kəndin rəqəmsal "vizit kartı" kimi işlətsin: sifarişlə Bakıya/başqa şəhərlərə çatdırılma imkanı, istehsal prosesini göstərən qısa video (kəndin süd/camış təsərrüfatı, ənənəvi hazırlanma qaydası), "əsl Xıdırlı qaymağı" təminatı üçün istehsalçı reytinq/rəy sistemi. Gələcəkdə coğrafi göstərici (mənşə nişanı) qeydiyyatı kimi rəsmi addımlar üçün də zəmin ola bilər.

---

## FABLE 5-DƏN İSTƏNİLƏN NƏTİCƏ (Plan Mode Tapşırığı)

Yuxarıdakı bütün tələbləri, dizayn fəlsəfəsini və UX prinsiplərini əsas götürərək:

1. **Tam sayt/tətbiq xəritəsi (sitemap)** hazırla — bütün səhifələr, alt-səhifələr və onların iyerarxiyası.
2. **Texnologiya seçimi və əsaslandırma** təklif et (frontend, backend, verilənlər bazası, xəritə API-si, hava API-si, hosting) — həm veb, həm mobil üçün ən effektiv yanaşmanı (PWA / cross-platform / ayrı-ayrı) seç və izah et.
3. **Verilənlər bazası modelinin ümumi strukturu** (əsas cədvəllər/entitilər və əlaqələr) — istifadəçilər, fermerlər, məhsullar, sifarişlər, xidmətlər, media, forum, şəhid/qazi profilləri, moderasiya statusları və s.
4. **İstifadəçi rolları və icazələr**: qonaq (giriş etməmiş), kənd sakini, fermer, alıcı, xidmət göstərən, admin, moderator, ailə nümayəndəsi (şəhid/qazi bölməsi üçün).
5. **Moderasiya axını** — hər növ istifadəçi-məzmunu (şəkil, xatirə, forum, elan, şəhid/qazi məlumatı) üçün ayrı-ayrı təsdiq mərhələləri.
6. **Dizayn dili təklifi** — konkret rəng palitrası, font tövsiyəsi, vizual üslub nümunələri (şablon hisi olmadan, Qarabağ/kənd ruhunu əks etdirən).
7. **Mərhələli yol xəritəsi (roadmap)**: MVP (ilk buraxılış üçün minimum, ən vacib modullar) → 2-ci mərhələ → tam funksional versiya. Hər mərhələdə hansı modulların daxil olacağını konkret göstər.
8. **Yaşlı/texnologiyadan uzaq istifadəçilər üçün xüsusi UX qərarları** — konkret ekran axınları (flow) təklif et ki, məsələn "hava məlumatına necə 1 kliklə çatılır" kimi suallara cavab versin.
9. Planı təqdim etməzdən əvvəl, əgər hər hansı qərar üçün əlavə məlumata (məs. büdcə, gözlənilən istifadəçi sayı, mövcud domen/hosting) ehtiyac varsa, bunu aydın şəkildə soruş.

**Qeyd:** Bu, yaşayış məntəqəsinin real tarixi və icması üçün hazırlanan hörmətli bir layihədir. Şəhid, qazi və işğal dövrü ilə bağlı bölmələr xüsusi həssaslıqla, dəqiqliklə və hörmətlə planlaşdırılmalıdır.
