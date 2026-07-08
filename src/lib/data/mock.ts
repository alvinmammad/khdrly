import type {
  DutyInfo,
  EventItem,
  Listing,
  Martyr,
  NewsItem,
  Place,
  Producer,
  Product,
  ServiceProvider,
  Stay,
  TimelineEntry,
  TransportRoute,
} from "./types";

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

// Bazar nümunələri — adlar/nömrələr QƏSDƏN saxtadır; real istehsalçılar
// admin paneldən (gələcəkdə öz hesabları ilə) daxil ediləcək.
const mockProducerQaymaq: Producer = {
  id: "p1",
  name: "Nümunə təsərrüfat (qaymaq)",
  phone: "+994500000001",
  description: "Xıdırlı qaymağı — kəndin brend məhsulu. Nümunə istehsalçı kartı.",
  isFlagship: true,
};

const mockProducerBag: Producer = {
  id: "p2",
  name: "Nümunə bağ təsərrüfatı",
  phone: "+994500000002",
  isFlagship: false,
};

export const mockProducers: Producer[] = [mockProducerQaymaq, mockProducerBag];

export const mockProducts: Product[] = [
  {
    id: "m1",
    name: "Xıdırlı qaymağı",
    category: "sud",
    price: 12,
    unit: "kq",
    description: "Səhər sağımından, təbii qaymaq. Nümunə məhsul kartı.",
    available: true,
    producer: mockProducerQaymaq,
  },
  {
    id: "m2",
    name: "Motal pendiri",
    category: "sud",
    unit: "kq",
    available: true,
    producer: mockProducerQaymaq,
  },
  {
    id: "m3",
    name: "Mövsümi tərəvəz səbəti",
    category: "terevez",
    price: 8,
    unit: "səbət",
    seasonStart: 5,
    seasonEnd: 10,
    available: true,
    producer: mockProducerBag,
  },
];

export const mockListings: Listing[] = [
  {
    id: "e1",
    type: "elan",
    title: "Ev təsərrüfatı üçün bal arısı ailəsi satılır",
    body: "İki arı ailəsi, yeşikləri ilə birlikdə. Qiymət razılaşma ilə. Nümunə elan.",
    phone: "+994500000003",
    createdAt: "2026-07-05T10:00:00+04:00",
  },
  {
    id: "e2",
    type: "itmis",
    title: "Qonur rəngli dana itib",
    body: "Kəndin şimal tərəfində qonur dana itib, qulağında sarı nişan var. Görən olsa xahiş edirik zəng etsin. Nümunə elan.",
    phone: "+994500000004",
    createdAt: "2026-07-06T18:00:00+04:00",
  },
];

// Timeline — 1993 və 2020 tarixləri rəsmi, hamıya məlum faktlardır;
// kəndə xas tarixlər (açılış və s.) NÜMUNƏDİR və admin paneldən
// dəqiq mənbə ilə daxil ediləcək.
export const mockTimeline: TimelineEntry[] = [
  {
    id: "t1",
    era: "isgal",
    eventDate: "1993-07-23",
    dateDisplay: "1993, 23 iyul",
    title: "Ağdamın işğalı",
    body: "Birinci Qarabağ müharibəsi zamanı Ağdam rayonunun böyük hissəsi, o cümlədən Xıdırlı kəndi işğal olundu. Sakinlər doğma yurdlarını tərk etməyə məcbur oldular.",
    sources: ["Rəsmi dövlət xronikası"],
  },
  {
    id: "t2",
    era: "azadliq",
    eventDate: "2020-11-20",
    dateDisplay: "2020, 20 noyabr",
    title: "Ağdam Azərbaycana qaytarıldı",
    body: "44 günlük Vətən müharibəsinin nəticəsi olaraq imzalanmış üçtərəfli bəyanata əsasən Ağdam rayonu işğaldan azad edildi. 27 illik həsrət sona çatdı.",
    sources: ["Üçtərəfli bəyanat, 10 noyabr 2020"],
  },
  {
    id: "t3",
    era: "berpa",
    eventDate: "2024-01-01",
    dateDisplay: "Bərpa dövrü",
    title: "Böyük Qayıdış: kəndin yenidən qurulması (nümunə)",
    body: "\"Böyük Qayıdış\" proqramı çərçivəsində kənddə yollar, elektrik, su təchizatı və evlər tikilir. Dəqiq tarixlər admin paneldən rəsmi mənbələrlə daxil ediləcək — bu, nümunə yazıdır.",
    sources: [],
  },
];

// Xidmətlər və nəqliyyat — NÜMUNƏ (adlar/nömrələr saxtadır)
export const mockServices: ServiceProvider[] = [
  {
    id: "s1",
    name: "Nümunə usta",
    category: "usta",
    phone: "+994500000005",
    description: "Tikinti və təmir işləri. Nümunə kart.",
  },
  {
    id: "s2",
    name: "Nümunə taksi",
    category: "taksi",
    phone: "+994500000006",
    description: "Kənd–Ağdam istiqaməti. Nümunə kart.",
  },
];

export const mockTransport: TransportRoute[] = [
  {
    id: "n1",
    title: "Xıdırlı → Ağdam",
    schedule: "Hər gün səhər 08:00 və günorta 14:00 (nümunə cədvəl)",
    driverName: "Nümunə sürücü",
    phone: "+994500000007",
    note: "Dəqiq cədvəl admin paneldən daxil ediləcək.",
  },
];

export const mockStays: Stay[] = [
  {
    id: "q1",
    name: "Nümunə qonaq evi",
    type: "qonaq_evi",
    description: "Kənd həyatını yaşamaq istəyən qonaqlar üçün. Nümunə kart.",
    phone: "+994500000008",
    priceNote: "Qiymət razılaşma ilə",
  },
];
