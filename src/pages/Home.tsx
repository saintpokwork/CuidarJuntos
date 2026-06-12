import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import HeroDashboardPreview from '../components/brand/HeroDashboardPreview';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const features = [
    { icon: 'calendar_today', key: '0' },
    { icon: 'medical_services', key: '1' },
    { icon: 'folder_off', key: '2' },
    { icon: 'groups', key: '3' },
    { icon: 'search_off', key: '4' },
    { icon: 'emergency_home', key: '5' },
  ];
  const featureCards = [
    { icon: 'medication', title: 'meds', desc: 'medsDesc', tone: 'bg-cj-grad text-white' },
    { icon: 'event_available', title: 'appointments', desc: 'appointmentsDesc', tone: 'bg-cj-verde-pale border border-cj-border' },
    { icon: 'description', title: 'documents', desc: 'documentsDesc', tone: 'bg-warm-beige' },
    { icon: 'task_alt', title: 'tasks', desc: 'tasksDesc', tone: 'bg-surface-container-high' },
    { icon: 'contact_phone', title: 'contacts', desc: 'contactsDesc', tone: 'bg-cj-terracota text-white' },
  ];
  const howItWorksSteps = [0, 1, 2, 3];
  const pricingPlans = [
    { key: 'free', highlighted: false },
    { key: 'family', highlighted: true },
    { key: 'households', highlighted: false },
  ];
  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary/20">
      <header className="fixed top-0 w-full z-50 bg-cj-branco/90 backdrop-blur-md shadow-cj-sm border-b border-cj-border">
        <nav className="max-w-[1200px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-20">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" to="/como-funciona">
              {t('nav.howItWorks')}
            </Link>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" href="#funcionalidades">
              {t('nav.features')}
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md" href="#precos">
              {t('nav.pricing')}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle variant="light" />
            <Link className="hidden md:block text-primary font-bold hover:text-primary-container transition-colors font-label-md text-label-md" to="/entrar">
              {t('global.signIn')}
            </Link>
            <Link className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md shadow-sm hover:scale-105 active:scale-95 transition-all" to="/criar-conta">
              {t('global.createAccount')}
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-cj-grad-card">
          <div className="absolute inset-0 bg-cj-grad opacity-[0.04] pointer-events-none" />
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop flex flex-col md:flex-row items-center gap-16 relative">
            <div className="flex-1 text-center md:text-left z-10">
              <span className="inline-block px-4 py-1.5 bg-cj-verde-pale text-cj-verde border border-cj-verde/20 rounded-full font-label-md text-label-sm mb-6">
                {t('home.hero.badge')}
              </span>
              <h1 className="font-display italic text-headline-xl md:text-[48px] md:leading-[56px] text-on-surface mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  className="bg-primary text-on-primary px-8 py-4 rounded-full font-headline-md text-[18px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                  to="/dashboard"
                >
                  {t('home.hero.ctaPrimary')}
                </Link>
                <Link
                  className="bg-cj-branco text-primary border border-cj-border px-8 py-4 rounded-full font-headline-md text-[18px] hover:bg-cj-verde-pale transition-colors text-center"
                  to="/como-funciona"
                >
                  {t('home.hero.ctaSecondary')}
                </Link>
              </div>
              <p className="mt-4 text-label-sm text-on-surface-variant">
                {t('home.hero.ctaSubtitle')}
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <HeroDashboardPreview />
            </div>
          </div>
        </section>

        {/* Problems */}
        <section className="py-20 bg-cj-branco">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl text-on-surface mb-4">
                {t('home.problems.title')}
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {t('home.problems.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-cj-branco p-8 rounded-2xl border border-cj-border soft-shadow-hover transition-all"
                >
                  <span className="material-symbols-outlined text-cj-terracota mb-4 text-3xl">{item.icon}</span>
                  <h3 className="font-headline-md text-headline-md mb-2">{t(`home.problems.items.${idx}.title`)}</h3>
                  <p className="text-on-surface-variant">{t(`home.problems.items.${idx}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-background" id="funcionalidades">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl mb-4">
                {t('home.features.title')}
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {t('home.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch">
              {featureCards.map((card, idx) => (
                <div key={idx} className={`${card.tone} min-h-[260px] p-6 rounded-2xl flex flex-col soft-shadow relative overflow-hidden group`}>
                  <div className="flex h-full flex-col">
                    <span className="material-symbols-outlined text-4xl mb-8 shrink-0">{card.icon}</span>
                    <h3 className="font-headline-md text-headline-md mb-4 break-words leading-tight">{t(`home.features.${card.title}`)}</h3>
                    <p className={`${card.tone.includes('text-white') ? 'opacity-90' : 'text-on-surface-variant'} text-body-md leading-relaxed`}>
                      {t(`home.features.${card.desc}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-cj-verde-pale" id="como-funciona">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-20">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl">
                {t('home.howItWorks.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {howItWorksSteps.map((i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    {t(`home.howItWorks.steps.${i}.step`)}
                  </div>
                  <h4 className="font-headline-md text-headline-md mb-3">{t(`home.howItWorks.steps.${i}.title`)}</h4>
                  <p className="text-on-surface-variant">{t(`home.howItWorks.steps.${i}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-cj-branco" id="precos">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl mb-4">
                {t('home.pricing.title')}
              </h2>
              <p className="text-on-surface-variant font-body-lg">{t('home.pricing.subtitle')}</p>
              <p className="text-label-md text-primary mt-2">{t('home.pricing.earlyNote')}</p>
              <div className="mt-8 inline-flex rounded-full border border-cj-border bg-surface-container-lowest p-1 shadow-cj-sm">
                {(['monthly', 'yearly'] as const).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className={`min-h-11 rounded-full px-5 text-label-md font-bold transition-all ${
                      billingCycle === cycle
                        ? 'bg-primary text-on-primary shadow-cj-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                    aria-pressed={billingCycle === cycle}
                  >
                    {t(`home.pricing.${cycle === 'monthly' ? 'billingMonthly' : 'billingYearly'}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => {
                const planKey = plan.key;
                const isHighlighted = plan.highlighted;
                const isYearly = billingCycle === 'yearly';
                const priceKey = isYearly ? 'priceYearly' : 'priceMonthly';
                const periodKey = isYearly ? 'periodYearly' : 'periodMonthly';
                const trialBadge = t(`home.pricing.${planKey}.trialBadge`);
                const savings = isYearly ? t(`home.pricing.${planKey}.yearlySavings`) : '';
                const anchor = t(`home.pricing.${planKey}.anchor`);
                const guarantee = t(`home.pricing.${planKey}.guarantee`);
                return (
                  <div key={planKey} className={`p-8 rounded-2xl soft-shadow flex flex-col ${isHighlighted ? 'bg-primary text-on-primary md:scale-105 z-10 relative' : 'bg-surface-container-lowest border border-outline-variant'}`}>
                    {isHighlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cj-cobre text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {t(`home.pricing.${planKey}.popularBadge`)}
                      </div>
                    )}
                    <h3 className={`font-headline-md text-headline-md mb-2 ${isHighlighted ? 'text-on-primary' : ''}`}>{t(`home.pricing.${planKey}.title`)}</h3>
                    <div className={`flex flex-wrap items-center gap-2 mb-3 ${isHighlighted ? 'text-on-primary' : ''}`}>
                      <span className="text-3xl font-bold">{t(`home.pricing.${planKey}.${priceKey}`)}</span>
                      <span className={isHighlighted ? 'opacity-80' : 'text-on-surface-variant'}>{t(`home.pricing.${planKey}.${periodKey}`)}</span>
                      {trialBadge && (
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${isHighlighted ? 'bg-white/15 text-white' : 'bg-cj-verde-pale text-primary'}`}>
                          {trialBadge}
                        </span>
                      )}
                    </div>
                    {savings && (
                      <p className={`mb-3 text-label-sm font-bold ${isHighlighted ? 'text-white/90' : 'text-primary'}`}>
                        {savings}
                      </p>
                    )}
                    {anchor && (
                      <p className={`mb-3 text-label-sm ${isHighlighted ? 'text-white/80' : 'text-on-surface-variant'}`}>
                        {anchor}
                      </p>
                    )}
                    <p className={`mb-3 ${isHighlighted ? 'opacity-90' : 'text-on-surface-variant'}`}>
                      {t(`home.pricing.${planKey}.description`)}
                    </p>
                    <p className={`mb-6 text-label-sm ${isHighlighted ? 'text-white/75' : 'text-on-surface-variant'}`}>
                      {t(`home.pricing.${planKey}.finePrint`)}
                    </p>
                    <ul className="space-y-4 mb-8 flex-grow">
                      {[0, 1, 2, 3, 4, 5].map((fi) => {
                        const featKey = `home.pricing.${planKey}.features.${fi}`;
                        const featVal = t(featKey);
                        if (!featVal) return null;
                        return (
                          <li key={fi} className="flex items-center gap-3">
                            <span className={`material-symbols-outlined ${isHighlighted ? '' : 'text-secondary'}`}>check</span>
                            {featVal}
                          </li>
                        );
                      })}
                    </ul>
                    <Link
                      className={`w-full py-3 rounded-full text-center font-bold transition-all ${
                        isHighlighted
                          ? 'bg-on-primary text-primary hover:bg-primary-fixed-dim shadow-lg'
                          : 'border border-primary text-primary hover:bg-primary/5'
                      }`}
                      to="/dashboard"
                    >
                      {t(`home.pricing.${planKey}.cta`)}
                    </Link>
                    {guarantee && (
                      <p className={`mt-4 text-center text-label-sm ${isHighlighted ? 'text-white/75' : 'text-on-surface-variant'}`}>
                        {guarantee}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-background overflow-hidden relative">
          <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
            <div className="bg-cj-grad p-12 md:p-20 rounded-[3rem] text-center relative z-10 text-white">
              <h2 className="font-display italic text-headline-xl mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="font-body-lg text-body-lg text-white/80 mb-10 max-w-2xl mx-auto">
                {t('home.cta.subtitle')}
              </p>
              <Link
                className="inline-block bg-cj-terracota text-white px-10 py-5 rounded-full font-headline-md text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                to="/dashboard"
              >
                {t('home.cta.button')}
              </Link>
              <p className="mt-6 text-label-sm text-white/70">
                {t('home.cta.demoNotice')}
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">verified_user</span>
                  <span className="font-label-md">{t('home.cta.badgeSecure')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">health_and_safety</span>
                  <span className="font-label-md">{t('home.cta.badgeCare')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 top-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </section>

        {/* Disclaimer */}
        <section className="pb-12 pt-0 px-container-padding-mobile">
          <div className="max-w-[800px] mx-auto text-center opacity-50">
            <p className="font-label-sm text-label-sm italic">
              {t('home.disclaimer')}
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Home;
