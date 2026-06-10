-- ============================================================================
-- CuidarJuntos — Supabase Schema, RLS & Triggers
-- ============================================================================
-- How to use:
--   1. Open your Supabase project SQL Editor
--   2. Paste the entire file
--   3. Run once. Do not re-run unless you want to start over.
-- ============================================================================

-- 1. EXTENSION
-- ============================================================================
create extension if not exists "pgcrypto" with schema extensions;

-- 2. HELPER FUNCTION: set_updated_at
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3. RLS HELPER FUNCTIONS
-- ============================================================================

-- Returns true if the calling user is a member of the given care profile.
create or replace function public.is_care_profile_member(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.care_profile_members
    where care_profile_id = profile_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

-- Returns true if the calling user is an admin of the given care profile.
create or replace function public.is_care_profile_admin(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.care_profile_members
    where care_profile_id = profile_id
      and user_id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

-- Returns the role ('admin', 'family', 'caregiver', 'viewer') of the calling user
-- for the given care profile, or null if not a member.
create or replace function public.get_care_profile_role(profile_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.care_profile_members
  where care_profile_id = profile_id
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

-- 4. AUTO-PROFILE TRIGGER ON AUTH.USERS
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, language)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    coalesce(new.raw_user_meta_data ->> 'language', 'pt')
  );
  return new;
end;
$$;

-- NOTE: The trigger on auth.users must be created by a superuser or in the
-- Supabase dashboard. If you see a permission error, create it manually:
--   create trigger on_auth_user_created
--     after insert on auth.users
--     for each row execute function public.handle_new_user();
-- If your Supabase project has the built-in trigger, this will coexist safely.
do $$
begin
  if not exists (
    select 1 from information_schema.triggers
    where event_object_schema = 'auth'
      and event_object_table = 'users'
      and trigger_name = 'on_auth_user_created'
  ) then
    execute 'create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user()';
  end if;
end;
$$;

-- 5. TABLES
-- ============================================================================

-- 5.1 profiles
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  full_name         text,
  email             text,
  language          text not null default 'pt',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 5.2 care_profiles
create table if not exists public.care_profiles (
  id                uuid primary key default gen_random_uuid(),
  created_by        uuid references auth.users(id) on delete set null,
  full_name         text not null,
  date_of_birth     date,
  address           text,
  sns_number        text,
  blood_type        text,
  allergies         text,
  conditions        text,
  doctor_name       text,
  doctor_phone      text,
  pharmacy_name     text,
  pharmacy_phone    text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 5.3 care_profile_members
create table if not exists public.care_profile_members (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  role              text not null default 'family',
  status            text not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint uq_care_profile_member unique (care_profile_id, user_id),
  constraint chk_care_profile_member_role check (role in ('admin', 'family', 'caregiver', 'viewer')),
  constraint chk_care_profile_member_status check (status in ('active', 'invited', 'removed'))
);

-- 5.4 medications
create table if not exists public.medications (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  name              text not null,
  dosage            text,
  frequency         text,
  time              text,
  instructions      text,
  responsible_user_id uuid references auth.users(id) on delete set null,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 5.5 medication_logs
create table if not exists public.medication_logs (
  id                uuid primary key default gen_random_uuid(),
  medication_id     uuid not null references public.medications(id) on delete cascade,
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  taken_by          uuid references auth.users(id) on delete set null,
  taken_date        date not null default current_date,
  status            text not null default 'taken',
  notes             text,
  created_at        timestamptz not null default now(),
  constraint uq_medication_log unique (medication_id, taken_date),
  constraint chk_medication_log_status check (status in ('taken', 'skipped', 'pending'))
);

-- 5.6 appointments
create table if not exists public.appointments (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  title             text not null,
  appointment_at    timestamptz,
  location          text,
  doctor_or_service text,
  responsible_user_id uuid references auth.users(id) on delete set null,
  notes             text,
  reminder_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 5.7 tasks
create table if not exists public.tasks (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  title             text not null,
  description       text,
  assigned_to       uuid references auth.users(id) on delete set null,
  due_date          date,
  status            text not null default 'todo',
  priority          text not null default 'normal',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint chk_task_status check (status in ('todo', 'in_progress', 'done')),
  constraint chk_task_priority check (priority in ('low', 'normal', 'high', 'urgent'))
);

-- 5.8 documents
create table if not exists public.documents (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  title             text not null,
  category          text,
  file_path         text,
  file_name         text,
  uploaded_by       uuid references auth.users(id) on delete set null,
  expiry_date       date,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 5.9 care_notes
create table if not exists public.care_notes (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  note              text not null,
  created_by        uuid references auth.users(id) on delete set null,
  created_at        timestamptz not null default now()
);

-- 5.10 emergency_contacts
create table if not exists public.emergency_contacts (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  name              text not null,
  relationship      text,
  phone             text,
  email             text,
  priority          int not null default 1,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 6. INDEXES
-- ============================================================================

create index if not exists idx_care_profile_members_user on public.care_profile_members(user_id);
create index if not exists idx_care_profile_members_profile on public.care_profile_members(care_profile_id);

create index if not exists idx_medications_profile on public.medications(care_profile_id);
create index if not exists idx_medication_logs_profile on public.medication_logs(care_profile_id);
create index if not exists idx_medication_logs_date on public.medication_logs(taken_date);

create index if not exists idx_appointments_profile on public.appointments(care_profile_id);
create index if not exists idx_appointments_date on public.appointments(appointment_at);

create index if not exists idx_tasks_profile on public.tasks(care_profile_id);
create index if not exists idx_tasks_due on public.tasks(due_date);

create index if not exists idx_documents_profile on public.documents(care_profile_id);
create index if not exists idx_documents_expiry on public.documents(expiry_date);

create index if not exists idx_care_notes_profile on public.care_notes(care_profile_id);

create index if not exists idx_emergency_contacts_profile on public.emergency_contacts(care_profile_id);

-- 7. UPDATED-AT TRIGGERS
-- ============================================================================

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_care_profiles_updated_at
  before update on public.care_profiles
  for each row execute function public.set_updated_at();

create trigger trg_care_profile_members_updated_at
  before update on public.care_profile_members
  for each row execute function public.set_updated_at();

create trigger trg_medications_updated_at
  before update on public.medications
  for each row execute function public.set_updated_at();

create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

create trigger trg_emergency_contacts_updated_at
  before update on public.emergency_contacts
  for each row execute function public.set_updated_at();

-- 8. ROW LEVEL SECURITY
-- ============================================================================

-- 8.1 profiles
alter table public.profiles enable row level security;

create policy "Users can select own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 8.2 care_profiles
alter table public.care_profiles enable row level security;

create policy "Members can select care profiles they belong to"
  on public.care_profiles for select
  using (public.is_care_profile_member(id));

create policy "Authenticated users can create care profiles"
  on public.care_profiles for insert
  with check (auth.role() = 'authenticated');

create policy "Admins can update care profiles"
  on public.care_profiles for update
  using (public.is_care_profile_admin(id));

create policy "Admins can delete care profiles"
  on public.care_profiles for delete
  using (public.is_care_profile_admin(id));

-- 8.3 care_profile_members
alter table public.care_profile_members enable row level security;

create policy "Members can view members of their care profile"
  on public.care_profile_members for select
  using (
    care_profile_id in (
      select care_profile_id
      from public.care_profile_members
      where user_id = auth.uid()
        and status = 'active'
    )
  );

create policy "Users can view their own membership"
  on public.care_profile_members for select
  using (user_id = auth.uid());

create policy "Creator can insert own admin membership"
  on public.care_profile_members for insert
  with check (
    user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  );

create policy "Admins can insert members"
  on public.care_profile_members for insert
  with check (
    public.is_care_profile_admin(care_profile_id)
  );

create policy "Admins can update members"
  on public.care_profile_members for update
  using (public.is_care_profile_admin(care_profile_id));

create policy "Admins can delete members"
  on public.care_profile_members for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.4 medications
alter table public.medications enable row level security;

create policy "Members can select medications"
  on public.medications for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert medications"
  on public.medications for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admin/family/caregiver can update medications"
  on public.medications for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete medications"
  on public.medications for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.5 medication_logs
alter table public.medication_logs enable row level security;

create policy "Members can select medication logs"
  on public.medication_logs for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert medication logs"
  on public.medication_logs for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admin/family/caregiver can update medication logs"
  on public.medication_logs for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete medication logs"
  on public.medication_logs for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.6 appointments
alter table public.appointments enable row level security;

create policy "Members can select appointments"
  on public.appointments for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert appointments"
  on public.appointments for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admin/family/caregiver can update appointments"
  on public.appointments for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete appointments"
  on public.appointments for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.7 tasks
alter table public.tasks enable row level security;

create policy "Members can select tasks"
  on public.tasks for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert tasks"
  on public.tasks for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admin/family/caregiver can update tasks"
  on public.tasks for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete tasks"
  on public.tasks for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.8 documents
alter table public.documents enable row level security;

create policy "Members can select documents"
  on public.documents for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert documents"
  on public.documents for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admin/family/caregiver can update documents"
  on public.documents for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete documents"
  on public.documents for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.9 care_notes
alter table public.care_notes enable row level security;

create policy "Members can select care notes"
  on public.care_notes for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert care notes"
  on public.care_notes for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete care notes"
  on public.care_notes for delete
  using (public.is_care_profile_admin(care_profile_id));

-- 8.10 emergency_contacts
alter table public.emergency_contacts enable row level security;

create policy "Members can select emergency contacts"
  on public.emergency_contacts for select
  using (public.is_care_profile_member(care_profile_id));

create policy "Admin/family/caregiver can insert emergency contacts"
  on public.emergency_contacts for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admin/family/caregiver can update emergency contacts"
  on public.emergency_contacts for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

create policy "Admins can delete emergency contacts"
  on public.emergency_contacts for delete
  using (public.is_care_profile_admin(care_profile_id));