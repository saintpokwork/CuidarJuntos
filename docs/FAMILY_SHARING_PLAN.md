# Family Sharing — Current Implementation

## Current Status

Family sharing supports demo mode and cloud mode.

## Demo Mode

- Family members are stored locally in the browser.
- Invite actions are simulated so users can understand the workflow without an account.

## Cloud Mode

- Members are loaded from `care_profile_members`.
- Roles are mapped between database values and UI labels:
  - `admin` → Administrador
  - `family` → Familiar
  - `caregiver` → Cuidador
  - `viewer` → Apenas leitura
- Only active admins can create/cancel invites or remove accepted members.
- Accepted member removal is persisted to Supabase and reflected after reload.

## Invite Flow

See `docs/FAMILY_INVITES_PLAN.md` for the token/email acceptance flow.

## QA Focus

- Admin sees management controls.
- Non-admin members do not see management controls.
- Invite creation sends email and keeps copy-link fallback.
- Invite acceptance works with the invited email.
- Admin member removal persists after refresh.
