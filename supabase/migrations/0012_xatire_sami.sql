-- =============================================================
-- Rəqəmsal xatirə şamı (Mərhələ 2-nin qalığı).
-- Ziyarətçi girişsiz şəhid profilində şam yandırır — yalnız sayğac,
-- heç bir şəxsi məlumat toplanmır. Anım günü bildirişləri push
-- infrastrukturu üzərində sonra qurulacaq (cron tələb edir).
-- =============================================================

create table public.memorial_candles (
  id uuid primary key default gen_random_uuid(),
  martyr_id uuid not null references public.martyrs (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index memorial_candles_martyr_idx on public.memorial_candles (martyr_id);

alter table public.memorial_candles enable row level security;

-- Sayğac hamıya görünür (sətirlərdə həssas heç nə yoxdur)
create policy "candles public read" on public.memorial_candles
  for select using (true);

-- Girişsiz şam yandırma — yalnız dərc olunmuş profillər üçün
create policy "candles anon insert" on public.memorial_candles
  for insert with check (
    exists (
      select 1 from public.martyrs m
      where m.id = martyr_id and m.status = 'approved'
    )
  );

-- Təmizlik lazım olsa staff silə bilir
create policy "candles staff delete" on public.memorial_candles
  for delete using (public.is_staff());
