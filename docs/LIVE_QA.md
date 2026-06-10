# Live QA Checklist — CuidarJuntos

## What Has Been Tested

### 1. Build
- ✅ `npm run build` passes with no errors
- ✅ Compiled successfully (151.8 kB JS, 7.12 kB CSS gzipped)

### 2. Public Pages (code inspection)
- ✅ `/` — Landing page: hero, problems, features, how-it-works (4 steps), pricing, CTA, footer all present
- ✅ `/como-funciona` — 7-step guide with titles, descriptions, and icons in PT and EN
- ✅ `/entrar` — Sign-in form with email/password, validation, demo continue link, create account link
- ✅ `/criar-conta` — Sign-up form with name, email, password, confirm password, validation
- ✅ `/recuperar-password` — Password reset form with email field
- ✅ `/privacidade` — Privacy policy page
- ✅ `/termos` — Terms of use page
- ✅ 404 page — Shows friendly message with back-to-home and dashboard links

### 3. Auth Flow (code inspection)
- ✅ `/criar-conta` has name, email, password, confirm password fields
- ✅ Validation checks: empty fields, password min length (6), password mismatch
- ✅ `/entrar` uses `signInWithPassword` — proper Supabase auth
- ✅ Logged-in users redirect away from `/entrar` and `/criar-conta` (via `useEffect` with `user` check)
- ✅ Logout in `Definicoes` calls `signOut()` then `navigate('/')`
- ✅ Auth error messages are translated (e.g., `auth.errorSignIn`, `auth.errorSignUp`)
- ✅ Supabase auth state change listener properly updates user/session

### 4. Dashboard Demo Mode (code inspection)
- ✅ Demo banner shows "Guardar na conta" with sign-in/create account buttons
- ✅ "Dados de exemplo" note shown in demo mode
- ✅ localStorage persistence via `useEffect` watching `data` and `storageMode`
- ✅ Data loaded from localStorage on init via `loadFromStorage()`
- ✅ CRUD operations work locally (add/remove medications, tasks, appointments, notes)
- ✅ Demo mode does NOT show cloud sync active

### 5. Dashboard Cloud Mode (code inspection)
- ✅ `DashboardLayout` shows cloud sync status bar for logged-in users
- ✅ `cloudLoadAttempted` ref prevents duplicate loads on refresh
- ✅ On login: creates user profile → creates care profile → seeds starter data → loads all data
- ✅ On logout: resets to demo mode with localStorage data
- ✅ CRUD operations write to Supabase then update local state
- ✅ No duplicate seed data — `getOrCreateDefaultCareProfile` checks for existing profiles first
- ✅ `reloadCloudData()` allows manual refresh from Supabase

### 6. Supabase Adapter (code inspection)
- ✅ All CRUD methods return mapped data after success
- ✅ snake_case ↔ camelCase mapping is correct for all entities
- ✅ Task status mapping: por_fazer↔todo, em_progresso↔in_progress, concluido↔done
- ✅ Priority mapping: Baixa↔low, Média↔normal, Urgente↔urgent
- ✅ Medication estado↔active mapping correct
- ✅ Document metadata mapping correct (no file upload yet)
- ✅ RLS errors logged and handled gracefully (returns null/false)
- ✅ Care profile allergies/conditions joined/split on comma

### 7. UI Consistency (code inspection)
- ✅ Sidebar scrollbar hidden via `.sidebar-scroll` CSS class
- ✅ Mobile bottom nav with safe-area-inset padding
- ✅ Language toggle works in header and sidebar
- ✅ Dashboard banners correct (demo vs cloud)
- ✅ Glass cards with soft shadows consistent
- ✅ No overflow-x issues (`overflow-x-hidden` on root elements)

### 8. Translation Completeness
- ✅ PT and EN translations complete for all pages
- ✅ `howItWorks` section with 7 steps in both languages
- ✅ No "coming soon" / "em breve" for account-related features
- ✅ Early phase notes added to pricing and CTA sections
- ✅ Guide limitations updated (removed "no real account yet")

