-- ============================================================================
-- CuidarJuntos — Supabase Storage Setup
-- ============================================================================
-- How to use:
--   1. Run schema.sql first (creates helper functions and tables)
--   2. Open Supabase SQL Editor
--   3. Paste this file
--   4. Run once. Safe to re-run (uses IF NOT EXISTS / DROP ... IF EXISTS).
-- ============================================================================

-- 1. HELPER FUNCTION: Extract care_profile_id from storage path
-- ============================================================================
-- Storage path convention: care-profiles/{care_profile_id}/{document_id}/{filename}
-- This function safely extracts the care_profile_id (2nd segment).
-- Returns NULL if path is invalid or not a UUID.

create or replace function public.storage_care_profile_id(object_name text)
returns uuid
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  segments text[];
  candidate uuid;
begin
  if object_name is null then
    return null;
  end if;

  segments := string_to_array(object_name, '/');

  -- Need at least: care-profiles / {uuid} / ...
  if array_length(segments, 1) < 3 then
    return null;
  end if;

  -- First segment must be 'care-profiles'
  if segments[1] != 'care-profiles' then
    return null;
  end if;

  -- Try to cast second segment to uuid
  begin
    candidate := segments[2]::uuid;
  exception when others then
    return null;
  end;

  return candidate;
end;
$$;

-- 2. CREATE PRIVATE BUCKET
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'care-documents',
  'care-documents',
  false,  -- private bucket
  5242880,  -- 5MB
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png'];

-- 3. STORAGE POLICIES
-- ============================================================================
-- All policies use bucket_id = 'care-documents' to scope to this bucket.
-- care_profile_id is extracted from the object name path via the helper function.

-- 3.1 SELECT: Active care profile members can read files
drop policy if exists "Care profile members can read files"
on storage.objects;

create policy "Care profile members can read files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'care-documents'
  and public.is_care_profile_member(public.storage_care_profile_id(name))
);

-- 3.2 INSERT: Admin/family/caregiver can upload files
drop policy if exists "Care profile members can upload files"
on storage.objects;

create policy "Care profile members can upload files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'care-documents'
  and public.get_care_profile_role(public.storage_care_profile_id(name)) in ('admin', 'family', 'caregiver')
);

-- 3.3 UPDATE: Admin/family/caregiver can update files
drop policy if exists "Care profile members can update files"
on storage.objects;

create policy "Care profile members can update files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'care-documents'
  and public.get_care_profile_role(public.storage_care_profile_id(name)) in ('admin', 'family', 'caregiver')
)
with check (
  bucket_id = 'care-documents'
  and public.get_care_profile_role(public.storage_care_profile_id(name)) in ('admin', 'family', 'caregiver')
);

-- 3.4 DELETE: Admins can delete files
drop policy if exists "Care profile admins can delete files"
on storage.objects;

create policy "Care profile admins can delete files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'care-documents'
  and public.is_care_profile_admin(public.storage_care_profile_id(name))
);