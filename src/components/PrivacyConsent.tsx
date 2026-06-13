import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getPrivacyConsent,
  openPrivacyPreferences,
  PRIVACY_CONSENT_EVENT,
  PrivacyConsentRecord,
  savePrivacyConsent,
} from '../lib/privacyConsent';

interface PrivacyConsentProps {
  onConsentChange: (record: PrivacyConsentRecord | null) => void;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onConsentChange }) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = getPrivacyConsent();
    onConsentChange(current);
    setVisible(!current);

    const open = () => setVisible(true);
    const sync = () => onConsentChange(getPrivacyConsent());
    window.addEventListener(PRIVACY_CONSENT_EVENT, open);
    window.addEventListener('cuidarjuntos:privacy-consent-changed', sync);

    return () => {
      window.removeEventListener(PRIVACY_CONSENT_EVENT, open);
      window.removeEventListener('cuidarjuntos:privacy-consent-changed', sync);
    };
  }, [onConsentChange]);

  const choose = (choice: 'essential' | 'metrics') => {
    const record = savePrivacyConsent(choice);
    onConsentChange(record);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-[760px] rounded-[24px] border border-cj-border bg-cj-branco p-4 shadow-2xl md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">privacy_tip</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">{t('privacyConsent.title')}</h2>
          </div>
          <p className="text-label-md leading-relaxed text-on-surface-variant">{t('privacyConsent.body')}</p>
          <button type="button" onClick={openPrivacyPreferences} className="mt-2 text-label-sm font-bold text-primary hover:underline">
            {t('privacyConsent.manageHint')}
          </button>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
          <button
            type="button"
            onClick={() => choose('metrics')}
            className="min-h-11 rounded-full bg-primary px-5 text-label-md font-bold text-on-primary"
          >
            {t('privacyConsent.acceptMetrics')}
          </button>
          <button
            type="button"
            onClick={() => choose('essential')}
            className="min-h-11 rounded-full border border-primary px-5 text-label-md font-bold text-primary"
          >
            {t('privacyConsent.essentialOnly')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsent;
