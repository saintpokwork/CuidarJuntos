import { BillingCycle, PaidPlanKey } from './billing';

export const planPrices: Record<PaidPlanKey, Record<BillingCycle, string>> = {
  family: {
    monthly: '4,99€',
    yearly: '39€',
  },
  households: {
    monthly: '8,99€',
    yearly: '79€',
  },
};

export const planAfterTrial: Record<PaidPlanKey, Record<BillingCycle, string>> = {
  family: {
    monthly: '4,99€/mês',
    yearly: '39€/ano',
  },
  households: {
    monthly: '8,99€/mês',
    yearly: '79€/ano',
  },
};

export const planSavings: Record<PaidPlanKey, string> = {
  family: 'Poupe mais de 4 meses',
  households: 'Poupe mais de 3 meses',
};

export const freePlanSummaryKeys = [
  'billing.freeIncludes.items.0',
  'billing.freeIncludes.items.1',
  'billing.freeIncludes.items.2',
  'billing.freeIncludes.items.3',
];

export const paidPlanHighlightKeys: Record<PaidPlanKey, string[]> = {
  family: [
    'billing.planHighlights.family.0',
    'billing.planHighlights.family.1',
    'billing.planHighlights.family.2',
  ],
  households: [
    'billing.planHighlights.households.0',
    'billing.planHighlights.households.1',
    'billing.planHighlights.households.2',
  ],
};
