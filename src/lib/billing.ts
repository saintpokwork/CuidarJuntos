import { supabase, isSupabaseConfigured } from './supabaseClient';

export type PaidPlanKey = 'family' | 'households';
export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionStatus {
  planKey: 'free' | PaidPlanKey;
  billingCycle: BillingCycle | null;
  status: string;
  currentPeriodEnd: string | null;
  trialEnd: string | null;
}

const priceEnv: Record<PaidPlanKey, Record<BillingCycle, string | undefined>> = {
  family: {
    monthly: import.meta.env.REACT_APP_STRIPE_PRICE_FAMILY_MONTHLY,
    yearly: import.meta.env.REACT_APP_STRIPE_PRICE_FAMILY_YEARLY,
  },
  households: {
    monthly: import.meta.env.REACT_APP_STRIPE_PRICE_HOUSEHOLDS_MONTHLY,
    yearly: import.meta.env.REACT_APP_STRIPE_PRICE_HOUSEHOLDS_YEARLY,
  },
};

export const getConfiguredPriceId = (planKey: PaidPlanKey, billingCycle: BillingCycle) =>
  priceEnv[planKey][billingCycle] || '';

const getAccessToken = async () => {
  if (!isSupabaseConfigured) return '';
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || '';
};

export const createCheckoutSession = async (planKey: PaidPlanKey, billingCycle: BillingCycle) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { error: 'signin_required' as const };
  }

  const priceId = getConfiguredPriceId(planKey, billingCycle);
  if (!priceId) {
    return { error: 'price_missing' as const };
  }

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ planKey, billingCycle, priceId }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.url) {
    return { error: body?.error === 'Stripe checkout is not configured.' ? 'checkout_failed' : 'checkout_failed' };
  }

  window.location.assign(body.url);
  return { error: null };
};

export const createBillingPortalSession = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { error: 'signin_required' as const };
  }

  const response = await fetch('/api/create-customer-portal-session', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.url) {
    return { error: body?.error === 'No billing account found.' ? 'portal_missing' : 'portal_failed' };
  }

  window.location.assign(body.url);
  return { error: null };
};

export const loadSubscriptionStatus = async (): Promise<SubscriptionStatus | null> => {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan_key,billing_cycle,status,current_period_end,trial_end')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    planKey: (data.plan_key || 'free') as SubscriptionStatus['planKey'],
    billingCycle: (data.billing_cycle || null) as BillingCycle | null,
    status: data.status || 'unknown',
    currentPeriodEnd: data.current_period_end || null,
    trialEnd: data.trial_end || null,
  };
};
