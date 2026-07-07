-- =============================================================
-- Modul 14 — Nəqliyyat (Mərhələ 3).
-- Marşrutlar (Xıdırlı–Ağdam və s.): cədvəl mətni + sürücü əlaqəsi.
-- =============================================================

create table public.transport_routes (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- "Xıdırlı → Ağdam"
  schedule text not null,            -- sərbəst mətn: "Hər gün 08:00 və 14:00"
  driver_name text,
  phone text,
  note text,                         -- əlavə qeyd (qiymət, dayanacaq...)
  sort_order int not null default 0, -- siyahıda sıra
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.transport_routes enable row level security;

create policy "transport public read" on public.transport_routes
  for select using (status = 'approved' or public.is_staff());
create policy "transport staff write" on public.transport_routes
  for all using (public.is_staff());
