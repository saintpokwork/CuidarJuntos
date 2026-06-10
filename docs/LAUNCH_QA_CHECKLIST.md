# CuidarJuntos — Launch QA Checklist

> Date: June 2025
> Status: ✅ Ready for pre-launch manual QA

---

## A. Public Website QA

| # | Test | Expected | Status |
|---|---|---|---|
| A1 | Visit `/` (Home) | Landing page loads with hero, CTAs, problems, features, pricing, CTA, footer | ⬜ |
| A2 | Hero CTAs work | "Começar gratuitamente" → `/dashboard`, "Ver como funciona" → `/como-funciona` | ⬜ |
| A3 | Hero subtitle visible | "Experimente sem registo..." (PT) / "Try it without signing up..." (EN) | ⬜ |
| A4 | Nav links work | Como funciona, Funcionalidades, Preços scroll to sections | ⬜ |
| A5 | Language toggle works | Switch PT/EN — all text updates | ⬜ |
| A6 | "Entrar" → `/entrar` | Sign in page loads correctly | ⬜ |
| A7 | "Criar conta" → `/criar-conta` | Sign up page loads correctly | ⬜ |
| A8 | Footer links | Privacy → `/privacidade`, Terms → `/termos`, Guias → `/blog`, contact email | ⬜ |
| A9 | `/como-funciona` | Guide page loads with translated content | ⬜ |
| A10 | `/termos` | Comprehensive Terms visible with Nebula Craft Design attribution | ⬜ |
| A11 | `/privacidade` | Comprehensive Privacy visible with data inventory, GDPR, subprocessors | ⬜ |
| A12 | `/blog` | Blog index with 4 articles, PT and EN | ⬜ |
| A13 | Blog articles | Each article loads with proper h1/h2, disclaimer at bottom | ⬜ |
| A14 | `/aceitar-convite` | Placeholder page shows with/without token | ⬜ |
| A15 | Invalid URL → 404 | 404 page loads | ⬜ |
| A16 | `/recuperar-password` | Reset page loads | ⬜ |

## B. Auth QA

| # | Test | Expected | Status |
|---|---|---|---|
| B1 | Create account (PT) | Sign up works, confirmation email sent (Supabase default) | ⬜ |
| B2 | Create account (EN) | Same in English | ⬜ |
| B3 | Sign in (PT) | Sign in works, redirects to dashboard | ⬜ |
| B4 | Sign in (EN) | Same in English | ⬜ |
| B5 | Password reset | Reset email sent (Supabase default) | ⬜ |
| B6 | Sign out | Redirects to `/`, falls back to demo | ⬜ |

## C. Demo Mode QA

| # | Test | Expected | Status |
|---|---|---|---|
| C1 | Visit `/dashboard` without login | Dashboard loads in demo mode with yellow banner | ⬜ |
| C2 | Demo banner text PT | "Está a usar o CuidarJuntos em modo de demonstração..." | ⬜ |
| C3 | Demo banner text EN | "You are using CuidarJuntos in demo mode..." | ⬜ |
| C4 | Add medication (demo) | Medication card appears, saved to localStorage | ⬜ |
| C5 | Add appointment (demo) | Appointment card appears | ⬜ |
| C6 | Add task (demo) | Task card appears | ⬜ |
| C7 | Add document (demo) | Document card appears, upload simulated | ⬜ |
| C8 | Add family member (demo) | "Simular convite" creates local record | ⬜ |
| C9 | Refresh — data persists | All demo data remains after F5 | ⬜ |
| C10 | Clear browser data → reset | Data lost (as expected — documented) | ⬜ |
| C11 | Onboarding checklist visible | Shows "Configuração inicial" / "Initial setup" | ⬜ |

## D. Cloud Sync QA

| # | Test | Expected | Status |
|---|---|---|---|
| D1 | Sign in → dashboard loads cloud data | Profile data from Supabase visible | ⬜ |
| D2 | Cloud banner shows | "Sessão iniciada — sincronização na nuvem ativa" (PT) or EN | ⬜ |
| D3 | Add medication (cloud) | Saved to Supabase, visible after refresh | ⬜ |
| D4 | Add appointment (cloud) | Saved to Supabase | ⬜ |
| D5 | Add task (cloud) | Saved to Supabase | ⬜ |
| D6 | Update care profile | Saved to Supabase | ⬜ |
| D7 | Sign out → data falls back | Demo data from localStorage shown | ⬜ |

## E. Document Upload QA

| # | Test | Expected | Status |
|---|---|---|---|
| E1 | Upload PDF (<5MB) in cloud mode | File uploads to Supabase Storage, document card with open button | ⬜ |
| E2 | Upload JPG/PNG in cloud mode | Same | ⬜ |
| E3 | Open uploaded document | Signed URL opens file in new tab | ⬜ |
| E4 | Delete document (cloud) | File removed from storage + metadata deleted | ⬜ |
| E5 | File type rejection | `.txt`, `.docx` rejected with translated error | ⬜ |
| E6 | File >5MB rejection | Rejected with translated error | ⬜ |
| E7 | Demo mode upload simulated | No real upload, card appears with fileName only | ⬜ |
| E8 | Double-click prevention | Submit button disabled during upload | ⬜ |
| E9 | Remove selected file | File clears from upload area | ⬜ |

