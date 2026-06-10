import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';

const Privacidade: React.FC = () => {
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
        {isEnglish() ? (
          <>
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">{t('legal.privacy.title')}</h1>
            <p className="text-label-sm text-on-surface-variant mb-8">{t('legal.privacy.lastUpdated')}</p>
            <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
              <p>{t('legal.privacy.intro')}</p>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.demoDataTitle')}</h2>
                <p>{t('legal.privacy.demoDataP1')}</p>
                <p className="mt-3">{t('legal.privacy.demoDataP2')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.noMedicalTitle')}</h2>
                <p>{t('legal.privacy.noMedicalP1')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.sensitiveTitle')}</h2>
                <p>{t('legal.privacy.sensitiveP1')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.futureTitle')}</h2>
                <p>{t('legal.privacy.futureP1')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.contactTitle')}</h2>
                <p>{t('legal.privacy.contactP1')}</p>
              </section>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">{t('legal.privacy.title')}</h1>
            <p className="text-label-sm text-on-surface-variant mb-8">{t('legal.privacy.lastUpdated')}</p>
            <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
              <p>{t('legal.privacy.intro')}</p>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.demoDataTitle')}</h2>
                <p>{t('legal.privacy.demoDataP1')}</p>
                <p className="mt-3">{t('legal.privacy.demoDataP2')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.noMedicalTitle')}</h2>
                <p>{t('legal.privacy.noMedicalP1')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.sensitiveTitle')}</h2>
                <p>{t('legal.privacy.sensitiveP1')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.futureTitle')}</h2>
                <p>{t('legal.privacy.futureP1')}</p>
              </section>
              <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.contactTitle')}</h2>
                <p>{t('legal.privacy.contactP1')}</p>
              </section>
            </div>
          </>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/"
            className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
          >
            {t('legal.privacy.backToHome')}
          </Link>
          <Link
            to="/termos"
            className="px-6 py-3 bg-surface-container-low text-primary font-bold rounded-full hover:bg-surface-container-high transition-colors"
          >
            {t('legal.privacy.viewTerms')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Privacidade;