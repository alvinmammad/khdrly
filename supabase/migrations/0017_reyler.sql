-- =============================================================
-- Modul 11-in son hissəsi: məhsul rəyləri.
-- Rəylər ÖN-moderasiyalıdır (forumdan fərqli) — istehsalçının
-- dolanışığına dəyən haqsız yazı dərc olunmamış süzülsün.
-- Hər istifadəçi bir məhsula bir rəy yazır; yenidən göndərəndə
-- köhnəsi yenilənib təzədən moderasiyaya düşür.
-- =============================================================

create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  body text,
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (product_id, author_id)
);

create index product_reviews_product_idx on public.product_reviews (product_id);

alter table public.product_reviews enable row level security;

-- Təsdiqlənmiş hamıya; öz rəyini müəllif görür; staff hamısını
create policy "reviews read" on public.product_reviews
  for select using (
    status = 'approved' or author_id = auth.uid() or public.is_staff()
  );
-- Yalnız öz adından, yalnız pending
create policy "reviews insert own" on public.product_reviews
  for insert with check (author_id = auth.uid() and status = 'pending');
-- Öz rəyini yeniləyəndə təzədən pending düşür
create policy "reviews update own" on public.product_reviews
  for update using (author_id = auth.uid())
  with check (author_id = auth.uid() and status = 'pending');
create policy "reviews staff update" on public.product_reviews
  for update using (public.is_staff());
create policy "reviews delete own or staff" on public.product_reviews
  for delete using (author_id = auth.uid() or public.is_staff());
