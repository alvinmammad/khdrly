-- =============================================================
-- Modul 11 v1 — Bazar: istehsalçı kataloqu + məhsullar.
-- Bu mərhələdə sifariş/chat/rəy YOXDUR — əsas yol telefon zəngidir
-- (yaşlı-dostu). Yazma hələlik yalnız staff (admin panel) ilə;
-- fermer özünüidarəsi (farmer rolu) sonrakı addımda gələcək.
-- =============================================================

create type public.product_category as enum (
  'sud',      -- süd məhsulları (qaymaq, pendir, motal...)
  'terevez',  -- tərəvəz
  'meyve',    -- meyvə
  'corek',    -- çörək və şirniyyat
  'et',       -- ət məhsulları
  'bal',      -- bal və arıçılıq
  'el_isi',   -- əl işləri
  'diger'
);

create table public.producers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id),  -- gələcəkdə fermer öz hesabı ilə idarə edəcək
  name text not null,
  phone text not null,               -- əsas satış kanalı: tel: linki
  description text,
  is_flagship boolean not null default false,  -- qaymaq brendi bölməsində göstərilir
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  name text not null,
  category public.product_category not null,
  price numeric(10, 2),              -- null → "qiymət razılaşma ilə"
  unit text,                          -- kq | litr | ədəd | banka ...
  description text,
  photo_url text,
  season_start smallint check (season_start between 1 and 12),  -- null → bütün il
  season_end smallint check (season_end between 1 and 12),
  available boolean not null default true,
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.producers enable row level security;
alter table public.products enable row level security;

create policy "producers public read" on public.producers
  for select using (status = 'approved' or public.is_staff());
create policy "producers staff write" on public.producers
  for all using (public.is_staff());

create policy "products public read" on public.products
  for select using (status = 'approved' or public.is_staff());
create policy "products staff write" on public.products
  for all using (public.is_staff());
