-- =============================================================
-- "Al-ver" — sakinlərin öz aralarında elan lövhəsi.
-- /bazar (istehsalçılar) və /elanlar (staff, rəsmi) ilə fərqlidir:
-- burada sakin GİRİŞLƏ ÖZÜ elan yerləşdirir (əşya/alət/icarə).
-- Forum modeli: dərhal dərc olunur (real ad + kənd etimadı), staff
-- yersizi silir. Müəllif adı sətrə köçürülür ki, profiles açılmasın
-- (orada telefon var — məxfilik). 30 gün sonra avtomatik köhnəlir.
-- =============================================================

create type public.market_category as enum (
  'satilir',   -- Satılır
  'axtariram', -- Axtarıram (lazımdır)
  'icare',     -- İcarə / borc (alət, texnika)
  'pulsuz'     -- Pulsuz (bağışlanır)
);

create table public.market_items (
  id uuid primary key default gen_random_uuid(),
  category public.market_category not null,
  title text not null,
  body text not null,
  price numeric(10, 2),              -- null → qiymət yoxdur / razılaşma ilə
  photo_path text,                   -- media bucket, alver/ qovluğu
  phone text not null,               -- əlaqə: tel: linki
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  valid_to timestamptz,              -- bitəndə avtomatik gizlənir
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

create index market_items_category_idx on public.market_items (category);

alter table public.market_items enable row level security;

-- Dərhal görünür (forum modeli): approved + vaxtı keçməmiş hamıya;
-- müəllif öz elanını həmişə görür (menimkiler); staff hamısını görür
create policy "market public read" on public.market_items
  for select using (
    (status = 'approved' and (valid_to is null or valid_to >= now()))
    or author_id = auth.uid()
    or public.is_staff()
  );
create policy "market auth insert" on public.market_items
  for insert with check (author_id = auth.uid() and status = 'approved');
create policy "market delete own or staff" on public.market_items
  for delete using (author_id = auth.uid() or public.is_staff());
create policy "market staff update" on public.market_items
  for update using (public.is_staff());

-- Girişli sakin al-ver fotosunu alver/ qovluğuna yükləyə bilir
-- (nümunə: 0020-dəki problemler/ siyasəti)
create policy "media auth upload alver" on storage.objects
  for insert with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'alver'
    and auth.uid() is not null
  );
