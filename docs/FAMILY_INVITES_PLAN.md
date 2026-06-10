# Family Invites Plan

> Current status: ✅ Invite token foundation only (no email sending yet)

---

## What Exists Now

- `supabase/invites.sql` — Creates `care_profile_invites` table with all fields, indexes, RLS policies, and updated_at trigger
- `/aceitar-convite` route — Branded placeholder page that reads `token` query param
- PT/EN translations for the invite acceptance page
- Updated Família page copy: "Email invitations will be enabled soon. The invite structure is already prepared."

## What Does NOT Exist Yet

- **No email sending** — Resend/SMTP integration not implemented
- **No invite creation UI** — Admins cannot yet create invite records from the Família page
- **No acceptance logic** — The `/aceitar-convite` page is a UI placeholder only

## Future Email Flow (with Resend or custom SMTP)

1. **Admin creates invite**: Admin fills in name, email, role on Família page → app creates a `care_profile_invites` row with a unique `token` (UUID)
2. **Email sent**: App sends email via Resend API (or custom SMTP) containing a link like `https://app.cuidarjuntos.pt/aceitar-convite?token={token}`
3. **Recipient clicks link**: Opens `/aceitar-convite?token=...`
4. **Validation**: If not logged in → prompt to create account or sign in. If logged in → validate token (not expired, not already accepted, email matches)
5. **Acceptance**: App creates a `care_profile_members` row with the invited role and status `active`, sets `care_profile_invites.accepted_at = now()` and `accepted_by = auth.uid()`
6. **Redirect**: Redirect to dashboard with success message

## Token Security

- Token is a random UUID generated server-side via `gen_random_uuid()`
- Token does not contain any private data (no email, name, or profile reference outside the DB)
- Invites expire after a configurable period (`expires_at` column, default 7 days)
- RLS prevents listing all invites — only members of the care profile or the invited email can see invite records

## RLS Summary

| Policy | Action | Who |
|---|---|---|
| `invites_select_members` | SELECT | Active members of the care profile |
| `invites_select_self` | SELECT | User whose `auth.email()` matches `invited_email` |
| `invites_insert_admin` | INSERT | Admin members only |
| `invites_update_admin` | UPDATE | Admin members only |
| `invites_delete_admin` | DELETE | Admin members only |

## Schema Reference

Table: `public.care_profile_invites`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | Auto-generated |
| care_profile_id | uuid FK → care_profiles | Required |
| invited_email | text | Required |
| invited_name | text | Optional |
| invited_by | uuid FK → auth.users | Set null on delete |
| role | text | 'admin', 'family', 'caregiver', 'viewer' |
| relationship | text | Optional free text |
| token | text UNIQUE | Auto-generated UUID |
| status | text | 'pending', 'accepted', 'expired', 'cancelled' |
| expires_at | timestamptz | Default now() + 7 days |
| accepted_at | timestamptz | Set when accepted |
| accepted_by | uuid FK → auth.users | Set when accepted |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto (trigger) |

## Manual SQL Editor Steps

After running `schema.sql` and `storage.sql`:

```sql
-- Run the invites migration
-- Paste contents of supabase/invites.sql into SQL Editor and click Run

-- Verify table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'care_profile_invites';

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'care_profile_invites';

-- Verify policies
SELECT policyname, permissive, cmd FROM pg_policies
WHERE tablename = 'care_profile_invites';
```

Expected: 1 table, RLS enabled, 5 policies (select_members, select_self, insert_admin, update_admin, delete_admin).