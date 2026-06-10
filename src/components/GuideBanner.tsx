import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const GUIDE_SEEN_KEY = 'cuidarjuntos-guide-seen';

const GuideBanner: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(GUIDE_SEEN_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const { t } = useLanguage();

  const dismiss = () => {
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    } catch {
      /* ignorar */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-cj-verde-pale border-b border-cj-border px-container-padding-mobile md:px-container-padding-desktop py-4">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-label-md font-bold text-on-surface mb-1">{t('guideBanner.title')}</p>
          <p className="text-label-sm text-on-surface-variant">
            {t('guideBanner.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/dashboard/guia"
            className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-full text-label-sm hover:opacity-90 transition-all"
          >
            {t('guideBanner.cta')}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="px-5 py-2.5 text-on-surface-variant font-bold rounded-full text-label-sm hover:bg-surface-container-low transition-all"
          >
            {t('guideBanner.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideBanner;