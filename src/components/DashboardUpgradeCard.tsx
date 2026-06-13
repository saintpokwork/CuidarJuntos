import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCareData } from '../context/CareDataContext';
import { useLanguage } from '../i18n/LanguageContext';
import { loadSubscriptionStatus, SubscriptionStatus } from '../lib/billing';

const DashboardUpgradeCard: React.FC = () => {
  const { user } = useAuth();
  const { storageMode } = useCareData();
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user || storageMode !== 'cloud') {
      setLoaded(true);
      return;
    }

    let active = true;
    loadSubscriptionStatus().then((status) => {
      if (!active) return;
      setSubscription(status);
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [storageMode, user]);

  if (!user || storageMode !== 'cloud' || !loaded || subscription?.planKey) return null;

  return (
    <section className="mb-stack-lg rounded-2xl border border-primary/20 bg-cj-verde-pale/60 p-5 shadow-cj-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-1 text-primary">workspace_premium</span>
          <div>
            <h2 className="text-headline-md font-headline-md text-on-surface">{t('upgradeCard.title')}</h2>
            <p className="mt-1 text-label-md text-on-surface-variant">{t('upgradeCard.subtitle')}</p>
            <p className="mt-2 text-label-sm text-on-surface-variant">{t('upgradeCard.body')}</p>
          </div>
        </div>
        <Link
          to="/dashboard/definicoes?upgrade=1"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-label-md font-bold text-on-primary"
        >
          {t('upgradeCard.cta')}
        </Link>
      </div>
    </section>
  );
};

export default DashboardUpgradeCard;
