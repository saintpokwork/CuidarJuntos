import React, { useEffect, useState } from 'react';
import { BillingCycle, PaidPlanKey, createBillingPortalSession, createCheckoutSession, loadSubscriptionStatus, SubscriptionStatus } from '../lib/billing';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

const BillingPanel: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    loadSubscriptionStatus().then(setSubscription);
    const pending = localStorage.getItem('cuidarjuntos-pending-plan');
    if (!pending) return;
    try {
      const parsed = JSON.parse(pending) as { plan?: string; billing?: BillingCycle };
      if (parsed.billing === 'monthly' || parsed.billing === 'yearly') {
        setBillingCycle(parsed.billing);
      }
      if (parsed.plan === 'family' || parsed.plan === 'households') {
        setMessage(t('billing.pendingPlan'));
      }
    } catch {
      localStorage.removeItem('cuidarjuntos-pending-plan');
    }
  }, [user]);

  const handleCheckout = async (planKey: PaidPlanKey) => {
    setLoading(true);
    setMessage('');
    const result = await createCheckoutSession(planKey, billingCycle);
    if (result.error) {
      setMessage(t(`billing.errors.${result.error}`) || t('billing.errors.checkout_failed'));
    } else {
      localStorage.removeItem('cuidarjuntos-pending-plan');
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
    <div className="bg-white p-8 rounded-[24px] soft-shadow mb-6">
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

      <div className="mb-5 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
        <p className="text-label-md font-bold text-on-surface">
          {t('billing.currentPlan')}: {subscription ? t(`billing.plans.${subscription.planKey}`) : t('billing.plans.free')}
        </p>
        <p className="text-label-sm text-on-surface-variant mt-1">
          {subscription?.status ? `${t('billing.status')}: ${subscription.status}` : t('billing.noPaidPlan')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(['family', 'households'] as PaidPlanKey[]).map((planKey) => (
          <div key={planKey} className="rounded-2xl border border-cj-border bg-cj-branco p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface">{t(`billing.plans.${planKey}`)}</h3>
                <p className="mt-1 text-label-sm text-on-surface-variant">{t(`billing.planDescriptions.${planKey}`)}</p>
              </div>
              <span className="rounded-full bg-cj-verde-pale px-3 py-1 text-[11px] font-bold text-primary">
                {t('billing.trial')}
              </span>
            </div>
            <button
              type="button"
              disabled={loading || !user}
              onClick={() => handleCheckout(planKey)}
              className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-label-md font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t('global.loading') : t('billing.startCheckout')}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label-sm text-on-surface-variant">{t('billing.guarantee')}</p>
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
