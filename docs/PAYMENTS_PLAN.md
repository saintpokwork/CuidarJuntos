# Payments Implementation — CuidarJuntos

> Status: implemented in code; production activation depends on Vercel env vars, Stripe webhook setup, and `supabase/billing.sql`.

## Live Pricing

| Plan | Monthly | Annual | Stripe env vars |
|---|---:|---:|---|
| Grátis / Free | €0 | €0 | none |
| Família / Family | €4.99 | €39 | `REACT_APP_STRIPE_PRICE_FAMILY_MONTHLY`, `REACT_APP_STRIPE_PRICE_FAMILY_YEARLY` |
| Famílias / Households | €8.99 | €79 | `REACT_APP_STRIPE_PRICE_HOUSEHOLDS_MONTHLY`, `REACT_APP_STRIPE_PRICE_HOUSEHOLDS_YEARLY` |

All paid plans use Stripe Checkout with a 14-day trial and Stripe Customer Portal for billing management.

## Implemented Surfaces

- Landing pricing CTAs route paid-plan intent through account creation.
- Signed-in users can upgrade/manage billing from `/dashboard/definicoes`.
- `/api/create-checkout-session` creates Stripe Checkout Sessions.
- `/api/create-customer-portal-session` opens Stripe Customer Portal for existing customers.
- `/api/stripe-webhook` verifies Stripe signatures and syncs subscription status to Supabase.
- `supabase/billing.sql` creates the `subscriptions` table and RLS policy.

## Required Production Env

Frontend-visible:

```env
REACT_APP_STRIPE_PRICE_FAMILY_MONTHLY=
REACT_APP_STRIPE_PRICE_FAMILY_YEARLY=
REACT_APP_STRIPE_PRICE_HOUSEHOLDS_MONTHLY=
REACT_APP_STRIPE_PRICE_HOUSEHOLDS_YEARLY=
```

Server-only:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not expose server-only keys to the frontend.

## Required Stripe Dashboard Step

Add a webhook endpoint:

```text
https://www.cuidarjuntos.pt/api/stripe-webhook
```

Subscribe to:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy.

## Required Supabase Step

Run `supabase/billing.sql` in the Supabase SQL Editor after `schema.sql`, `storage.sql`, and `invites.sql`.

## Remaining Product Work

- Plan-limit enforcement is not yet active. The app currently supports paid checkout and subscription status sync, but does not block Free users from features.
- Invoice history is handled through Stripe Customer Portal rather than custom UI.
- Legal wording is updated for Stripe, but should still receive professional legal review before a paid launch.