## F. Family Invites QA

| # | Test | Expected | Status |
|---|---|---|---|
| F1 | Cloud mode — create invite | Pending invite saved to `care_profile_invites` | ⬜ |
| F2 | Pending invites list shows | Email, name, role badge, status, expiry | ⬜ |
| F3 | Copy invite link | Link copied to clipboard, toast appears | ⬜ |
| F4 | Cancel invite | Invite removed from DB and list | ⬜ |
| F5 | `/aceitar-convite?token=...` | Placeholder page shows invitation message | ⬜ |
| F6 | No email sent | Confirmed — email sending is not yet active | ⬜ |
| F7 | Demo mode invites | "Simular convite" only, local record | ⬜ |

## G. PT/EN QA

| # | Test | Expected | Status |
|---|---|---|---|
| G1 | Switch PT → EN on landing page | All text updates | ⬜ |
| G2 | Dashboard nav in EN | Sidebar shows English labels | ⬜ |
| G3 | Blog in PT vs EN | Articles show correct language | ⬜ |
| G4 | Legal pages in both languages | Terms/Privacy show correct content per toggle | ⬜ |
| G5 | Auth forms in both languages | Sign in / Sign up labels correct | ⬜ |
| G6 | No mixed PT/EN on any page | Consistent throughout | ⬜ |
| G7 | Language toggle contrast readable | Active/inactive states clear on all backgrounds | ⬜ |

## H. Mobile QA

| # | Test | Expected | Status |
|---|---|---|---|
| H1 | Landing page mobile | Hero stacks vertically, CTAs fit, dashboard preview hidden | ⬜ |
| H2 | Header mobile | Logo, LanguageToggle, "Criar conta" button fit | ⬜ |
| H3 | Dashboard mobile nav | Bottom nav works, labels correct | ⬜ |
| H4 | Pricing cards stack | Cards stack vertically on small screens | ⬜ |
| H5 | Blog mobile | Cards stack, articles readable | ⬜ |
| H6 | Forms mobile | Inputs full width, buttons tappable | ⬜ |
| H7 | No horizontal scroll | All pages scroll vertically only | ⬜ |

## I. Legal/Trust QA

| # | Test | Expected | Status |
|---|---|---|---|
| I1 | Terms — provider identified | "Nebula Craft Design" mentioned | ⬜ |
| I2 | Terms — medical disclaimer | Clear not-medical-advice statement | ⬜ |
| I3 | Terms — 112 emergency | "Ligue 112" in callout box | ⬜ |
| I4 | Terms — demo vs cloud explained | Clear explanation | ⬜ |
| I5 | Terms — paid plans not active | Clearly stated | ⬜ |
| I6 | Privacy — data inventory listed | Medications, appointments, tasks, notes, contacts, documents | ⬜ |
| I7 | Privacy — Supabase + Vercel mentioned | Subprocessors listed | ⬜ |
| I8 | Privacy — GDPR rights | Access, correction, deletion, portability | ⬜ |
| I9 | Footer — company attribution | "by Nebula Craft Design" visible | ⬜ |
| I10 | Footer — contact email | contato@cuidarjuntos.pt | ⬜ |
| I11 | Legal review note | Visible on Terms and Privacy pages | ⬜ |

## J. Supabase Table/Storage Checks

| # | Test | Expected | Status |
|---|---|---|---|
| J1 | `care_profiles` table has data | At least 1 profile created | ⬜ |
| J2 | `care_profile_members` has admin | User is admin of their profile | ⬜ |
| J3 | `documents` table has metadata | `file_path` and `file_name` populated for uploads | ⬜ |
| J4 | `care_profile_invites` table exists | Created by `invites.sql` | ⬜ |
| J5 | `care-documents` bucket exists | Created by `storage.sql` | ⬜ |
| J6 | Storage RLS policies active | SELECT, INSERT, DELETE policies present | ⬜ |
| J7 | Invite RLS policies active | 5 policies for `care_profile_invites` | ⬜ |

## K. SEO/Static Files QA

| # | Test | Expected | Status |
|---|---|---|---|
| K1 | `robots.txt` accessible | Returns "Allow: /" | ⬜ |
| K2 | `sitemap.xml` accessible | Lists public routes | ⬜ |
| K3 | OG tags present | `og:title`, `og:description`, `og:type`, `og:site_name` | ⬜ |
| K4 | Meta description | Meaningful description in `<head>` | ⬜ |
| K5 | Page title | "CuidarJuntos — Organize os cuidados da sua família" | ⬜ |

## Known Limitations (Before Payments/Domain/Email)

- Payments (Stripe) are not integrated — see `docs/PAYMENTS_PLAN.md` for implementation plan
- Branded email domain (`cuidarjuntos.pt`) is not activated
- Real family invite emails are not sent (pending Resend/SMTP)
- Supabase default auth emails are used for confirmation/reset
- Legal copy needs professional legal review (noted in-page)
- Blog content is static (no CMS)
- Analytics/marketing tools not yet added
- Final security review still needed
- Production monitoring/error tracking not yet configured