-- ============================================================================
-- CuidarJuntos — Family Invites Table & RLS
-- ============================================================================
-- How to use:
--   1. Open your Supabase project SQL Editor
--   2. Run after schema.sql and storage.sql
--   3. Paste the entire file and click Run
--   4. Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS)
-- ============================================================================

-- 1. INVITES TABLE
-- ============================================================================

create table if not exists public.care_profile_invites (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  invited_email     text not null,
  invited_name      text,
  invited_by        uuid references auth.users(id) on delete set null,
  role              text not null default 'family',
  relationship      text,
  token             text not null unique,
  status            text not null default 'pending',
  expires_at        timestamptz not null,
  accepted_at       timestamptz,
  accepted_by       uuid references auth.users(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint chk_invite_role check (role in ('admin', 'family', 'caregiver', 'viewer')),
  constraint chk_invite_status check (status in ('pending', 'accepted', 'expired', 'cancelled'))
);

-- 2. INDEXES
-- ============================================================================

create index if not exists idx_invites_care_profile on public.care_profile_invites(care_profile_id);
create index if not exists idx_invites_email on public.care_profile_invites(invited_email);
create index if not exists idx_invites_token on public.care_profile_invites(token);
create index if not exists idx_invites_status on public.care_profile_invites(status);

-- 3. UPDATED-AT TRIGGER
-- ============================================================================

drop trigger if exists trg_care_profile_invites_updated_at on public.care_profile_invites;
create trigger trg_care_profile_invites_updated_at
  before update on public.care_profile_invites
  for each row execute function public.set_updated_at();

-- 4. RLS
-- ============================================================================

alter table public.care_profile_invites enable row level security;

-- 4.1 Select: care profile members can view invites for their care profile
drop policy if exists "invites_select_members" on public.care_profile_invites;
create policy "invites_select_members" on public.care_profile_invites
  for select
  using (
    public.is_care_profile_member(care_profile_id)
  );

-- 4.2 Select: invited user can see their own invite if their email matches
drop policy if exists "invites_select_self" on public.care_profile_invites;
create policy "invites_select_self" on public.care_profile_invites
  for select
  using (
    invited_email = auth.email()
  );

-- 4.3 Insert: only admins can create invites
drop policy if exists "invites_insert_admin" on public.care_profile_invites;
create policy "invites_insert_admin" on public.care_profile_invites
  for insert
  with check (
    public.is_care_profile_admin(care_profile_id)
  );

-- 4.4 Update: admins can update/cancel invites
drop policy if exists "invites_update_admin" on public.care_profile_invites;
create policy "invites_update_admin" on public.care_profile_invites
  for update
  using (
    public.is_care_profile_admin(care_profile_id)
  );

-- 4.5 Delete: admins can delete invites
drop policy if exists "invites_delete_admin" on public.care_profile_invites;
create policy "invites_delete_admin" on public.care_profile_invites
  for delete
  using (
    public.is_care_profile_admin(care_profile_id)
  );

-- 5. VERIFICATION QUERIES
-- ============================================================================
-- Run these after executing the migration to verify everything is in place.

-- Check table exists
-- select table_name from information_schema.tables
-- where table_schema = 'public' and table_name = 'care_profile_invites';

-- Check RLS is enabled
-- select tablename, rowsecurity from pg_tables
-- where schemaname = 'public' and tablename = 'care_profile_invites';

-- Check policies
-- select policyname, permissive, cmd from pg_policies
-- where tablename = 'care_profile_invites';