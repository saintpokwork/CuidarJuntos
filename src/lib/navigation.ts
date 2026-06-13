import type { BillingCycle, PaidPlanKey } from './billing';

export const PENDING_PLAN_KEY = 'cuidarjuntos-pending-plan';
const FIRST_GUIDE_SEEN_KEY = 'cuidarjuntos-first-guide-seen';

export interface PendingPlan {
  plan: PaidPlanKey;
  billing: BillingCycle;
}

export const isPaidPlanKey = (value: string | null): value is PaidPlanKey =>
  value === 'family' || value === 'households';

export const normaliseBillingCycle = (value: string | null): BillingCycle =>
  value === 'monthly' ? 'monthly' : 'yearly';

export const savePendingPlan = (plan: PaidPlanKey, billing: BillingCycle) => {
  localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify({ plan, billing }));
};

export const getPendingPlan = (): PendingPlan | null => {
  const pending = localStorage.getItem(PENDING_PLAN_KEY);
  if (!pending) return null;

  try {
    const parsed = JSON.parse(pending) as { plan?: string; billing?: string };
    const plan = parsed.plan || null;
    if (!isPaidPlanKey(plan)) return null;
    return {
      plan,
      billing: normaliseBillingCycle(parsed.billing || null),
    };
  } catch {
    localStorage.removeItem(PENDING_PLAN_KEY);
    return null;
  }
};

export const clearPendingPlan = () => {
  localStorage.removeItem(PENDING_PLAN_KEY);
};

export const getPostAuthDestination = (inviteToken = '') => {
  if (inviteToken) return `/aceitar-convite?token=${encodeURIComponent(inviteToken)}`;
  if (getPendingPlan()) return '/dashboard/definicoes?upgrade=1';

  if (localStorage.getItem(FIRST_GUIDE_SEEN_KEY) !== 'true') {
    localStorage.setItem(FIRST_GUIDE_SEEN_KEY, 'true');
    return '/dashboard/guia?first=1';
  }

  return '/dashboard';
};
