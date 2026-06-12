# CuidarJuntos — Launch Readiness Tracker

> Last updated: June 2026
> Target: Public launch readiness on `https://www.cuidarjuntos.pt` → Paid launch later with Stripe

---

## A) Current Product Status

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Public landing page | ✅ Complete | Hero, features, pricing, CTA, footer — all translated PT/EN |
| 2 | PT/EN language toggle | ✅ Complete | Working across all pages, contrast fixed |
| 3 | Auth (sign up, login, password reset) | ✅ Complete | Supabase Auth, demo/cloud separation |
| 4 | Demo mode (localStorage) | ✅ Complete | Logged-out dashboard with demo data |
| 5 | Cloud sync (Supabase database) | ✅ Complete | Logged-in users sync all data to Supabase |
| 6 | Document upload / download / delete | ✅ Complete | PDF/JPG/PNG, 5MB limit, signed URLs, storage bucket |
| 7 | Emergency card | ✅ Complete | Print/share, 112 disclaimer |
| 8 | Medication tracking | ✅ Complete | Add/delete/toggle taken |
| 9 | Appointments | ✅ Complete | Add/delete |
| 10 | Tasks | ✅ Complete | Add/delete/status update |
| 11 | Care notes | ✅ Complete | Add/delete |
| 12 | Family member management (UI + roles) | ✅ Complete | Admin/viewer roles, member list from DB |
| 13 | Pending invite records (DB) | ✅ Complete | Create/cancel/copy link from `care_profile_invites` |
| 14 | Invite acceptance (real) | ✅ Complete | `/aceitar-convite` validates token and creates membership |
| 15 | Email invite sending (Resend/SMTP) | ✅ Complete | Server-side `/api/send-invite`, Resend API, copy-link fallback |
| 16 | Blog / resources | ✅ Complete | 4 PT/EN articles, branded layout |
| 17 | Legal / trust pages | ✅ Complete | Terms, Privacy with Nebula Craft Design attribution, GDPR, 112 |
| 18 | Security / privacy audit | ✅ Complete | No critical blockers found |
| 19 | Automated / static QA | ✅ Complete | See `docs/PRELAUNCH_AUTOMATED_QA.md` |
| 20 | Payments / Stripe | ⏳ Later | Plan created (`docs/PAYMENTS_PLAN.md`), not implemented |
| 21 | Branded emails (Resend/custom SMTP) | ✅ Complete | Supabase Auth SMTP + branded invite endpoint |
| 22 | Custom domain (cuidarjuntos.pt) | ✅ Complete | Production domain connected |
| 22 | Final professional legal review | ⏳ Later | Noted in-page on Terms and Privacy |
| 23 | Production analytics | ✅ Complete | Vercel Analytics wired in app root |

### Counts
- **Complete**: 20
- **Later**: 2 (payments, professional legal review)

---

## B) Manual QA Checklist Still Required

Refer to `docs/LAUNCH_QA_CHECKLIST.md` for the full list. Key items:

| # | Test | Priority |
|---|---|---|
| QA1 | Create account + confirm email | Critical |
| QA2 | Sign in + cloud sync | Critical |
| QA3 | Add medication (demo + cloud) | High |
| QA4 | Add appointment | High |
| QA5 | Add task + update status | High |
| QA6 | Upload PDF/JPG/PNG document | Critical |
| QA7 | Open signed document URL | Critical |
| QA8 | Delete document (cloud — storage + metadata) | Critical |
| QA9 | Create pending invite and send email | Critical |
| QA10 | Copy invite link fallback | High |
| QA11 | Cancel invite | High |
| QA12 | Switch PT/EN across all pages | High |
| QA13 | Mobile responsive check | High |
| QA14 | Privacy page content check | Critical |
| QA15 | Terms page content check | Critical |
| QA16 | Verify Supabase documents table rows | Critical |
| QA17 | Verify Supabase Storage objects | Critical |
| QA18 | Accept invite with a second account | Critical |
| QA19 | Admin removes accepted family member | Critical |

---

## C) Pre-Launch Blockers

| Blocker | Status | Resolution |
|---|---|---|
| Manual QA not completed | ⚠️ Open | Run `docs/LAUNCH_QA_CHECKLIST.md` before public launch |
| Professional legal review not completed | ⚠️ Open | In-page disclaimer notes this. Acceptable for beta if disclosed. |
| Payments not active | ⚠️ Open | Only blocks if launching paid plans. Free/beta mode bypasses this. |
| Security review of RLS | ⚠️ Open | Audit found no critical issues but professional review recommended. |

**Conclusion**: No hard blockers for a free launch once manual production QA passes. Payments and final legal review remain separate launch-stage decisions.

---

## D) Safe Soft-Launch Option

CuidarJuntos can be **soft-launched** as a free/beta product before payments are active if:

- ✅ Manual QA (`docs/LAUNCH_QA_CHECKLIST.md`) passes
- ✅ Legal text is accepted as provisional (with in-page review note)
- ✅ Production domain (`www.cuidarjuntos.pt`) is connected
- ✅ Branded account and invite emails are configured through Supabase SMTP / Resend
- ✅ Pricing cards clearly state "Planos pagos serão ativados mais tarde"
- ✅ Users are told about browser-only demo mode

This allows real users to test the product, give feedback, and build initial traction while domain/payments/email are finalised.

---

## E) Recommended Next Steps

| Order | Step | Dependencies | Effort |
|---|---|---|---|
| 1 | **Manual QA** | None — use `docs/LAUNCH_QA_CHECKLIST.md` | 2-4 hours |
| 2 | Fix bugs from manual QA | Manual QA results | Variable |
| 3 | Verify Resend delivery logs | Test account flows | 30 minutes |
| 4 | Stripe implementation | Per `docs/PAYMENTS_PLAN.md` | 8-16 hours |
| 5 | Final professional legal review | Stable product/legal copy | 2-4 hours |
| 6 | Paid launch | All above complete | — |

---

## F) What Not to Touch Yet

- ❌ Stripe code — until Stripe account + products/prices are ready
- ❌ Plan limits enforcement — until payments/subscriptions exist
- ❌ Database schema changes — until Stripe integration phase
- ❌ Sentry — nice-to-have, not blocking

---

## G) Docs Inventory

| Doc | Purpose | Status |
|---|---|---|
| `docs/LAUNCH_TRACKER.md` | This file — overall launch status | ✅ |
| `docs/LAUNCH_QA_CHECKLIST.md` | Manual QA test cases | ✅ |
| `docs/SECURITY_PRIVACY_AUDIT.md` | Security and privacy findings | ✅ |
| `docs/PAYMENTS_PLAN.md` | Stripe implementation plan | ✅ |
| `docs/FAMILY_INVITES_PLAN.md` | Invite token foundation | ✅ |
| `docs/FAMILY_SHARING_PLAN.md` | Family member management | ✅ |
| `docs/DOCUMENT_UPLOAD_QA.md` | Document upload QA | ✅ |
| `supabase/README.md` | Supabase setup instructions | ✅ |
