import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const Termos: React.FC = () => {
  const { t } = useLanguage();
  const summaryCards = [
    { icon: 'favorite', title: t('legal.terms.purposeTitle'), text: t('legal.terms.purposeP1') },
    { icon: 'medical_information', title: t('legal.terms.notMedicalTitle'), text: t('legal.terms.notMedicalP1') },
    { icon: 'account_circle', title: t('legal.terms.accountModesTitle'), text: t('legal.terms.accountModesP1') },
    { icon: 'payments', title: t('legal.terms.paymentsTitle'), text: t('legal.terms.paymentsP1') },
  ];
  const sections = [
    { icon: 'business', title: t('legal.terms.providerTitle'), text: t('legal.terms.providerP1') },
    { icon: 'fact_check', title: t('legal.terms.userResponsibilityTitle'), text: t('legal.terms.userResponsibilityP1') },
    { icon: 'folder', title: t('legal.terms.documentsTitle'), text: t('legal.terms.documentsP1') },
    { icon: 'settings_heart', title: t('legal.terms.availabilityTitle'), text: t('legal.terms.availabilityP1') },
  ];

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[1100px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
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
              <span className="material-symbols-outlined text-base">gavel</span>
              {t('footer.terms')}
            </span>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div>
                <h1 className="text-headline-xl md:text-[48px] md:leading-[56px] font-display italic text-on-surface mb-4">
                  {t('legal.terms.title')}
                </h1>
                <p className="text-body-lg text-on-surface-variant max-w-3xl">
                  {t('legal.terms.intro')}
                </p>
              </div>
              <div className="rounded-[24px] bg-cj-branco/80 border border-white/60 p-6 soft-shadow">
                <p className="text-label-sm text-on-surface-variant mb-2">{t('legal.terms.lastUpdated')}</p>
                <p className="text-label-md text-on-surface">{t('legal.terms.providerP1')}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {[
                { icon: 'medical_information', label: t('legal.terms.notMedicalTitle') },
                { icon: 'emergency', label: t('legal.terms.emergencyTitle') },
                { icon: 'contact_support', label: t('legal.terms.contactTitle') },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-cj-border bg-cj-branco/70 px-4 py-3">
                  <span className="material-symbols-outlined text-primary">{item.icon}</span>
                  <span className="text-label-md font-bold text-on-surface">{item.label}</span>
                </div>
              ))}
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

          <section className="mb-8 rounded-[24px] border border-error/20 bg-error-container/30 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-error text-3xl shrink-0">emergency</span>
              <div className="min-w-0">
                <h2 className="text-headline-md font-headline-md text-on-surface mb-2">{t('legal.terms.emergencyTitle')}</h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed break-words">{t('legal.terms.emergencyP1')}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="space-y-5">
              {sections.map((item) => (
                <article key={item.title} className="bg-cj-branco border border-cj-border rounded-[20px] p-6">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <h2 className="text-headline-md font-headline-md text-on-surface mb-2">{item.title}</h2>
                      <p className="text-body-md text-on-surface-variant leading-relaxed break-words">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-5">
              <div className="bg-primary text-on-primary rounded-[24px] p-6 soft-shadow">
                <span className="material-symbols-outlined text-3xl mb-4">contact_support</span>
                <h2 className="text-headline-md font-headline-md mb-3">{t('legal.terms.contactTitle')}</h2>
                <a href="mailto:contato@cuidarjuntos.pt" className="text-on-primary underline decoration-white/50 underline-offset-4 break-words">
                  contato@cuidarjuntos.pt
                </a>
                <p className="mt-4 text-label-md text-white/85">{t('legal.terms.contactP1')}</p>
              </div>
              <div className="bg-cj-terra/10 border border-cj-terra/10 rounded-[20px] p-5 text-label-md text-on-surface-variant">
                {t('legal.terms.legalNote')}
              </div>
            </aside>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-14 flex flex-wrap gap-4">
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

      <PublicFooter />
    </div>
  );
};

export default Termos;
