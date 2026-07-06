import type { DutyInfo, EventItem, Martyr, NewsItem, Place } from "./types";

/*
  NÜMUNƏ MƏLUMATLAR — Supabase qoşulana qədər tətbiqin işlək görünməsi üçün.
  Real məzmun admin panelindən daxil ediləcək; şəhid profilləri isə yalnız
  ailə nümayəndəsi + admin ikiqat təsdiqindən sonra dərc olunacaq.
*/

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Kənd meydanında növbəti bazar günü yarmarkası keçiriləcək",
    body: "Bu bazar günü kənd meydanında yerli məhsulların yarmarkası təşkil olunur. Qaymaq, süd məhsulları, mövsümi tərəvəz və ev çörəyi satışda olacaq. Bütün sakinlər və qonaqlar dəvətlidir.\n\nYarmarka səhər saat 08:00-dan günorta 14:00-dək davam edəcək. İştirak etmək istəyən təsərrüfat sahibləri kənd icra nümayəndəliyinə müraciət edə bilər.",
    coverEmoji: "🧺",
    publishedAt: "2026-07-03T09:00:00+04:00",
  },
  {
    id: "2",
    title: "Məktəbdə yay düşərgəsi başladı",
    body: "Kənd tam orta məktəbində şagirdlər üçün yay istirahət-təlim düşərgəsi fəaliyyətə başlayıb. Düşərgədə idman, rəsm və kəndin tarixi ilə bağlı maraqlı məşğələlər keçirilir.",
    coverEmoji: "🏫",
    publishedAt: "2026-07-01T14:30:00+04:00",
  },
  {
    id: "3",
    title: "İçməli su xəttində profilaktik işlər başa çatdı",
    body: "Kəndin mərkəzi hissəsində aparılan profilaktik təmir işləri başa çatıb, su təchizatı tam bərpa olunub. Anlayışınız üçün təşəkkür edirik.",
    coverEmoji: "🚰",
    publishedAt: "2026-06-28T18:00:00+04:00",
  },
];

export const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Bazar günü yarmarkası",
    location: "Kənd meydanı",
    body: "Yerli məhsulların satış yarmarkası — qaymaq, süd məhsulları, mövsümi tərəvəz.",
    startsAt: "2026-07-12T08:00:00+04:00",
  },
  {
    id: "2",
    title: "Ağsaqqallar məclisi",
    location: "Mədəniyyət evi",
    body: "Kəndin ağsaqqalları ilə görüş — icma məsələlərinin müzakirəsi.",
    startsAt: "2026-07-15T17:00:00+04:00",
  },
  {
    id: "3",
    title: "Uşaqlar üçün kino axşamı",
    location: "Məktəbin akt zalı",
    startsAt: "2026-07-18T20:00:00+04:00",
  },
];

export const mockDuty: DutyInfo[] = [
  {
    id: "1",
    type: "elektrik",
    title: "Elektrik kəsintisi — planlı təmir",
    body: "Sabah saat 10:00–13:00 arası kəndin şimal hissəsində planlı təmirlə əlaqədar elektrik enerjisi verilməyəcək.",
    isAlert: true,
    validFrom: "2026-07-06T00:00:00+04:00",
    validTo: "2026-07-07T13:00:00+04:00",
  },
  {
    id: "2",
    type: "feldser",
    title: "Növbətçi feldşer",
    body: "Bu həftə kənd sağlamlıq məntəqəsində növbətçi feldşer xidmət göstərir. Təcili hallarda zəng edin.",
    phone: "+994501234567",
    isAlert: false,
    validFrom: "2026-07-06T00:00:00+04:00",
  },
  {
    id: "3",
    type: "aptek",
    title: "Növbətçi aptek — Ağdam şəhəri",
    body: "Ən yaxın növbətçi aptek Ağdam şəhərindədir (kənddən 3 km). Gecə saatlarında da açıqdır.",
    phone: "+994501112233",
    isAlert: false,
    validFrom: "2026-07-06T00:00:00+04:00",
  },
];

// Kənd mərkəzi: ~40.0156°N, 46.8906°E (Ağdam şəhərindən 3 km şimal-qərb).
// Yerlər NÜMUNƏDİR — dəqiq koordinatlar yerində qeyd olunub admin paneldən daxil ediləcək.
export const VILLAGE_CENTER = { lat: 40.0156, lng: 46.8906 };

export const mockPlaces: Place[] = [
  { id: "1", slug: "mekteb", name: "Kənd tam orta məktəbi", type: "mekteb", lat: 40.0171, lng: 46.8888, body: "Bərpa prosesində yenidən tikilmiş kənd məktəbi." },
  { id: "2", slug: "mescid", name: "Kənd məscidi", type: "mescid", lat: 40.0149, lng: 46.8921, body: "Kəndin məscidi." },
  { id: "3", slug: "sehid-bulagi", name: "Şəhid bulağı", type: "bulaq", lat: 40.0138, lng: 46.8879, body: "Şəhidlərimizin xatirəsinə inşa olunmuş bulaq." },
  { id: "4", slug: "saglamliq", name: "Sağlamlıq məntəqəsi", type: "saglamliq", lat: 40.0162, lng: 46.8934, body: "Feldşer-mama məntəqəsi. Növbətçi məlumatı üçün Canlı bölməyə baxın." },
  { id: "5", slug: "qebiristanliq", name: "Kənd qəbiristanlığı", type: "qebiristanliq", lat: 40.0189, lng: 46.8862 },
  { id: "6", slug: "magaza", name: "Kənd mağazası", type: "magaza", lat: 40.0154, lng: 46.8899 },
];

// DİQQƏT: Bunlar yalnız dizayn nümunəsidir — real şəhid məlumatları YALNIZ
// ailə nümayəndəsinin razılığı və admin təsdiqi (ikiqat imza) ilə dərc olunacaq.
export const mockMartyrs: Martyr[] = [
  {
    id: "1",
    fullName: "Nümunə profil",
    bio: "Bu, dizayn nümunəsidir. Real şəhid məlumatları yalnız ailə nümayəndəsinin yazılı razılığı və faktların rəsmi mənbələrlə təsdiqindən sonra admin panelindən daxil ediləcək.",
    isSample: true,
  },
];
