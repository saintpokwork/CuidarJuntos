-- Medication scheduling + MAR upgrade for existing CuidarJuntos projects.
-- Safe to run more than once.

alter table public.medications add column if not exists form text;
alter table public.medications add column if not exists route text;
alter table public.medications add column if not exists schedule_type text;
alter table public.medications add column if not exists schedule_times jsonb not null default '[]'::jsonb;
alter table public.medications add column if not exists schedule_days jsonb not null default '[]'::jsonb;
alter table public.medications add column if not exists is_prn boolean not null default false;

create table if not exists public.medication_administrations (
  id                uuid primary key default gen_random_uuid(),
  medication_id     uuid not null references public.medications(id) on delete cascade,
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  scheduled_date    date not null,
  scheduled_time    text not null,
  status            text not null default 'pending',
  marked_by         uuid references auth.users(id) on delete set null,
  marked_by_name    text,
  marked_at         timestamptz,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint uq_medication_administration unique (medication_id, scheduled_date, scheduled_time),
  constraint chk_medication_administration_status check (status in ('pending', 'taken', 'skipped', 'missed'))
);

create index if not exists idx_medication_administrations_profile_date
  on public.medication_administrations(care_profile_id, scheduled_date);

create index if not exists idx_medication_administrations_medication_date
  on public.medication_administrations(medication_id, scheduled_date);

drop trigger if exists trg_medication_administrations_updated_at on public.medication_administrations;
create trigger trg_medication_administrations_updated_at
  before update on public.medication_administrations
  for each row execute function public.set_updated_at();

alter table public.medication_administrations enable row level security;

drop policy if exists "Members can select medication administrations" on public.medication_administrations;
create policy "Members can select medication administrations"
  on public.medication_administrations for select
  using (public.is_care_profile_member(care_profile_id));

drop policy if exists "Admin/family/caregiver can insert medication administrations" on public.medication_administrations;
create policy "Admin/family/caregiver can insert medication administrations"
  on public.medication_administrations for insert
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

drop policy if exists "Admin/family/caregiver can update medication administrations" on public.medication_administrations;
create policy "Admin/family/caregiver can update medication administrations"
  on public.medication_administrations for update
  using (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  )
  with check (
    public.get_care_profile_role(care_profile_id) in ('admin', 'family', 'caregiver')
  );

drop policy if exists "Admins can delete medication administrations" on public.medication_administrations;
create policy "Admins can delete medication administrations"
  on public.medication_administrations for delete
  using (public.is_care_profile_admin(care_profile_id));

grant select, insert, update, delete on public.medication_administrations to authenticated;
