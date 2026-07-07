-- =============================================================
-- Modul 9 — Media arxivi + "Siz də paylaşın" yükləmə axını.
-- Sxem: sakin girişsiz foto yükləyir (razılıq checkbox məcburi),
-- yazı 'pending' düşür və YALNIZ staff təsdiqindən sonra görünür.
-- Şəkillər brauzerdə sıxılır (pulsuz tier qaydası) və 'media'
-- bucket-inin 'paylasilan/' qovluğuna gedir.
-- =============================================================

-- Storage bucket (5 MB limit, yalnız şəkil formatları)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Anonim yükləmə yalnız paylasilan/ qovluğuna
create policy "media anon upload" on storage.objects
  for insert with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'paylasilan'
  );

-- Silmə yalnız staff (moderasiya rədd edəndə)
create policy "media staff delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());

-- ---------- Media yazıları ----------
create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  taken_period text,                 -- sərbəst mətn: "1980-ci illər", "2021-ci il yaz"
  storage_path text not null,        -- media bucket daxilində yol
  uploader_name text,                -- istəyə bağlı: paylaşanın adı
  consent boolean not null default false,
  status public.moderation_status not null default 'pending',
  approved_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.media_items enable row level security;

-- Təsdiqlənmiş hamıya; staff hamısını görür (moderasiya növbəsi)
create policy "media items public read" on public.media_items
  for select using (status = 'approved' or public.is_staff());

-- Anonim əlavə: yalnız pending + razılıq verilmiş halda
create policy "media items anon insert" on public.media_items
  for insert with check (status = 'pending' and consent = true);

-- Moderasiya: staff yeniləyir/silir
create policy "media items staff update" on public.media_items
  for update using (public.is_staff());
create policy "media items staff delete" on public.media_items
  for delete using (public.is_staff());
