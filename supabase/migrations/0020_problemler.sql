-- =============================================================
-- "Problemi bildir" — kəndin mini-311 sistemi.
-- Sakin (girişli) infrastruktur problemini bildirir (foto ilə),
-- icra nümayəndəliyi statusu aparır, hamı şəffaf izləyir.
-- Şəffaflıq qərarı: problemlər İCTİMAİDİR (dublikatların qarşısını
-- alır, etimad yaradır); yalnız 'redd' (spam/yersiz) gizlədilir.
-- =============================================================

create type public.issue_status as enum (
  'yeni',         -- təzə bildirilib
  'baxilir',      -- icra baxır
  'hell_olunur',  -- iş gedir
  'hell_olundu',  -- bağlandı
  'redd'          -- yersiz/spam (ictimai siyahıda görünmür)
);

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  location text,                     -- sərbəst mətn: "məktəbin yanı"
  photo_path text,                   -- media bucket, problemler/ qovluğu
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reporter_name text not null,
  status public.issue_status not null default 'yeni',
  staff_note text,                   -- icranın rəsmi qeydi (hamıya görünür)
  created_at timestamptz not null default now()
);

alter table public.issues enable row level security;

create policy "issues public read" on public.issues
  for select using (
    status <> 'redd' or reporter_id = auth.uid() or public.is_staff()
  );
create policy "issues auth insert" on public.issues
  for insert with check (reporter_id = auth.uid() and status = 'yeni');
create policy "issues staff update" on public.issues
  for update using (public.is_staff());
-- Bildirən yalnız hələ baxılmamış problemini geri götürə bilər
create policy "issues delete" on public.issues
  for delete using (
    public.is_staff() or (reporter_id = auth.uid() and status = 'yeni')
  );

-- Girişli sakin problem fotosunu problemler/ qovluğuna yükləyə bilir
create policy "media auth upload problems" on storage.objects
  for insert with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'problemler'
    and auth.uid() is not null
  );
