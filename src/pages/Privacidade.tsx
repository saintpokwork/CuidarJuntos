import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';
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
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">{t('legal.privacy.title')}</h1>
        <p className="text-label-sm text-on-surface-variant mb-8">{t('legal.privacy.lastUpdated')}</p>

        <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
          {isEnglish() && (
            <div className="p-4 bg-surface-container-low rounded-lg">
              <strong className="block mb-2">{t('legal.privacy.englishSummary')}</strong>
            </div>
          )}

          <p>{t('legal.privacy.intro')}</p>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.providerTitle')}</h2>
            <p>{t('legal.privacy.providerP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.dataCollectedTitle')}</h2>
            <p>{t('legal.privacy.dataCollectedP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.demoTitle')}</h2>
            <p>{t('legal.privacy.demoP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.cloudTitle')}</h2>
            <p>{t('legal.privacy.cloudP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.authEmailsTitle')}</h2>
            <p>{t('legal.privacy.authEmailsP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.documentsTitle')}</h2>
            <p>{t('legal.privacy.documentsP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.gdprTitle')}</h2>
            <p>{t('legal.privacy.gdprP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.subprocessorsTitle')}</h2>
            <p>{t('legal.privacy.subprocessorsP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.cookiesTitle')}</h2>
            <p>{t('legal.privacy.cookiesP1')}</p>
          </section>

          <section>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{t('legal.privacy.contactTitle')}</h2>
            <p>
              <a href="mailto:contato@cuidarjuntos.pt" className="text-primary hover:underline">
                {t('legal.privacy.contactP1')}
              </a>
            </p>
          </section>

          <div className="p-4 bg-cj-terra/10 rounded-lg text-label-sm text-on-surface-variant">
            {t('legal.privacy.legalNote')}
          </div>
        </div>

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

      <PublicFooter />
    </div>
  );
};

export default Privacidade;