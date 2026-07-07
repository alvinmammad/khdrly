-- =============================================================
-- Modul 12 — Xidmətlər kataloqu (Mərhələ 3).
-- Usta, bərbər, taksi və s. — əsas yol telefon zəngidir.
-- Yazma hələlik staff ilə; xidmətçilərin özünüidarəsi sonra.
-- =============================================================

create type public.service_category as enum (
  'usta',       -- tikinti-təmir ustası
  'elektrik',   -- elektrik ustası
  'santexnik',
  'berber',
  'taksi',      -- taksi / sürücü
  'toy',        -- toy-mərasim xidmətləri
  'texnika',    -- kənd təsərrüfatı texnikası (traktor, ot biçini...)
  'diger'
);

create table public.service_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- şəxs və ya kiçik biznes adı
  category public.service_category not null,
  phone text not null,
  description text,
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.service_providers enable row level security;

create policy "services public read" on public.service_providers
  for select using (status = 'approved' or public.is_staff());
create policy "services staff write" on public.service_providers
  for all using (public.is_staff());
