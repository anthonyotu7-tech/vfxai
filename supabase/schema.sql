-- ============================================================
-- VFXAI — Supabase schema
-- Run in the Supabase SQL editor after creating a project.
-- ============================================================

-- 1) Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  username text unique,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Avatars
create table if not exists public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  voice text,
  expression text,
  clothing text,
  background text,
  style text,
  thumbnail_url text,
  source_url text,
  status text not null default 'draft' check (status in ('draft','processing','ready','failed')),
  created_at timestamptz not null default now()
);

-- 3) Video projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  prompt text,
  avatar_id uuid references public.avatars(id) on delete set null,
  voice text,
  style text,
  duration_sec int not null default 10,
  aspect_ratio text not null default '16:9',
  thumbnail_url text,
  video_url text,
  status text not null default 'queued' check (status in ('queued','processing','completed','failed')),
  credits_used int not null default 0,
  created_at timestamptz not null default now()
);

-- 4) Credit ledger
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount int not null, -- positive = credit, negative = debit
  reason text not null,
  created_at timestamptz not null default now()
);

create or replace function public.get_credits(p_user_id uuid)
returns bigint as $$
  select coalesce(sum(amount), 0) from public.credit_transactions where user_id = p_user_id;
$$ language sql stable security definer;

-- 5) Subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('free','creator','pro')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  current_period_end timestamptz,
  provider_id text, -- Stripe/Paystack subscription id
  created_at timestamptz not null default now()
);

-- 6) Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents int not null,
  currency text not null default 'usd',
  provider text not null, -- 'stripe' | 'paystack'
  provider_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- 7) Live sessions
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  minutes_used int not null default 0,
  status text not null default 'active'
);

-- 8) Video calls
create table if not exists public.video_calls (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  room_code text not null unique,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status text not null default 'active'
);

-- 9) Templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  thumbnail_url text,
  aspect_ratio text not null default '16:9',
  prompt_template text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 10) User settings
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  theme text not null default 'dark',
  notifications jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.avatars enable row level security;
alter table public.projects enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.live_sessions enable row level security;
alter table public.video_calls enable row level security;
alter table public.user_settings enable row level security;
-- templates are public-read

-- Profiles: users see their own; admins see all
create policy "profiles: self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: admin read all" on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Avatars / Projects / Credits / Subscriptions / Payments / Live / Calls / Settings
create policy "avatars: self" on public.avatars for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects: self" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "credit_transactions: self" on public.credit_transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subscriptions: self" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "payments: self" on public.payments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "live_sessions: self" on public.live_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "video_calls: host" on public.video_calls for all using (auth.uid() = host_id) with check (auth.uid() = host_id);
create policy "user_settings: self" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Templates: public read
alter table public.templates enable row level security;
create policy "templates: public read" on public.templates for select using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', '')
  );
  -- Seed 500 free credits
  insert into public.credit_transactions (user_id, amount, reason)
  values (new.id, 500, 'welcome_bonus');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();