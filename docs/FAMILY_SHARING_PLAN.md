# Family Sharing Plan — Stage 1

> Implementation status: ✅ Stage 1 complete
> Next: Stage 2 — Real email invites

---

## Stage 1: Member Management UI & Role/Status Handling

### What Works Now

- **Demo mode (logged out)**: Família page keeps current simulated behaviour. Inviting a family member creates a local-only record with status `Convite enviado` / `Invite sent`. Delete removes from local state only.
- **Cloud mode (logged in)**: Família page loads real members from `care_profile_members` table via a Supabase join query (`loadCareDataFromSupabase` now fetches `care_profile_members` with profile join). Shows:
  - Member name (from `profiles.full_name` or fallback to truncated user_id)
  - Email (from `profiles.email`)
  - Role badge (Administrador / Familiar / Cuidador / Apenas leitura)
  - Status badge (Ativo / Convite pendente / Removido)
  - Delete button only for users with `canManageMembers = true` (admins and demo users)
- **Current user role**: Exposed via `currentUserRole`, `isCurrentUserAdmin`, `canManageMembers` in context

### What Is Demo/Simulated

- **Cloud mode invites**: The "Save pending invite" button stores the member locally only. No real DB insert is done because `care_profile_members` requires a valid `user_id` (references `auth.users`). Inserting an email-only placeholder without a user_id would break RLS and the foreign key constraint.
- **Real email sending**: Not implemented. No Resend, no SMTP, no invite tokens.

### Why Real Email Invites Are Not Sent Yet

The `care_profile_members` table requires:
- `user_id` — must reference an existing `auth.users` row
- `care_profile_id` — must reference an existing `care_profiles` row

Without an invite table that stores email/token separately from the membership, we cannot provision a placeholder for a user who hasn't signed up yet.

### Likely Future Schema Addition

A new table is needed for email-only invites before anyone has created an account:

```sql
create table if not exists public.care_profile_invites (
  id                uuid primary key default gen_random_uuid(),
  care_profile_id   uuid not null references public.care_profiles(id) on delete cascade,
  invited_by        uuid not null references auth.users(id) on delete cascade,
  invited_email     text not null,
  invited_name      text,
  role              text not null default 'family',
  invite_token      text not null unique default gen_random_uuid()::text,
  expires_at        timestamptz not null default now() + interval '7 days',
  accepted_at       timestamptz,
  created_at        timestamptz not null default now()
);
```

### Future Resend/Custom SMTP Invite Flow

1. Admin fills in name, email, role on Família page
2. App creates a record in `care_profile_invites` with a unique `invite_token`
3. App sends email via Resend (or custom SMTP) with a magic link containing the token
4. Recipient clicks link → creates account or logs in → token is validated → `care_profile_members` row is created with status `active` → `care_profile_invites.accepted_at` is set
5. Invited member appears in the care circle

### RLS/Admin Expectations

- Only `admin` role members can create invites and manage members
- `family`, `caregiver` roles can view members but not delete
- `viewer` role sees read-only UI
- `care_profile_members` RLS should allow:
  - `SELECT` for any active member of the same care_profile
  - `INSERT` for `admin` role members only
  - `DELETE` for `admin` role members only (cannot delete self)
  - `UPDATE` for `admin` role members (to change roles/status)

### Code Changes Summary

| File | Change |
|---|---|
| `src/lib/data/supabaseDataAdapter.ts` | Added `getCareProfileMembers`, `addCareProfileMember`, `removeCareProfileMember`, `updateCareProfileMember`, `getCurrentUserRole`; added member role/status mappers; added members join to `loadCareDataFromSupabase`; added `FamilyRole`, `MemberStatus` type imports |
| `src/context/CareDataContext.tsx` | Added `currentUserRole`, `isCurrentUserAdmin`, `canManageMembers` to interface and value; loads role on cloud mode mount |
| `src/pages/Familia.tsx` | Updated to show role + status badges; shows mode-specific notes (demo/cloud); uses `canManageMembers` to hide delete button; uses translated form labels; button text changes for cloud (Save pending invite) vs demo (Simulate invite) |
| `src/i18n/translations.ts` | Added 20+ PT/EN translation keys under `pages.family.*` |
| `src/data/initialData.ts` | Added `'Removido'` to `MemberStatus` type |
| `src/lib/data/types.ts` | Added `FamilyRole`, `MemberStatus` to re-exports |
| `docs/FAMILY_SHARING_PLAN.md` | This file — Stage 1 implementation plan |