-- =============================================================
-- İcma əlavələri (bir migrasiyada 3 kiçik modul):
-- 1) Tədbirlərdə "Gələcəm" (RSVP) — iməcilik səfərbərliyi
-- 2) Kənd sorğuları — icra qərar qabağı açıq səs yığır
-- 3) Video xatirələr — YouTube linkləri (pulsuz hosting)
-- =============================================================

-- ---------- 1) Tədbir RSVP ----------
create table public.event_rsvps (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.event_rsvps enable row level security;

-- Sətirlərdə yalnız qeyri-şəffaf UUID-lər var — say hamıya açıqdır
create policy "rsvp public read" on public.event_rsvps
  for select using (true);
create policy "rsvp insert own" on public.event_rsvps
  for insert with check (user_id = auth.uid());
create policy "rsvp delete own" on public.event_rsvps
  for delete using (user_id = auth.uid());

-- ---------- 2) Sorğular ----------
create table public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options text[] not null,           -- variantlar (indekslə səs verilir)
  closes_at timestamptz,             -- null → açıq qalır
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now(),
  constraint polls_min_options check (array_length(options, 1) >= 2)
);

create table public.poll_votes (
  poll_id uuid not null references public.polls (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  option_index smallint not null,
  created_at timestamptz not null default now(),
  primary key (poll_id, user_id)
);

alter table public.polls enable row level security;
alter table public.poll_votes enable row level security;

create policy "polls public read" on public.polls
  for select using (status = 'approved' or public.is_staff());
create policy "polls staff write" on public.polls
  for all using (public.is_staff());

create policy "votes public read" on public.poll_votes
  for select using (true);
create policy "votes insert own" on public.poll_votes
  for insert with check (user_id = auth.uid());
create policy "votes update own" on public.poll_votes
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- 3) Video xatirələr ----------
create table public.video_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  description text,
  sort_order int not null default 0,
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

alter table public.video_items enable row level security;

create policy "videos public read" on public.video_items
  for select using (status = 'approved' or public.is_staff());
create policy "videos staff write" on public.video_items
  for all using (public.is_staff());
