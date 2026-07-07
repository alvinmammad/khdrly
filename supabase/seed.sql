-- =============================================================
-- NÜMUNƏ MƏZMUN (istəyə bağlı) — src/lib/data/mock.ts ilə eyni.
-- Məqsəd: Supabase qoşulan kimi saytın boş görünməməsi və
-- axının (sorğu → səhifə) real bazada yoxlanması.
-- Real məzmun admin paneldən daxil ediləndə bu sətirlər silinə bilər.
--
-- DİQQƏT: Şəhidlər cədvəlinə QƏSDƏN heç nə daxil edilmir —
-- real profillər yalnız ailə nümayəndəsi + admin ikiqat təsdiqi ilə,
-- admin panel hazır olandan sonra əlavə olunacaq.
-- =============================================================

-- ---------- Xəbərlər ----------
insert into public.news (title, body, cover_emoji, status, published_at) values
(
  'Kənd meydanında növbəti bazar günü yarmarkası keçiriləcək',
  E'Bu bazar günü kənd meydanında yerli məhsulların yarmarkası təşkil olunur. Qaymaq, süd məhsulları, mövsümi tərəvəz və ev çörəyi satışda olacaq. Bütün sakinlər və qonaqlar dəvətlidir.\n\nYarmarka səhər saat 08:00-dan günorta 14:00-dək davam edəcək. İştirak etmək istəyən təsərrüfat sahibləri kənd icra nümayəndəliyinə müraciət edə bilər.',
  '🧺', 'approved', '2026-07-03T09:00:00+04:00'
),
(
  'Məktəbdə yay düşərgəsi başladı',
  'Kənd tam orta məktəbində şagirdlər üçün yay istirahət-təlim düşərgəsi fəaliyyətə başlayıb. Düşərgədə idman, rəsm və kəndin tarixi ilə bağlı maraqlı məşğələlər keçirilir.',
  '🏫', 'approved', '2026-07-01T14:30:00+04:00'
),
(
  'İçməli su xəttində profilaktik işlər başa çatdı',
  'Kəndin mərkəzi hissəsində aparılan profilaktik təmir işləri başa çatıb, su təchizatı tam bərpa olunub. Anlayışınız üçün təşəkkür edirik.',
  '🚰', 'approved', '2026-06-28T18:00:00+04:00'
);

-- ---------- Tədbirlər ----------
insert into public.events (title, body, location, starts_at, status) values
(
  'Bazar günü yarmarkası',
  'Yerli məhsulların satış yarmarkası — qaymaq, süd məhsulları, mövsümi tərəvəz.',
  'Kənd meydanı', '2026-07-12T08:00:00+04:00', 'approved'
),
(
  'Ağsaqqallar məclisi',
  'Kəndin ağsaqqalları ilə görüş — icma məsələlərinin müzakirəsi.',
  'Mədəniyyət evi', '2026-07-15T17:00:00+04:00', 'approved'
),
(
  'Uşaqlar üçün kino axşamı',
  null, 'Məktəbin akt zalı', '2026-07-18T20:00:00+04:00', 'approved'
);

-- ---------- Növbətçi məlumatlar ----------
insert into public.duty_info (type, title, body, phone, is_alert, valid_from, valid_to) values
(
  'elektrik',
  'Elektrik kəsintisi — planlı təmir',
  'Sabah saat 10:00–13:00 arası kəndin şimal hissəsində planlı təmirlə əlaqədar elektrik enerjisi verilməyəcək.',
  null, true, '2026-07-06T00:00:00+04:00', '2026-07-07T13:00:00+04:00'
),
(
  'feldser',
  'Növbətçi feldşer',
  'Bu həftə kənd sağlamlıq məntəqəsində növbətçi feldşer xidmət göstərir. Təcili hallarda zəng edin.',
  '+994501234567', false, '2026-07-06T00:00:00+04:00', null
),
(
  'aptek',
  'Növbətçi aptek — Ağdam şəhəri',
  'Ən yaxın növbətçi aptek Ağdam şəhərindədir (kənddən 3 km). Gecə saatlarında da açıqdır.',
  '+994501112233', false, '2026-07-06T00:00:00+04:00', null
);

-- ---------- Xəritə (koordinatlar NÜMUNƏDİR — real ölçmə ilə dəqiqləşdiriləcək) ----------
insert into public.places (slug, name, type, lat, lng, body, status) values
('mekteb',        'Kənd tam orta məktəbi',  'mekteb',        40.0171, 46.8888, 'Bərpa prosesində yenidən tikilmiş kənd məktəbi.', 'approved'),
('mescid',        'Kənd məscidi',           'mescid',        40.0149, 46.8921, 'Kəndin məscidi.', 'approved'),
('sehid-bulagi',  'Şəhid bulağı',           'bulaq',         40.0138, 46.8879, 'Şəhidlərimizin xatirəsinə inşa olunmuş bulaq.', 'approved'),
('saglamliq',     'Sağlamlıq məntəqəsi',    'saglamliq',     40.0162, 46.8934, 'Feldşer-mama məntəqəsi. Növbətçi məlumatı üçün Canlı bölməyə baxın.', 'approved'),
('qebiristanliq', 'Kənd qəbiristanlığı',    'qebiristanliq', 40.0189, 46.8862, null, 'approved'),
('magaza',        'Kənd mağazası',          'magaza',        40.0154, 46.8899, null, 'approved');

-- ---------- Bazar (Modul 11 v1) — NÜMUNƏ məzmun ----------
-- Adlar/nömrələr qəsdən saxtadır; real istehsalçılar admin paneldən daxil ediləcək.
insert into public.producers (name, phone, description, is_flagship, status) values
(
  'Nümunə təsərrüfat (qaymaq)', '+994500000001',
  'Xıdırlı qaymağı — kəndin brend məhsulu. Nümunə istehsalçı kartı.',
  true, 'approved'
),
(
  'Nümunə bağ təsərrüfatı', '+994500000002', null, false, 'approved'
);

insert into public.products (producer_id, name, category, price, unit, description, season_start, season_end, available, status)
select p.id, x.name, x.category::public.product_category, x.price, x.unit, x.description, x.season_start, x.season_end, true, 'approved'
from (values
  ('Nümunə təsərrüfat (qaymaq)', 'Xıdırlı qaymağı', 'sud', 12.00, 'kq', 'Səhər sağımından, təbii qaymaq. Nümunə məhsul kartı.', null::smallint, null::smallint),
  ('Nümunə təsərrüfat (qaymaq)', 'Motal pendiri', 'sud', null, 'kq', null, null, null),
  ('Nümunə bağ təsərrüfatı', 'Mövsümi tərəvəz səbəti', 'terevez', 8.00, 'səbət', null, 5::smallint, 10::smallint)
) as x(producer_name, name, category, price, unit, description, season_start, season_end)
join public.producers p on p.name = x.producer_name;
