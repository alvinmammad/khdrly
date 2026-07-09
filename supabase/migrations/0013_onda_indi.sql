-- =============================================================
-- Modul 7 — Onda və indi (Mərhələ 2-nin qalığı).
-- Dağıntı/bərpa foto müqayisələri: iki şəkil + sürüşdürmə slideri.
-- Şəkilləri admin panel yükləyir (brauzerdə sıxılıb media bucket-inin
-- onda-indi/ qovluğuna gedir) — bunun üçün staff storage siyasəti.
-- =============================================================

create table public.then_now (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- "Kənd məktəbi"
  note text,                         -- istəyə bağlı qeyd (illər və s.)
  before_path text not null,         -- media bucket daxilində "onda" şəkli
  after_path text not null,          -- "indi" şəkli
  sort_order int not null default 0,
  status public.moderation_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.then_now enable row level security;

create policy "then_now public read" on public.then_now
  for select using (status = 'approved' or public.is_staff());
create policy "then_now staff write" on public.then_now
  for all using (public.is_staff());

-- Staff media bucket-inə istənilən qovluğa yükləyə bilir
create policy "media staff upload" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());
