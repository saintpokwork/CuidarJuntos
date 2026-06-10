import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';

const Termos: React.FC = () => {
  const { isEnglish, t } = useLanguage();

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[800px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="sm" />
          </Link>
          <Link
            to="/dashboard"
            className="text-label-md font-bold text-primary hover:underline"
          >
            {isEnglish() ? t('howItWorks.tryDemo') : 'Experimentar demo'}
          </Link>
        </nav>
      </header>

      <main className="max-w-[800px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">{t('legal.terms.title')}</h1>
        <p className="text-label-sm text-on-surface-variant mb-8">{t('legal.terms.lastUpdated')}</p>

        <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
          {isEnglish() && (
            <div className="p-4 bg-surface-container-low rounded-lg">
              <strong className="block mb-2">{t('legal.terms.englishSummary')}</strong>
              <p className="text-label-sm text-on-surface-variant">{t('legal.privacy.summary_en')}</p>
            </div>
          )}
          {!isEnglish() && (
            <div className="p-4 bg-surface-container-low rounded-lg">
              <strong className="block mb-2">{t('legal.terms.englishSummary')}</strong>
              <p className="text-label-sm text-on-surface-variant">{t('legal.terms.summary_en')}</p>
            </div>
          )}
          <p>{t('legal.terms.intro')}</p>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.terms.natureTitle')}</h2>
            <p>{t('legal.terms.natureP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.terms.noSubstituteTitle')}</h2>
            <p>{t('legal.terms.noSubstituteP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.terms.userResponsibilityTitle')}</h2>
            <p>{t('legal.terms.userResponsibilityP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.terms.emergencyTitle')}</h2>
            <p className="p-4 bg-error-container/20 border-l-4 border-error rounded-r-xl">
              {t('legal.terms.emergencyP1')}
            </p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.terms.demoStorageTitle')}</h2>
            <p>{t('legal.terms.demoStorageP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.terms.contactTitle')}</h2>
            <p>{t('legal.terms.contactP1')}</p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/"
            className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
          >
            {t('legal.terms.backToHome')}
          </Link>
          <Link
            to="/privacidade"
            className="px-6 py-3 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-colors"
          >
            {t('legal.terms.viewPrivacy')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Termos;