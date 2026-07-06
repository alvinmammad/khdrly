-- =============================================================
-- XIDIRLI KƏND TƏTBİQİ — MVP sxemi (Mərhələ 1)
-- İstifadəçilər/rollar, CMS, canlı məlumat, xəritə, şəhidlər,
-- moderasiya və audit. Mərhələ 2 cədvəlləri (bazar, media arxivi,
-- forum) ayrıca migrasiyada gələcək.
-- =============================================================

-- ---------- Enumlar ----------
create type public.app_role as enum ('admin', 'moderator', 'farmer', 'service_provider', 'family_rep');
create type public.moderation_status as enum ('draft', 'pending', 'approved', 'rejected');
create type public.duty_type as enum ('aptek', 'feldser', 'elektrik', 'su');
create type public.place_type as enum (
  'mekteb', 'mescid', 'bulaq', 'abide', 'qebiristanliq',
  'saglamliq', 'magaza', 'tarixi_ev', 'tesserrufat', 'turizm'
);

-- ---------- Profillər və rollar ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  city text,          -- diaspora üzvləri üçün
  country text,
  is_resident boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references public.profiles (id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- Rol yoxlaması üçün köməkçi funksiya (RLS siyasətlərində istifadə olunur)
create or replace function public.has_role(r public.app_role)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = r
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_role('admin') or public.has_role('moderator');
$$;

-- ---------- CMS: statik səhifələr, xəbərlər, tədbirlər ----------
create table public.pages (
  slug text primary key,
  section text not null,
  title text not null,
  body text not null,
  audio_url text,                 -- Azure TTS ilə generasiya olunmuş "səsli dinlə" faylı
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  cover_emoji text,
  cover_url text,
  status public.moderation_status not null default 'draft',
  author_id uuid references public.profiles (id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status public.moderation_status not null default 'draft',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.duty_info (
  id uuid primary key default gen_random_uuid(),
  type public.duty_type not null,
  title text not null,
  body text not null,
  phone text,
  is_alert boolean not null default false,  -- true → ana səhifədə banner
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---------- Xəritə ----------
create table public.places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type public.place_type not null,
  lat double precision not null,
  lng double precision not null,
  body text,
  qr_slug text unique,            -- fiziki QR kodlar bu slug-a yönləndirir
  status public.moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

-- ---------- Şəhidlər / Qazilər (həssas bölmə — ikiqat təsdiq) ----------
create table public.martyrs (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  birth_date date,
  death_date date,
  photo_url text,
  bio text,
  awards text[],                  -- təltiflər (yalnız ictimai mənbə ilə)
  military_unit text,             -- hərbi hissə (yalnız ictimai mənbə ilə)
  sources text[] not null default '{}',  -- rəsmi mənbə istinadları — dərc üçün məcburi
  anniversary_notify boolean not null default false,  -- anım günü bildirişi
  status public.moderation_status not null default 'draft',
  family_rep_approved_by uuid references public.profiles (id),
  family_rep_approved_at timestamptz,
  admin_approved_by uuid references public.profiles (id),
  admin_approved_at timestamptz,
  created_at timestamptz not null default now(),
  -- dərc yalnız hər iki imza olduqda mümkündür
  constraint dual_approval check (
    status <> 'approved'
    or (family_rep_approved_at is not null and admin_approved_at is not null)
  )
);

create table public.family_representatives (
  user_id uuid not null references public.profiles (id) on delete cascade,
  martyr_id uuid not null references public.martyrs (id) on delete cascade,
  relation text not null,          -- qohumluq dərəcəsi
  verified_by uuid references public.profiles (id),
  verified_at timestamptz,
  primary key (user_id, martyr_id)
);

-- ---------- Bildirişlər ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,              -- xeber | tedbir | novbetci | anim
  title text not null,
  body text not null,
  channels text[] not null default '{push}',  -- push | sms | whatsapp (gələcək)
  sent_by uuid references public.profiles (id),
  sent_at timestamptz
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  fcm_token text unique not null,
  created_at timestamptz not null default now()
);

-- ---------- Moderasiya və audit ----------
create table public.moderation_flags (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  reporter_id uuid references public.profiles (id),
  reason text not null,
  resolved_by uuid references public.profiles (id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id),
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- =============================================================
-- RLS siyasətləri
-- Prinsip: təsdiqlənmiş məzmun hamıya (giriş tələb olunmur),
-- qaralama/gözləyən yalnız sahibinə və moderatora.
-- =============================================================
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.pages enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.duty_info enable row level security;
alter table public.places enable row level security;
alter table public.martyrs enable row level security;
alter table public.family_representatives enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.moderation_flags enable row level security;
alter table public.audit_log enable row level security;

-- Profillər: hər kəs öz profilini görür/yeniləyir; staff hamısını görür
create policy "own profile read" on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy "own profile update" on public.profiles
  for update using (id = auth.uid());
create policy "own profile insert" on public.profiles
  for insert with check (id = auth.uid());

-- Rollar: yalnız admin idarə edir, istifadəçi öz rollarını görür
create policy "roles read own" on public.user_roles
  for select using (user_id = auth.uid() or public.has_role('admin'));
create policy "roles admin write" on public.user_roles
  for all using (public.has_role('admin'));

-- Statik səhifələr: hamıya oxu, staff yazır
create policy "pages public read" on public.pages for select using (true);
create policy "pages staff write" on public.pages for all using (public.is_staff());

-- Xəbərlər: approved hamıya; staff hamısını görür və idarə edir
create policy "news public read" on public.news
  for select using (status = 'approved' or public.is_staff());
create policy "news staff write" on public.news for all using (public.is_staff());

-- Tədbirlər
create policy "events public read" on public.events
  for select using (status = 'approved' or public.is_staff());
create policy "events staff write" on public.events for all using (public.is_staff());

-- Növbətçi məlumatlar: hamıya oxu, staff yazır
create policy "duty public read" on public.duty_info for select using (true);
create policy "duty staff write" on public.duty_info for all using (public.is_staff());

-- Yerlər
create policy "places public read" on public.places
  for select using (status = 'approved' or public.is_staff());
create policy "places staff write" on public.places for all using (public.is_staff());

-- Şəhidlər: approved hamıya; ailə nümayəndəsi özününkünü görür; admin idarə edir
create policy "martyrs public read" on public.martyrs
  for select using (
    status = 'approved'
    or public.is_staff()
    or exists (
      select 1 from public.family_representatives fr
      where fr.martyr_id = martyrs.id and fr.user_id = auth.uid()
    )
  );
create policy "martyrs admin write" on public.martyrs
  for all using (public.has_role('admin'));

-- Ailə nümayəndəliyi: admin idarə edir, nümayəndə özününkünü görür
create policy "family rep read" on public.family_representatives
  for select using (user_id = auth.uid() or public.has_role('admin'));
create policy "family rep admin write" on public.family_representatives
  for all using (public.has_role('admin'));

-- Bildirişlər: staff
create policy "notifications staff" on public.notifications
  for all using (public.is_staff());

-- Push abunəlikləri: istifadəçi özününkünü idarə edir
create policy "push own" on public.push_subscriptions
  for all using (user_id = auth.uid() or public.is_staff());

-- Şikayətlər: qeydiyyatlı istifadəçi yaradır, staff baxır
create policy "flags insert" on public.moderation_flags
  for insert with check (auth.uid() is not null);
create policy "flags staff read" on public.moderation_flags
  for select using (public.is_staff());
create policy "flags staff update" on public.moderation_flags
  for update using (public.is_staff());

-- Audit: yalnız admin oxuyur (yazma server tərəfindən service_role ilə)
create policy "audit admin read" on public.audit_log
  for select using (public.has_role('admin'));
