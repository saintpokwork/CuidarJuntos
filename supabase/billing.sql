-- ============================================================================
-- CuidarJuntos — Billing / Stripe Subscription Status
-- ============================================================================
-- How to use:
--   1. Run schema.sql first.
--   2. Open Supabase SQL Editor.
--   3. Paste this file.
--   4. Run once. Safe to re-run.
-- ============================================================================

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id     text not null,
  stripe_subscription_id text not null,
  stripe_price_id        text,
  plan_key               text not null default 'free',
  billing_cycle          text,
  status                 text not null default 'incomplete',
  current_period_end     timestamptz,
  trial_end              timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint uq_subscriptions_stripe_subscription unique (stripe_subscription_id),
  constraint chk_subscriptions_plan check (plan_key in ('free', 'family', 'households')),
  constraint chk_subscriptions_billing_cycle check (billing_cycle is null or billing_cycle in ('monthly', 'yearly'))
);

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_customer on public.subscriptions(stripe_customer_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

drop policy if exists "Users can select own subscriptions" on public.subscriptions;
create policy "Users can select own subscriptions"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Inserts and updates are intentionally server-side only through the Stripe webhook
-- with SUPABASE_SERVICE_ROLE_KEY. Do not add authenticated write policies here.

-- Verification:
-- select * from information_schema.tables where table_schema = 'public' and table_name = 'subscriptions';
-- select policyname, cmd, roles from pg_policies where schemaname = 'public' and tablename = 'subscriptions';
