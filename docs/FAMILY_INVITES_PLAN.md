# Family Invites — Current Implementation

## Current Status

Family invites are implemented for cloud accounts.

## What Exists

- `supabase/invites.sql` creates `care_profile_invites` with token, status, expiry, accepted metadata and RLS.
- `/dashboard/familia` lets admins create, copy and cancel pending invites.
- `/api/send-invite` sends branded invite emails through Resend after invite creation.
- `/aceitar-convite` validates invite tokens and creates/updates `care_profile_members`.
- Copy-link fallback remains available if email delivery fails.

## Flow

1. Admin creates an invite from Família.
2. App inserts a pending row into `care_profile_invites`.
3. App calls `/api/send-invite` with the current Supabase bearer session.
4. The API verifies the sender is an active admin for the care profile.
5. Resend sends the invite email with `/aceitar-convite?token=...`.
6. Recipient signs in or creates an account with the invited email.
7. Accepting the invite creates/updates an active membership and marks the invite accepted.

## Manual QA

- Create invite as admin.
- Confirm email arrives.
- Copy invite link and verify it opens the acceptance page.
- Accept with a second account using the invited email.
- Confirm the member appears in Família.
- Remove the member as admin and confirm removal persists after reload.
