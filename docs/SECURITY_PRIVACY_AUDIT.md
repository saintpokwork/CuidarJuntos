# Security & Privacy Readiness Audit — CuidarJuntos

> Date: June 2026
> Status: ✅ No critical blockers found

---

## 1. Secrets / Environment Audit

| Check | Result |
|---|---|
| `.env` files gitignored | ✅ `.gitignore` excludes `.env`, `.env.local`, `.env.*.local`, `.vercel` |
| `.env.example` uses placeholders | ✅ Supabase, public site URL and Resend variable names only — no real secrets |
| No service_role key exposed | ✅ Only anon key used in frontend |
| No Stripe keys committed | ✅ `docs/PAYMENTS_PLAN.md` has placeholder `sk_live_xxxx` (documentation only) |
| No Resend/UploadThing keys | ✅ Not present |
| No `VITE_` env vars | ✅ Uses `REACT_APP_` prefix (Create React App standard) |

### Risk: None

---

## 2. Supabase Client Audit

**File**: `src/lib/supabaseClient.ts`
- ✅ Anon key only
- ✅ Falls back to demo mode when env vars are missing (`isSupabaseConfigured`)
- ✅ No direct database connection strings
- ✅ All operations go through Supabase JS client (RLS enforced server-side)

---

## 3. RLS / SQL Audit

### `supabase/schema.sql` — All tables have RLS enabled

| Table | RLS | Policy Scoping | Safe? |
|---|---|---|---|
| `profiles` | ✅ | Own profile only | ✅ |
| `care_profiles` | ✅ | Members only | ✅ |
| `care_profile_members` | ✅ | Admin-gated INSERT/DELETE, members SELECT | ✅ |
| `medications` | ✅ | By care profile | ✅ |
| `appointments` | ✅ | By care profile | ✅ |
| `tasks` | ✅ | By care profile | ✅ |
| `documents` | ✅ | By care profile | ✅ |
| `care_notes` | ✅ | By care profile | ✅ |
| `emergency_contacts` | ✅ | By care profile | ✅ |

### `supabase/storage.sql`
- ✅ Bucket is `public = false` (private)
- ✅ File size limit = 5MB
- ✅ Allowed MIME types = PDF, JPG, PNG
- ✅ RLS policies for SELECT, INSERT, UPDATE, DELETE scoped to `storage_care_profile_id()` helper
- ✅ Helper extracts `care_profile_id` from path and validates UUID format

### `supabase/invites.sql`
- ✅ RLS enabled
- ✅ `invites_select_members` — only care profile members can see invites
- ✅ `invites_select_self` — only user whose email matches `invited_email` can see their invite
- ✅ `invites_insert_admin` — only admins can create invites
- ✅ `invites_update_admin` — only admins can update
- ✅ `invites_delete_admin` — only admins can delete
- ✅ Token is `text not null unique` — no predictable sequence
- ✅ No public SELECT policy

---

## 4. App Data Access Audit

### `src/lib/data/supabaseDataAdapter.ts`
- ✅ All CRUD operations go through Supabase client → RLS enforced server-side
- ✅ Document upload: creates metadata → uploads file → updates metadata. Rollback on failure
- ✅ Document delete: removes storage file first, then deletes metadata
- ✅ Invite create: generates token via `crypto.randomUUID()` (secure, unpredictable)
- ✅ Invite emails are sent server-side through `/api/send-invite`; Resend API key is not exposed to the browser
- ✅ Invite delete: removes from DB directly (RLS enforced)
- ✅ Console errors log operation name only, not user data
- ❓ **Minor**: Console logs include field-level errors from Supabase; these may contain column names but not user data

### `src/context/CareDataContext.tsx`
- ✅ Role checks (`isCurrentUserAdmin`) are supplementary to RLS — RLS is the real enforcement
- ✅ Demo mode never writes to Supabase
- ✅ Cloud mode only writes when `careProfileId` is set
- ✅ Delete operations call storage delete before metadata delete
- ✅ Error state shown to users uses translated messages, not raw errors

---

## 5. Document Upload Privacy Audit

| Check | Status |
|---|---|
| Max file size 5MB | ✅ Enforced in `validateFileForUpload` + storage bucket config |
| Allowed types: PDF, JPG, PNG | ✅ Same |
| Private bucket | ✅ `public = false` |
| Signed URL expiry (10 min) | ✅ `createSignedUrl(filePath, 600)` |
| File path sanitisation | ✅ `sanitiseFileName` lowercases, removes unsafe chars |
| Demo mode does not upload | ✅ Demo mode creates metadata only, no storage upload |
| User warning about sensitive documents | ✅ In Terms, Privacy, and document upload UI |
| File name visible in path | ⚠️ Sanitised but still includes original extension + sanitised name (e.g. `analises_2024.pdf`) — low risk since bucket is private and signed URLs are used |

---

## 6. Legal / Privacy Consistency

| Claim | In Privacy | In Terms | In UI |
|---|---|---|---|
| Supabase mentioned | ✅ Cloud/documents section | ✅ | ✅ Demo banner |
| Document upload privacy | ✅ Dedicated section | ✅ Documents section | ✅ Upload helper text |
| Demo/localStorage | ✅ Dedicated section | ✅ Account modes section | ✅ Demo banner |
| Not medical advice | ✅ | ✅ Callout box | ✅ Home disclaimer |
| Emergency 112 | ✅ | ✅ Red border callout | ✅ Emergency page |
| Nebula Craft Design | ✅ Provider section | ✅ Provider section | ✅ Footer |
| Legal review needed | ✅ | ✅ | N/A |
| Paid plans not active | ✅ | ✅ | ✅ Pricing note |

---

## 7. Invite / Token Security

- ✅ Token generated via `crypto.randomUUID()` (not `Math.random()`)
- ✅ `expires_at` = `now() + 7 days`
- ✅ `/aceitar-convite` validates token state and creates/updates membership only for the invited email
- ✅ `/api/send-invite` requires a Supabase bearer session and verifies active admin membership before sending
- ✅ Invite links show what they are ("Recebeu um convite...") without exposing profile data
- ✅ Pending invite list is behind RLS — only members can see invites
- ⚠️ Copy invite link feature copies the full token in URL — tokens are random UUIDs, not reversible

---

## 8. Console Log Exposure

| File | What is logged | Risk |
|---|---|---|
| `supabaseDataAdapter.ts` | Operation names + field-level errors | Low — column names only |
| `CareDataContext.tsx` | `[CareDataContext] Cloud load error:` with error object | Low — generic error objects |

Recommendation for production: replace `console.error` with a structured logger that sends to an error tracking service (Sentry, etc.) — not blocking.

---

## 9. Recommendations Before Public Launch

- [ ] Professional security review of RLS policies
- [ ] Enable Supabase logging/audit trail for production
- [ ] Verify Vercel environment variables are set correctly (anon key only)
- [ ] Test that deleting a Supabase user cascades correctly (document files in storage may not be cleaned up automatically — consider implementing a cleanup job)
- [ ] Review Supabase rate limiting / abuse prevention settings

## 10. Recommendations Before Paid Launch

- [ ] Add subscription table with RLS
- [ ] Add Stripe webhook handler (server-side only, never in frontend)
- [ ] Add plan limit enforcement (document upload count, family member count)
- [ ] Add billing page with current plan and upgrade flow
- [ ] Add legal billing/cancellation/refund terms

---

## Summary

**No critical security blockers found.** The app follows best practices: anon key only, RLS on all tables, private storage bucket, admin-gated invite operations, demo/cloud separation. The remaining items are production hardening and Stripe integration tasks.
