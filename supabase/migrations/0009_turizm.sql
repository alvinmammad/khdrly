-- =============================================================
-- Modul 13 v1 — Turizm və kirayə (Mərhələ 3).
-- Qonaq evləri / kirayə evlər — əsas yol telefon zəngidir.
-- Onlayn rezervasiya YOXDUR (pulsuz tier + sadəlik).
-- =============================================================

create type public.stay_type as enum (
  'qonaq_evi',   -- qonaq evi (ailə yanında qalma)
  'kiraye_ev'    -- kirayə ev
);

create table public.stays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.stay_type not null,
  description text,
  phone text not null,
  price_note text,                   -- sərbəst mətn: "gecəsi 30 AZN", "razılaşma ilə"
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.stays enable row level security;

create policy "stays public read" on public.stays
  for select using (status = 'approved' or public.is_staff());
create policy "stays staff write" on public.stays
  for all using (public.is_staff());
