# Supabase Setup — CuidarJuntos

## How to run the schema

1. Open your Supabase project dashboard → **SQL Editor**.
2. Create a **New query**.
3. Copy the entire contents of `supabase/schema.sql` and paste it into the editor.
4. Click **Run**.
5. Confirm the output shows no errors and all statements completed successfully.

> **Run the script once only.** It uses `create table if not exists`, `create or replace function`, and `do $$` blocks to avoid errors on re-run, but you should not need to re-run it unless you drop and recreate everything.

## Verify the setup

After running the schema, verify everything is in place:

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
- **Frontend data sync is NOT yet connected.** This schema is database-only preparation. The dashboard still uses `localStorage`. Connecting the frontend to Supabase data is the next phase.
- **Storage for real document uploads is NOT yet configured.** That will be added in a later phase.
- **Payments are NOT implemented.** Pricing cards on the landing page are purely cosmetic.

## Environment variables

Before connecting the frontend to Supabase data, set these in your Vercel project:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

The `.env.example` file at the project root already documents these variables.

## Next phase

1. Connect logged-in dashboard to Supabase data while keeping demo mode for anonymous users.
2. Add Supabase Storage for real document uploads.
3. Implement invitation flow for family members.
4. Add real-time sync with Supabase Realtime.