-- =============================================================
-- Qonaq kitabı (Mərhələ 3 əlavəsi).
-- QR-la gələn ziyarətçilər və qonaqlar qısa təəssürat yazır.
-- Media arxivi sxemi: anonim yazı → pending → staff təsdiqi → dərc.
-- =============================================================

create table public.guest_entries (
  id uuid primary key default gen_random_uuid(),
  name text,                          -- istəyə bağlı: ad / şəhər
  message text not null,
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.guest_entries enable row level security;

create policy "guest public read" on public.guest_entries
  for select using (status = 'approved' or public.is_staff());

-- Anonim yalnız pending yaza bilər — moderasiyasız heç nə dərc olunmur
create policy "guest anon insert" on public.guest_entries
  for insert with check (status = 'pending');

create policy "guest staff update" on public.guest_entries
  for update using (public.is_staff());
create policy "guest staff delete" on public.guest_entries
  for delete using (public.is_staff());
