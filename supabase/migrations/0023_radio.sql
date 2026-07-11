-- =============================================================
-- Kənd radiosu — köhnə Azərbaycan musiqisi.
-- Müəllif hüququ qərarı: musiqi bizim serverdə SAXLANMIR. İki mənbə:
--   'youtube' — köhnə mahnı pleyləsti (avtomatik dalə-dalə çalır)
--   'stream'  — canlı onlayn radio yayımının birbaşa (https) URL-i
-- Yalnız staff daxil edir; sakinlər dinləyir.
-- =============================================================

create type public.radio_kind as enum ('youtube', 'stream');

create table public.radio_items (
  id uuid primary key default gen_random_uuid(),
  kind public.radio_kind not null,
  title text not null,
  url text not null,                 -- youtube pleyləst/video linki VƏ YA stream URL
  description text,
  sort_order int not null default 0,
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

alter table public.radio_items enable row level security;

create policy "radio public read" on public.radio_items
  for select using (status = 'approved' or public.is_staff());
create policy "radio staff write" on public.radio_items
  for all using (public.is_staff());
