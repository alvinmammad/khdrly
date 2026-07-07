-- =============================================================
-- Modul 5 (azadlıq/bərpa timeline) + Modul 4-ün əsası (işğal dövrü).
-- Bir cədvəl, üç dövr: isgal (1993–2020) / azadliq (2020) / berpa.
-- Məhsul qaydası: işğal dövrünə aid faktlar YALNIZ mənbə istinadı ilə
-- dərc oluna bilər — server action yoxlayır, CHECK ikinci sədd kimi.
-- =============================================================

create type public.timeline_era as enum ('isgal', 'azadliq', 'berpa');

create table public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  era public.timeline_era not null,
  event_date date not null,          -- sıralama üçün
  date_display text,                 -- ekranda göstərilən forma (məs. "1993, iyul") — boşdursa tarix formatlanır
  title text not null,
  body text not null,
  photo_url text,
  sources text[] not null default '{}',
  status public.moderation_status not null default 'draft',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  -- işğal dövrü faktı mənbəsiz dərc oluna bilməz
  constraint isgal_requires_source check (
    era <> 'isgal' or status <> 'approved' or array_length(sources, 1) >= 1
  )
);

alter table public.timeline_entries enable row level security;

create policy "timeline public read" on public.timeline_entries
  for select using (status = 'approved' or public.is_staff());
create policy "timeline staff write" on public.timeline_entries
  for all using (public.is_staff());
