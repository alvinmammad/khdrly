-- =============================================================
-- İanə modulu — şəffaf reyestr (Mərhələ 3).
-- Onlayn ödəniş YOXDUR (büdcə qaydası) — ianələr yerində/bank
-- köçürməsi ilə toplanır, staff reyestrə daxil edir, hamı görür.
-- =============================================================

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_display text not null default 'Anonim',  -- ianəçinin göstərilən adı
  amount numeric(12, 2),             -- pul ianəsi (AZN); null → əşya/əmək
  in_kind text,                      -- əşya/əmək ianəsi təsviri
  purpose text not null,             -- nəyə yönəlib: "Bulağın təmiri" və s.
  donated_at date not null default current_date,
  note text,
  status public.moderation_status not null default 'draft',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  -- ya məbləğ, ya əşya təsviri olmalıdır
  constraint donation_has_value check (amount is not null or in_kind is not null)
);

alter table public.donations enable row level security;

create policy "donations public read" on public.donations
  for select using (status = 'approved' or public.is_staff());
create policy "donations staff write" on public.donations
  for all using (public.is_staff());
