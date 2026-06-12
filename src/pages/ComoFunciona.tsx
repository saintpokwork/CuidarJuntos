import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';
import PublicFooter from '../components/PublicFooter';
import LanguageToggle from '../components/LanguageToggle';

const ComoFunciona: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-[900px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle variant="light" />
            <Link
              to="/dashboard"
              className="text-label-md font-bold text-primary hover:underline"
            >
              {t('howItWorks.tryDemo')}
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-[900px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <section className="text-center mb-12">
          <h1 className="font-display italic text-headline-xl text-on-surface mb-4">
            {t('howItWorks.title')}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </section>

        <div className="space-y-4 mb-12">
          {[0,1,2,3,4,5,6].map((i) => {
            const stepTitle = t(`howItWorks.steps.${i}.title`);
            const stepDesc = t(`howItWorks.steps.${i}.desc`);
            const stepIcon = t(`howItWorks.steps.${i}.icon`);
            if (!stepTitle && !stepDesc) return null;
            return (
              <div
                key={i}
                className="glass-card p-6 rounded-[24px] soft-shadow border border-white/40 flex gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-bold text-headline-md">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {stepIcon && <span className="material-symbols-outlined text-primary">{stepIcon}</span>}
                    <h2 className="text-headline-md font-headline-md text-on-surface">{stepTitle}</h2>
                  </div>
                  <p className="text-body-md text-on-surface-variant">{stepDesc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-cj-verde-pale/30 border-l-4 border-cj-verde rounded-r-xl mb-8">
          <p className="text-body-md text-on-surface">
            {t('howItWorks.disclaimer')}
          </p>
        </div>

        <section className="glass-card mb-8 rounded-[24px] border border-white/40 p-6 soft-shadow">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined">redeem</span>
            </div>
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface">{t('howItWorks.referralFaqTitle')}</h2>
              <p className="mt-2 text-body-md text-on-surface-variant">{t('howItWorks.referralFaqText')}</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center"
          >
            {t('howItWorks.tryDemo')}
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-all text-center"
          >
            {t('howItWorks.backToHome')}
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default ComoFunciona;
