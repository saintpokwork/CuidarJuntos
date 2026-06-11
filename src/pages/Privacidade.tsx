import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const Privacidade: React.FC = () => {
  const { t } = useLanguage();
  const summaryCards = [
    { icon: 'account_circle', title: t('legal.privacy.dataCollectedTitle'), text: t('legal.privacy.dataCollectedP1') },
    { icon: 'devices', title: t('legal.privacy.demoTitle'), text: t('legal.privacy.demoP1') },
    { icon: 'cloud_done', title: t('legal.privacy.cloudTitle'), text: t('legal.privacy.cloudP1') },
    { icon: 'verified_user', title: t('legal.privacy.gdprTitle'), text: t('legal.privacy.gdprP1') },
  ];
  const sections = [
    { icon: 'business', title: t('legal.privacy.providerTitle'), text: t('legal.privacy.providerP1') },
    { icon: 'mail', title: t('legal.privacy.authEmailsTitle'), text: t('legal.privacy.authEmailsP1') },
    { icon: 'folder_secure', title: t('legal.privacy.documentsTitle'), text: t('legal.privacy.documentsP1') },
    { icon: 'hub', title: t('legal.privacy.subprocessorsTitle'), text: t('legal.privacy.subprocessorsP1') },
    { icon: 'cookie', title: t('legal.privacy.cookiesTitle'), text: t('legal.privacy.cookiesP1') },
  ];

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[800px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
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

      <main>
        <section className="bg-cj-grad-card border-b border-cj-border">
          <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-14 md:py-18">
            <span className="inline-flex items-center gap-2 rounded-full bg-cj-verde-pale px-4 py-2 text-label-sm font-bold text-primary">
              <span className="material-symbols-outlined text-base">lock</span>
              {t('footer.privacy')}
            </span>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div>
                <h1 className="text-headline-xl md:text-[48px] md:leading-[56px] font-display italic text-on-surface mb-4">
                  {t('legal.privacy.title')}
                </h1>
                <p className="text-body-lg text-on-surface-variant max-w-3xl">
                  {t('legal.privacy.intro')}
                </p>
              </div>
              <div className="rounded-[24px] bg-cj-branco/80 border border-white/60 p-6 soft-shadow">
                <p className="text-label-sm text-on-surface-variant mb-2">{t('legal.privacy.lastUpdated')}</p>
                <p className="text-label-md text-on-surface">{t('legal.privacy.providerP1')}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12 md:py-16">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {summaryCards.map((item) => (
              <article key={item.title} className="bg-cj-branco border border-cj-border rounded-[24px] p-6 soft-shadow">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">{item.icon}</span>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">{item.title}</h2>
                <p className="text-label-md text-on-surface-variant leading-relaxed">{item.text}</p>
              </article>
            ))}
          </section>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="space-y-5">
              {sections.map((item) => (
                <article key={item.title} className="bg-cj-branco border border-cj-border rounded-[20px] p-6">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <h2 className="text-headline-md font-headline-md text-on-surface mb-2">{item.title}</h2>
                      <p className="text-body-md text-on-surface-variant leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-5">
              <div className="bg-primary text-on-primary rounded-[24px] p-6 soft-shadow">
                <span className="material-symbols-outlined text-3xl mb-4">contact_support</span>
                <h2 className="text-headline-md font-headline-md mb-3">{t('legal.privacy.contactTitle')}</h2>
                <a href="mailto:contato@cuidarjuntos.pt" className="text-on-primary underline decoration-white/50 underline-offset-4">
                  contato@cuidarjuntos.pt
                </a>
                <p className="mt-4 text-label-md text-white/85">{t('legal.privacy.contactP1')}</p>
              </div>
              <div className="bg-cj-terra/10 border border-cj-terra/10 rounded-[20px] p-5 text-label-md text-on-surface-variant">
                {t('legal.privacy.legalNote')}
              </div>
            </aside>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-14 flex flex-wrap gap-4">
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
