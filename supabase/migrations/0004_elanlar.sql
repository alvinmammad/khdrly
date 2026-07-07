-- =============================================================
-- Elanlar + itmiş/tapılmış (Mərhələ 2).
-- V1-də elanları staff daxil edir (sakinlər icra nümayəndəliyinə
-- müraciət edir) — sakinlərin öz hesabı ilə elan verməsi login
-- axını gələndə əlavə olunacaq.
-- =============================================================

create type public.listing_type as enum (
  'elan',      -- ümumi elan (satış, iş, kirayə, hüquqi bildiriş...)
  'itmis',     -- itmiş (heyvan, sənəd, əşya)
  'tapilmis'   -- tapılmış
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  type public.listing_type not null default 'elan',
  title text not null,
  body text not null,
  phone text,                        -- əlaqə: tel: linki
  valid_to timestamptz,              -- bitəndə avtomatik gizlənir; null → müddətsiz
  status public.moderation_status not null default 'draft',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "listings public read" on public.listings
  for select using (status = 'approved' or public.is_staff());
create policy "listings staff write" on public.listings
  for all using (public.is_staff());
