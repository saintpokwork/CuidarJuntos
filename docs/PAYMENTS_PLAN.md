# Payments Implementation Plan — CuidarJuntos

> Status: 📋 Planning only — Stripe not yet integrated
> Target: After domain setup and legal review

---

## A. Current State

- Payments are **not active**.
- Users can currently use the product for free.
- Pricing cards on the landing page are **informational/early-phase only**.
- CTAs say "Começar gratuitamente" / "Start for free" and link to `/dashboard`.
- Terms of Use clearly state: *"Os planos pagos ainda não estão ativos."* / *"Paid plans are not yet active."*
- No Stripe account, no checkout links, no subscription data exists.
- Plan limits are not enforced anywhere.

### No Misleading Copy

✅ Checked — pricing UI does not say:
- "Choose this"
- "Subscribe now"
- "Buy"
- "Checkout"

All pricing CTAs are "Começar gratuitamente" / "Start for free".

---

## B. Recommended Launch Pricing (Portugal/EEA)

Pricing is based on Portuguese market research and similar SaaS tools in the EU health/family space.

| Plan | Monthly | Annual (save ~33%) | Target |
|---|---|---|---|
| **Grátis / Free** | €0 | €0 | Individuals testing the tool |
| **Família / Family** | €4.99/mês | €39/ano | Families actively managing care |
| **Plus** | €8.99/mês | €79/ano | Professional caregivers, larger families |

All prices include IVA/VAT where applicable.

### Why these price points

- Portuguese SaaS tools typically charge €3-10/month for productivity apps
- Family care is a high-trust, high-value category
- €4.99/mês feels affordable for a family splitting costs
- Annual discount incentivises long-term commitment

---

## C. Recommended Feature Limits Per Plan

### Free Plan (Grátis)

- 1 care profile
- Up to 2 family members/caregivers
- Up to 10 document uploads
- Basic medication tracking (no cloud sync, offline only)
- Appointments and tasks (non-shared)
- No file sharing with family members
- No priority support

### Family Plan (Família)

- Up to 3 care profiles
- Unlimited family members/caregivers
- Up to 100 document uploads
- Cloud sync via Supabase
- Document sharing with family members
- Emergency card
- Family tasks with assignees
- Care notes
- Exportable history
- Email support

### Plus Plan

- Up to 6 care profiles
- Unlimited family members/caregivers
- Up to 500 document uploads / higher storage
- Cloud sync
- Document sharing
- Emergency card
- Family tasks
- Care notes
- Exportable history
- Priority support (24h response)
- Future: SMS reminders, calendar integrations

---

## D. Stripe Implementation Plan

### Phase 1: Stripe Setup (future)

1. Create Stripe account
2. Add products/prices in Stripe Dashboard:
   - `family-monthly` — €4.99/mês
   - `family-yearly` — €39/ano
   - `plus-monthly` — €8.99/mês
   - `plus-yearly` — €79/ano
3. Keep pricing configurable via environment variables

### Phase 2: Checkout Integration (future)

1. Install `@stripe/stripe-js` and `stripe` npm packages
2. Add `REACT_APP_STRIPE_PUBLISHABLE_KEY` to `.env.example`
3. Create `src/lib/stripe.ts` with Stripe client initialization
4. Create Stripe Checkout Session creation in a serverless function or Vercel Edge Function
5. Update pricing card CTAs to open Stripe Checkout instead of `/dashboard`
6. Handle success/cancel return URLs

### Phase 3: Subscription Management (future)

1. Create Stripe Webhook endpoint (Edge Function or Supabase Edge Function)
2. Handle events:
   - `checkout.session.completed` → activate subscription
   - `invoice.paid` → update current period end
   - `customer.subscription.updated` → sync plan changes
   - `customer.subscription.deleted` → cancel subscription
3. Store subscription status in Supabase `subscriptions` table
4. Never trust frontend-only plan state — always verify with Stripe webhooks
5. Add Stripe Customer Portal link for self-service cancellation/plan changes

### Phase 4: Billing UI (future)

1. Add `/dashboard/faturacao` billing page (PT) / `/dashboard/billing` (EN)
2. Show current plan, next billing date, payment method
3. Show invoice history via Stripe Customer Portal
4. Add upgrade/downgrade flows

---

## E. Required Database Additions (Future)

Do not create now. When Stripe is implemented, add:

```sql
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id    TEXT NOT NULL,
  stripe_subscription_id TEXT,
  price_id              TEXT,
  plan                  TEXT NOT NULL DEFAULT 'free',
  status                TEXT NOT NULL DEFAULT 'active',
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_subscription_plan CHECK (plan IN ('free', 'family', 'plus')),
  CONSTRAINT chk_subscription_status CHECK (status IN ('active', 'past_due', 'canceled', 'trialing'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
```

Enable RLS: users can SELECT their own subscription, no one can INSERT/UPDATE directly (only via server-side webhook handler).

---

## F. Required Environment Variables (Future)

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx          # Server only
STRIPE_WEBHOOK_SECRET=whsec_xxxx       # Server only
```

Do not commit real keys to the repository. Use `.env.example` to document required variables.

---

## G. Product/Legal Updates Needed When Payments Go Live

### Terms of Use
- Add billing terms section (payment methods, billing cycle, auto-renewal)
- Add refund/cancellation policy
- Add price change notification terms

### Privacy Policy
- Add Stripe as payment processor subprocessor
- Add billing data collection notice (last 4 digits, expiry, not full card)

### Pricing Page
- Update CTAs from "Começar gratuitamente" to "Escolher plano Família" / "Choose Family plan"
- Add "Inclui 14 dias de teste gratuito" / "Includes 14-day free trial" note

### Dashboard
- Add billing page with current plan, upgrade option, invoice history
- Show plan limits (e.g., "5/10 documents used")

### App Logic
- Enforce plan limits (check subscription tier before allowing document upload, family adds, etc.)
- Show upgrade prompt when limits are hit

---

## H. Safe Pre-Payment UI Approach

Until Stripe is integrated:

- ✅ Pricing CTAs → "Começar gratuitamente" / "Start for free"
- ✅ All CTAs link to `/dashboard` (demo/account creation)
- ✅ Early-phase note visible: *"Planos pagos serão ativados mais tarde. Durante a fase inicial, pode experimentar gratuitamente."*
- ✅ Terms state paid plans are not active
- ✅ No broken checkout buttons exist
- ⏳ After Stripe: update CTAs to checkout links

---

## I. Recommended Implementation Order

1. ✅ Audit current state (this doc)
2. ⏳ Domain setup + branded email (cuidarjuntos.pt, Resend)
3. ⏳ Final security review
4. ⏳ Professional legal review of Terms/Privacy
5. ⏳ Stripe account creation + products/prices setup
6. ⏳ Implement Stripe Checkout flow
7. ⏳ Implement webhook handler + subscription table
8. ⏳ Add billing UI + plan limits
9. ⏳ Update pricing page CTAs
10. ⏳ Soft launch with paid plans