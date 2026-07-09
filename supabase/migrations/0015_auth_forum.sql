-- =============================================================
-- İstifadəçi girişi (Google OAuth) + Forum (Modul 10 v1).
-- Qayda dəyişmir: BAXIŞ üçün giriş tələb olunmur — giriş yalnız
-- yazı yaratmaq üçündür. Qeydiyyat Google ilə; yeni auth istifadəçisi
-- üçün profiles sətri avtomatik yaranır (trigger).
-- =============================================================

-- Yeni istifadəçi → avtomatik profil (adı Google-dan götürülür)
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Forum ----------
-- Yazılar dərhal görünür (kənd icması, ön-moderasiya yoxdur);
-- müəllif adı yazıya köçürülür ki, profiles cədvəli açılmasın
-- (orada telefon var — məxfilik qorunur).

create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics (id) on delete cascade,
  body text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null,
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

create index forum_posts_topic_idx on public.forum_posts (topic_id);

alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;

create policy "topics public read" on public.forum_topics
  for select using (status = 'approved' or public.is_staff());
create policy "topics auth insert" on public.forum_topics
  for insert with check (auth.uid() = author_id and status = 'approved');
create policy "topics delete own or staff" on public.forum_topics
  for delete using (author_id = auth.uid() or public.is_staff());
create policy "topics staff update" on public.forum_topics
  for update using (public.is_staff());

create policy "posts public read" on public.forum_posts
  for select using (status = 'approved' or public.is_staff());
create policy "posts auth insert" on public.forum_posts
  for insert with check (auth.uid() = author_id and status = 'approved');
create policy "posts delete own or staff" on public.forum_posts
  for delete using (author_id = auth.uid() or public.is_staff());
create policy "posts staff update" on public.forum_posts
  for update using (public.is_staff());
