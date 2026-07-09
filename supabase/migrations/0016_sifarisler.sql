-- =============================================================
-- Modul 11-in qalanı: sifarişlər (ödənişsiz) + sifariş yazışması.
-- Axın: alıcı (girişli) sifariş verir → staff panelde görüb statusu
-- aparır (istehsalçı ilə telefonla razılaşdırır) → alıcı öz sifarişini
-- izləyir, yazışa bilir. İstehsalçı hesabları gələndə sifarişlər
-- birbaşa onlara yönləndiriləcək (producers.profile_id hazırdır).
-- =============================================================

create type public.order_status as enum (
  'yeni',         -- təzə sifariş
  'tesdiqlendi',  -- istehsalçı ilə razılaşdırıldı
  'hazirdir',     -- təhvilə hazırdır
  'catdirildi',   -- bağlandı
  'legv'          -- ləğv olundu
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  buyer_name text not null,
  buyer_phone text not null,         -- əlaqə üçün vacib
  quantity_note text,                -- "2 kq", "1 səbət" — sərbəst mətn
  note text,
  status public.order_status not null default 'yeni',
  created_at timestamptz not null default now()
);

create index orders_buyer_idx on public.orders (buyer_id);

create table public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  sender_name text not null,
  is_staff boolean not null default false,  -- alıcıya "rəsmi cavab" kimi görünsün
  body text not null,
  created_at timestamptz not null default now()
);

create index order_messages_order_idx on public.order_messages (order_id);

alter table public.orders enable row level security;
alter table public.order_messages enable row level security;

-- Sifarişi yalnız sahibi və staff görür (telefon var — məxfidir)
create policy "orders read own or staff" on public.orders
  for select using (buyer_id = auth.uid() or public.is_staff());
create policy "orders insert own" on public.orders
  for insert with check (buyer_id = auth.uid());
-- Statusu staff aparır
create policy "orders staff update" on public.orders
  for update using (public.is_staff());
-- Alıcı yalnız öz YENİ sifarişini ləğv edə bilər
create policy "orders buyer cancel" on public.orders
  for update using (buyer_id = auth.uid() and status = 'yeni')
  with check (status = 'legv');

-- Yazışma: yalnız sifarişin sahibi və staff
create policy "order msgs read" on public.order_messages
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.buyer_id = auth.uid()
    )
  );
create policy "order msgs insert" on public.order_messages
  for insert with check (
    sender_id = auth.uid()
    and (
      public.is_staff()
      or exists (
        select 1 from public.orders o
        where o.id = order_id and o.buyer_id = auth.uid()
      )
    )
  );