---

## Manual Test Checklist

Use this checklist when testing in the browser:

### Public Pages
- [ ] Visit `/` — hero loads, all sections visible, CTAs clickable
- [ ] Click "Ver como funciona" → navigates to `/como-funciona`
- [ ] Visit `/como-funciona` — all 7 steps show title + description
- [ ] Toggle PT/EN on `/como-funciona` — both languages complete
- [ ] Visit `/entrar` — form visible, fields work
- [ ] Visit `/criar-conta` — form visible, all 4 fields present
- [ ] Visit `/recuperar-password` — form visible
- [ ] Visit `/privacidade` and `/termos` — content readable
- [ ] Visit `/nonexistent-route` — shows 404 page

### Auth Flow
- [ ] Create account with valid data → success message
- [ ] Try create account with mismatched passwords → error shown
- [ ] Sign in with valid credentials → redirects to dashboard
- [ ] Sign in with wrong password → friendly error shown
- [ ] While logged in, visit `/entrar` → redirects to dashboard
- [ ] While logged in, visit `/criar-conta` → redirects to dashboard
- [ ] Sign out from settings → redirects to `/`

### Dashboard Demo Mode (incognito / logged out)
- [ ] Visit `/dashboard` — demo banner visible
- [ ] Add a medication → appears in list
- [ ] Add a task → appears in list
- [ ] Add an appointment → appears in list
- [ ] Add a care note → appears in list
- [ ] Refresh page → data persists
- [ ] Banner shows "Guardar na conta" with sign-in/create account links
- [ ] Banner does NOT say "cloud sync active"

### Dashboard Cloud Mode (logged in)
- [ ] Sign in → dashboard loads with cloud data
- [ ] Status bar shows "Sessão iniciada" with email
- [ ] Add a medication → saved to cloud
- [ ] Refresh page → cloud data persists
- [ ] Update care profile → changes saved
- [ ] Sign out → returns to demo mode
- [ ] Sign in again → cloud data reloads correctly

### PT/EN Toggle
- [ ] Toggle to EN on landing page → all text in English
- [ ] Toggle to PT → all text in Portuguese
- [ ] Toggle on dashboard → sidebar labels update
- [ ] Toggle on `/como-funciona` → steps in correct language

---

## Known Limitations

1. **Document upload not live yet** — Documents page only supports metadata (title, category, expiry). No file upload to Supabase Storage.
2. **Payments not live yet** — Pricing section shows plans with "Start for free" CTAs. No Stripe or payment integration.
3. **Family invitations not live yet** — Family page works in demo mode only. Cloud mode family members are not synced.
4. **Supabase Auth emails are generic** — Until Resend or custom SMTP is configured, password reset and confirmation emails use Supabase defaults.
5. **Logged-out users are demo/localStorage only** — Data stored in browser localStorage, not synced.
6. **Emergency contacts CRUD not exposed in cloud mode** — Contacts are seeded on first login but cannot be added/edited/deleted via the UI in cloud mode (adapter supports it, context does not expose it yet).
7. **Quick guide page** — Content marked as "Em desenvolvimento" / "Coming soon".

---

## Bugs Found & Fixed

1. **Dashboard greeting hardcoded** — `dashboardSummary` always showed "Bom dia, Ana Silva" instead of the actual care profile name. Fixed to use `data.careProfile.nome || caregiver.nome`.
2. **Duplicate cloud sync banner** — Cloud sync status was shown in both `DashboardLayout` and `Dashboard` page. Removed the redundant banner from `Dashboard.tsx`.

---

## Files Changed in This QA Pass

- `src/context/CareDataContext.tsx` — Fixed dashboard greeting to use dynamic profile name
- `src/pages/Dashboard.tsx` — Removed redundant cloud sync banner
- `docs/LIVE_QA.md` — This file

---

## Build & Deploy

```bash
npm run build        # ✅ Passes
git add .
git commit -m "Run live QA and fix customer readiness issues"
git push