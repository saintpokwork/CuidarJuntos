# CuidarJuntos — Manual QA Results

> Use this file to track manual browser testing results.
> Mark each item as `[x]` when passed, or note issues in the Issues Found section.

---

## 1. Public Website QA

- [ ] Landing page (`/`) loads correctly — hero, CTAs, problems, features, pricing, footer
- [ ] `/como-funciona` loads correctly — all steps visible in PT/EN
- [ ] `/blog` loads — 4 article cards visible
- [ ] `/blog/organizar-cuidados-familiar-idoso` loads — content visible, disclaimer present
- [ ] `/blog/checklist-ficha-emergencia` loads
- [ ] `/blog/gestao-medicamentos-familia` loads
- [ ] `/blog/documentos-importantes-cuidador` loads
- [ ] `/entrar` (Sign in) page loads — form, links, language toggle
- [ ] `/criar-conta` (Create account) page loads
- [ ] `/recuperar-password` page loads
- [ ] `/privacidade` (Privacy) loads — all sections visible, contact email present
- [ ] `/termos` (Terms) loads — all sections visible, 112 callout present, Nebula Craft Design attribution
- [ ] `/aceitar-convite` loads — shows invalid message without token, shows invitation message with token
- [ ] Invalid URL shows 404 page with CuidarJuntos branding
- [ ] PT/EN language toggle works on all public pages
- [ ] Mobile layout — hero stacks, side nav doesn't overflow, cards stack
- [ ] Footer — links work (Privacy, Terms, Guias/Blog, Contact email)
- [ ] Pricing cards — "Começar gratuitamente" links to dashboard, early-phase note visible

---

## 2. Auth QA

- [ ] Create account — fill in email + password, submit
- [ ] Confirmation email received (check inbox/spam)
- [ ] Click confirmation link — verify redirect to app
- [ ] Sign in — email + password
- [ ] Sign in redirects to `/dashboard` with cloud sync banner
- [ ] Sign out — redirects to `/`, demo mode banners appear
- [ ] "Forgot password" — email received, reset works
- [ ] Auth errors — invalid email, wrong password, weak password — show friendly PT/EN messages

---

## 3. Demo Mode QA

- [ ] `/dashboard` accessible without login — demo data visible
- [ ] Demo banner — "Está a usar o CuidarJuntos em modo de demonstração…" (PT) / EN version
- [ ] Add medication — card appears, saved to localStorage
- [ ] Add appointment — card appears
- [ ] Add task — card appears
- [ ] Add document — simulated upload, card appears
- [ ] Add family member — "Simular convite" works
- [ ] Refresh page (F5) — all demo data persists in localStorage
- [ ] Clear browser storage → demo data resets to initial mock data
- [ ] Demo data does NOT appear in Supabase (verify in Supabase dashboard)

---

## 4. Cloud Mode QA

- [ ] Sign in → dashboard banner shows "Sessão iniciada — sincronização na nuvem ativa" (PT) or EN
- [ ] Care profile data loads from Supabase (medications, appointments, etc.)
- [ ] Add medication → appears after refresh
- [ ] Delete medication → removed after refresh
- [ ] Add appointment → appears after refresh
- [ ] Delete appointment → removed after refresh
- [ ] Add task → appears with correct status
- [ ] Update task status → persists after refresh
- [ ] Delete task → removed after refresh
- [ ] Add care note → appears
- [ ] Delete care note → removed
- [ ] Update care profile (Perfil page) → changes persist after refresh
- [ ] Sign out → falls back to demo data from localStorage
- [ ] Supabase dashboard — verify rows exist in `medications`, `appointments`, `tasks`, `care_notes`, `care_profiles` tables

---

## 5. Document Upload QA

- [ ] Upload PDF (<5MB) in cloud mode → file stored in Supabase Storage
- [ ] Upload JPG in cloud mode → stored
- [ ] Upload PNG in cloud mode → stored
- [ ] Open/download → signed URL opens file in new tab
- [ ] File >5MB → blocked with translated error message
- [ ] Unsupported file type (e.g., `.docx`, `.txt`) → blocked with translated error
- [ ] Delete document → storage object removed + metadata row deleted
- [ ] Verify Supabase Storage bucket `care-documents` — files present/removed as expected
- [ ] Demo mode — upload is simulated only, no real file in storage
- [ ] Double-click submit — button disabled during upload, only one submission

---

## 6. Family Invite QA

- [ ] Cloud mode → Família page loads with members from DB
- [ ] Create pending invite — fill email, name, role, relationships → saved to `care_profile_invites`
- [ ] Pending invite appears in list with role badge, status, expiry
- [ ] Copy invite link → toast "Link do convite copiado." / "Invite link copied."
- [ ] Cancel invite → removed from list and DB
- [ ] Verify `care_profile_invites` table in Supabase — rows created/deleted correctly
- [ ] `/aceitar-convite?token=...` — page loads with invitation message
- [ ] Demo mode → "Simular convite" only, no DB record created

---

## 7. Mobile QA

- [ ] Landing page — hero stacks vertically, CTAs don't overflow
- [ ] Header — logo + LanguageToggle + "Criar conta" button all visible
- [ ] Auth pages — forms usable, buttons tappable
- [ ] Dashboard — bottom nav bar visible and functional
- [ ] Document upload — file picker works on mobile
- [ ] Forms — inputs full width, large enough to tap
- [ ] Blog — cards stack vertically
- [ ] Legal pages — readable with comfortable line height
- [ ] No horizontal scroll on any page

---

## 8. Issues Found

| Date | Page | Issue | Severity | Status | Notes |
|---|---|---|---|---|---|
| | | | 🔴 Critical / 🟠 High / 🟡 Medium / ⚪ Low | ⬜ Open / 🔧 Fixing / ✅ Fixed | |

---

## 9. Final QA Sign-Off

- **Tested by**: _________________________
- **Date**: _________________________
- **Ready for beta**: ⬜ Yes / ⬜ No
- **Blockers** (if any): _________________________

---

> After completing QA, update `docs/LAUNCH_TRACKER.md` to mark manual QA as complete.