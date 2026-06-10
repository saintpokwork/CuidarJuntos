# Supabase Setup — CuidarJuntos

## How to run the schema

1. Open your Supabase project dashboard → **SQL Editor**.
2. Create a **New query**.
3. Copy the entire contents of `supabase/schema.sql` and paste it into the editor.
4. Click **Run**.
5. Confirm the output shows no errors and all statements completed successfully.

> **Run the script once only.** It uses `create table if not exists`, `create or replace function`, and `do $$` blocks to avoid errors on re-run, but you should not need to re-run it unless you drop and recreate everything.

## How to run the storage setup

After running `schema.sql`, set up Supabase Storage:

1. Open your Supabase project dashboard → **SQL Editor**.
2. Create a **New query**.
3. Copy the entire contents of `supabase/storage.sql` and paste it into the editor.
4. Click **Run**.
5. Confirm the output shows no errors.

> This creates the `care-documents` private bucket, the `storage_care_profile_id()` helper function, and all storage RLS policies. Safe to re-run.

## How to run the invites setup

After running `schema.sql` and `storage.sql`, set up family invitations:

1. Open your Supabase project dashboard → **SQL Editor**.
2. Create a **New query**.
3. Copy the entire contents of `supabase/invites.sql` and paste it into the editor.
4. Click **Run**.
5. Confirm the output shows no errors.

> This creates the `care_profile_invites` table with RLS policies, indexes, and the updated-at trigger. Safe to re-run.

## Verify the setup

After running the schema files in order (schema.sql → storage.sql → invites.sql), verify everything is in place:

```sql
-- Check tables
select table_name from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

-- Check RLS is enabled on invites
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename = 'care_profile_invites';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'care-documents';

-- Check storage policies
SELECT policyname, cmd
FROM storage.policies
WHERE bucket_id = 'care-documents';

-- Check helper function exists
SELECT proname FROM pg_proc WHERE proname = 'storage_care_profile_id';
```

Expected: 1 row for the bucket, 4 rows for policies (SELECT, INSERT, UPDATE, DELETE), 1 row for the helper function, RLS enabled on invites table.

### Verify invites setup

```sql
-- Check invites table exists
select table_name from information_schema.tables
where table_schema = 'public' and table_name = 'care_profile_invites';

-- Check invites policies
select policyname, permissive, cmd from pg_policies
where tablename = 'care_profile_invites';
```

Expected: 1 table, 5 policies (select_members, select_self, insert_admin, update_admin, delete_admin).

```sql
-- Check tables
select table_name from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

-- Check RLS is enabled
select tablename, rowsecurity from pg_tables
where schemaname = 'public'
  and tablename not like 'pg_%'
order by tablename;

-- Check triggers exist
select trigger_name, event_object_table from information_schema.triggers
where trigger_schema = 'public';

-- Check auth trigger
select trigger_name from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users';
```

Expected tables: `profiles`, `care_profiles`, `care_profile_members`, `medications`, `medication_logs`, `appointments`, `tasks`, `documents`, `care_notes`, `emergency_contacts`.

## ⚠️ Important notes

- **Never expose the service_role key in the frontend.** Use the anon key with RLS.
- **The auth trigger (`on_auth_user_created`) is optional.** If your Supabase project already has an auto-profile trigger, the `do $$` block will detect it and skip creation. If it fails due to permissions, create it manually:
  ```sql
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
  ```
- **Frontend data sync is connected.** Logged-in users sync data to Supabase via `CareDataContext` + `supabaseDataAdapter.ts`. Logged-out users use localStorage demo mode.
- **Supabase Storage is prepared** — `supabase/storage.sql` creates the bucket and policies. Frontend upload UI is the next phase. See `docs/STORAGE_PLAN.md`.
- **Payments are NOT implemented.** Pricing cards on the landing page are purely cosmetic.

## Environment variables

Before connecting the frontend to Supabase data, set these in your Vercel project:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

The `.env.example` file at the project root already documents these variables.

## Next phase

1. ✅ Connect logged-in dashboard to Supabase data (done).
2. ✅ Supabase Storage SQL prepared (`supabase/storage.sql`). Frontend upload integration is next.
3. ⏳ Implement invitation flow for family members.
4. ⏳ Add real-time sync with Supabase Realtime.
