-- Flourish & Bloom cloud setup
-- Run this entire file once in Supabase Dashboard > SQL Editor > New query.

create table if not exists public.flourishBloom_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.flourishBloom_app_state enable row level security;

revoke all on table public.flourishBloom_app_state from anon;
grant select, insert, update, delete on table public.flourishBloom_app_state to authenticated;

drop policy if exists "Flourish & Bloom users can read own state" on public.flourishBloom_app_state;
create policy "Flourish & Bloom users can read own state"
on public.flourishBloom_app_state for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Flourish & Bloom users can insert own state" on public.flourishBloom_app_state;
create policy "Flourish & Bloom users can insert own state"
on public.flourishBloom_app_state for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Flourish & Bloom users can update own state" on public.flourishBloom_app_state;
create policy "Flourish & Bloom users can update own state"
on public.flourishBloom_app_state for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Flourish & Bloom users can delete own state" on public.flourishBloom_app_state;
create policy "Flourish & Bloom users can delete own state"
on public.flourishBloom_app_state for delete
to authenticated
using ((select auth.uid()) = user_id);
