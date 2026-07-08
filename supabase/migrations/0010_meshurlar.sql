-- =============================================================
-- Modul 8 v1 — Məşhurlarımız (Mərhələ 3).
-- Kəndin tanınmış şəxsləri: alim, müəllim, idmançı, hərbçi...
-- Qayda: real şəxs haqqında yazı MƏNBƏSİZ dərc oluna bilməz —
-- server action + CHECK (şəhidlər bölməsindəki prinsiplə eyni).
-- Şəcərə və diaspora hissələri sonrakı versiyada.
-- =============================================================

create type public.person_field as enum (
  'elm',        -- elm və təhsil
  'medeniyyet', -- mədəniyyət və incəsənət
  'idman',
  'herbi',      -- hərbi xidmət
  'emek',       -- əmək qabaqcılları
  'diger'
);

create table public.notable_people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  years_display text,                -- "1935–2001" və ya "1958" — sərbəst mətn
  field public.person_field not null,
  description text not null,
  photo_url text,
  sources text[] not null default '{}',
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now(),
  constraint person_requires_source check (
    status <> 'approved' or array_length(sources, 1) >= 1
  )
);

alter table public.notable_people enable row level security;

create policy "people public read" on public.notable_people
  for select using (status = 'approved' or public.is_staff());
create policy "people staff write" on public.notable_people
  for all using (public.is_staff());
