-- =============================================================
-- Xatirə xəritəsi — köhnə kəndin kollektiv bərpası.
-- Sakinlər (girişli) xəritədə yer seçib xatirə yazır: "burada
-- dəyirman vardı", "bu evdə filankəs yaşayırdı". Yazılar staff
-- təsdiqindən sonra hamıya görünür — dağıdılmış kəndin planı
-- yaşlıların yaddaşından xəritəyə köçür.
-- =============================================================

create table public.memory_pins (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- "Köhnə dəyirman"
  body text not null,               -- xatirənin özü
  lat double precision not null,
  lng double precision not null,
  author_name text,                  -- razılıqla göstərilən ad (boş ola bilər)
  submitted_by uuid not null references public.profiles (id) on delete cascade,
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.memory_pins enable row level security;

create policy "pins public read" on public.memory_pins
  for select using (
    status = 'approved' or submitted_by = auth.uid() or public.is_staff()
  );
create policy "pins auth insert" on public.memory_pins
  for insert with check (submitted_by = auth.uid() and status = 'pending');
create policy "pins staff update" on public.memory_pins
  for update using (public.is_staff());
create policy "pins delete" on public.memory_pins
  for delete using (
    public.is_staff() or (submitted_by = auth.uid() and status = 'pending')
  );
