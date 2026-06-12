import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

const DISMISS_KEY = 'cuidarjuntos-referral-banner-dismissed';

const ReferralBanner: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      /* ignore localStorage errors */
    }
    setDismissed(true);
  };

  if (!user || dismissed) return null;

  return (
    <section className="mb-stack-lg rounded-2xl border border-cj-border bg-cj-verde-pale/50 p-5 shadow-cj-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-1 text-primary">volunteer_activism</span>
          <div>
            <h2 className="text-headline-md font-headline-md text-on-surface">{t('referral.title')}</h2>
            <p className="mt-1 text-label-md text-on-surface-variant">{t('referral.subtitle')}</p>
            <p className="mt-2 text-label-sm text-on-surface-variant">{t('referral.body')}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            to="/dashboard/familia"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-label-md font-bold text-on-primary"
          >
            {t('referral.cta')}
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary px-5 text-label-md font-bold text-primary"
          >
            {t('referral.dismiss')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReferralBanner;
