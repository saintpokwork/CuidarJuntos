import React, { useEffect, useState } from 'react';
import { BillingCycle, PaidPlanKey, createBillingPortalSession, createCheckoutSession, loadSubscriptionStatus, SubscriptionStatus } from '../lib/billing';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { clearPendingPlan, getPendingPlan } from '../lib/navigation';
import { freePlanSummaryKeys, paidPlanHighlightKeys, planAfterTrial, planPrices, planSavings } from '../lib/planCatalog';

const BillingPanel: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlanKey>('family');
  const [hasPendingPlan, setHasPendingPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    loadSubscriptionStatus().then(setSubscription);
    const pending = getPendingPlan();
    if (pending) {
      setBillingCycle(pending.billing);
      setSelectedPlan(pending.plan);
      setHasPendingPlan(true);
      setMessage(t('billing.pendingPlan'));
    }
  }, [user, t]);

  const handleCheckout = async (planKey: PaidPlanKey) => {
    setLoading(true);
    setMessage('');
    const result = await createCheckoutSession(planKey, billingCycle);
    if (result.error) {
      setMessage(t(`billing.errors.${result.error}`) || t('billing.errors.checkout_failed'));
    } else {
      clearPendingPlan();
      setHasPendingPlan(false);
    }
    setLoading(false);
  };

  const handlePortal = async () => {
    setLoading(true);
    setMessage('');
    const result = await createBillingPortalSession();
    if (result.error) {
      setMessage(t(`billing.errors.${result.error}`) || t('billing.errors.portal_failed'));
    }
    setLoading(false);
  };

  return (
    <div id="billing" className="bg-white p-8 rounded-[24px] soft-shadow mb-6 scroll-mt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h2 className="text-headline-md font-headline-md">{t('billing.title')}</h2>
          <p className="text-label-md text-on-surface-variant mt-1">{t('billing.description')}</p>
        </div>
        <div className="inline-flex w-fit rounded-full border border-cj-border bg-surface-container-lowest p-1">
          {(['monthly', 'yearly'] as const).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className={`min-h-10 rounded-full px-4 text-label-sm font-bold transition-colors ${
                billingCycle === cycle ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {t(`billing.${cycle}`)}
            </button>
          ))}
        </div>
      </div>

      {hasPendingPlan && (
        <div className="mb-5 rounded-2xl border border-primary/25 bg-cj-verde-pale/60 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-label-sm font-bold uppercase tracking-[0.16em] text-primary">{t('billing.trial')}</p>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">
                {t('billing.pendingTitle')} {t(`billing.plans.${selectedPlan}`)}
              </h3>
              <p className="mt-1 text-label-md text-on-surface-variant">{t('billing.noChargeToday')}</p>
            </div>
            <button
              type="button"
              disabled={loading || !user}
              onClick={() => handleCheckout(selectedPlan)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-label-md font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t('global.loading') : t('billing.startTrial')}
            </button>
          </div>
        </div>
      )}

      <div className="mb-5 grid gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-4 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-label-md font-bold text-on-surface">
            {t('billing.currentPlan')}: {subscription ? t(`billing.plans.${subscription.planKey}`) : t('billing.plans.free')}
          </p>
          <p className="text-label-sm text-on-surface-variant mt-1">
            {subscription?.status ? `${t('billing.status')}: ${subscription.status}` : t('billing.noPaidPlan')}
          </p>
        </div>
        <div>
          <p className="text-label-sm font-bold uppercase tracking-[0.14em] text-primary">{t('billing.freeIncludes.title')}</p>
          <ul className="mt-2 grid gap-1 text-label-sm text-on-surface-variant sm:grid-cols-2">
            {freePlanSummaryKeys.map((key) => (
              <li key={key} className="flex items-start gap-1.5">
                <span className="material-symbols-outlined mt-0.5 text-[16px] text-primary">check_circle</span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {(['free', 'family', 'households'] as const).map((planKey) => (
          <div key={planKey} className="rounded-2xl border border-cj-border bg-cj-branco p-4">
            <p className="text-label-md font-bold text-on-surface">{t(`billing.planClarity.${planKey}.title`)}</p>
            <p className="mt-1 text-label-sm text-on-surface-variant">{t(`billing.planClarity.${planKey}.text`)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(['family', 'households'] as PaidPlanKey[]).map((planKey) => (
          <div
            key={planKey}
            className={`rounded-2xl border bg-cj-branco p-5 ${
              selectedPlan === planKey ? 'border-primary shadow-cj-sm' : 'border-cj-border'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface">{t(`billing.plans.${planKey}`)}</h3>
                <p className="mt-1 text-label-sm text-on-surface-variant">{t(`billing.planDescriptions.${planKey}`)}</p>
              </div>
              <span className="rounded-full bg-cj-verde-pale px-3 py-1 text-[11px] font-bold text-primary">
                {t('billing.trial')}
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-surface-container-low p-4">
              <div className="flex flex-wrap items-end gap-2">
                <span className="text-headline-md font-headline-md text-on-surface">{planPrices[planKey][billingCycle]}</span>
                <span className="pb-1 text-label-sm text-on-surface-variant">
                  {billingCycle === 'monthly' ? t('billing.perMonth') : t('billing.perYear')}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="mt-1 text-label-sm font-bold text-primary">{planSavings[planKey]}</p>
              )}
              <p className="mt-2 text-label-sm text-on-surface-variant">
                {t('billing.afterTrial')} {planAfterTrial[planKey][billingCycle]}.
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {paidPlanHighlightKeys[planKey].map((key) => (
                <li key={key} className="flex items-start gap-2 text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined mt-0.5 text-[17px] text-secondary">check</span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={loading || !user}
              onClick={() => {
                setSelectedPlan(planKey);
                handleCheckout(planKey);
              }}
              className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-label-md font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t('global.loading') : t('billing.startTrial')}
            </button>
            <p className="mt-2 text-center text-label-sm text-on-surface-variant">{t('billing.noChargeToday')}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label-sm text-on-surface-variant">
          {t('billing.guarantee')}{' '}
          <a className="font-bold text-primary hover:underline" href="/#precos">
            {t('billing.comparePlans')}
          </a>
        </p>
        <button
          type="button"
          disabled={loading || !user}
          onClick={handlePortal}
          className="rounded-full border border-primary px-5 py-3 text-label-md font-bold text-primary hover:bg-primary/5 disabled:opacity-60"
        >
          {t('billing.manageBilling')}
        </button>
      </div>

      {message && (
        <p className="mt-4 rounded-2xl bg-cj-terra/10 p-3 text-label-sm font-bold text-cj-terra">
          {message}
        </p>
      )}
    </div>
  );
};

export default BillingPanel;
