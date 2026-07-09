-- =============================================================
-- Modul 8-in qalanı: Şəcərə (nəsillər) + Diaspora (Mərhələ 3).
-- Şəcərə v1: kəndin nəsilləri/tayfaları — ağsaqqalların bilgiləri
-- əsasında staff daxil edir (interaktiv ağac sonrakı versiyada).
-- Diaspora: sakin profildə yerini qeyd edir; İCTİMAİ tərəfdə yalnız
-- SAYLAR görünür (adlar yox) — profiles RLS-i açılmır, statistika
-- security definer funksiya ilə verilir.
-- =============================================================

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,                -- nəslin/tayfanın adı
  description text,                  -- tarixi, məşhur üzvləri, məhəlləsi
  sort_order int not null default 0,
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.families enable row level security;

create policy "families public read" on public.families
  for select using (status = 'approved' or public.is_staff());
create policy "families staff write" on public.families
  for all using (public.is_staff());

-- Diaspora statistikası: yalnız aqreqat saylar, heç bir ad/əlaqə
create or replace function public.diaspora_stats()
returns table (country text, city text, say bigint)
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(trim(country), ''), 'Digər') as country,
         coalesce(nullif(trim(city), ''), '') as city,
         count(*) as say
  from public.profiles
  where is_resident = false
    and (nullif(trim(country), '') is not null or nullif(trim(city), '') is not null)
  group by 1, 2
  order by say desc, country, city;
$$;

create or replace function public.resident_count()
returns bigint
language sql stable security definer set search_path = public as $$
  select count(*) from public.profiles where is_resident = true;
$$;
