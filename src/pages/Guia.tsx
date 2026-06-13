import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useLanguage } from '../i18n/LanguageContext';
import PublicFooter from '../components/PublicFooter';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';

type GuiaProps = {
  publicPage?: boolean;
};

const GuiaContent: React.FC<{ publicPage: boolean }> = ({ publicPage }) => {
  const { t } = useLanguage();
  return (
    <main className="flex-1 w-full relative">
      {!publicPage && <DashboardPageHeader title={t('pages.guide.title')} showSearch={false} />}

      <div className="max-w-[900px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
        {publicPage && (
          <div className="mb-8 text-center">
            <p className="mb-3 text-label-md font-bold uppercase tracking-[0.18em] text-primary">{t('pages.guide.publicEyebrow')}</p>
            <h1 className="text-headline-lg font-headline-lg text-on-surface">{t('pages.guide.title')}</h1>
          </div>
        )}
          <p className="text-body-md text-on-surface-variant mb-6 p-4 bg-warm-beige rounded-xl">
            {t('pages.guide.intro')}
          </p>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              {t('pages.guide.firstStepsTitle')}
            </h2>
            <ol className="space-y-3">
              {[0,1,2,3,4,5].map((i) => (
                <li key={i} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  {t(`pages.guide.firstSteps.${i}`)}
                </li>
              ))}
            </ol>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">priority_high</span>
              {t('pages.guide.fillFirstTitle')}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[0,1,2,3,4,5].map((i) => (
                <li key={i} className="flex items-center gap-2 text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  {t(`pages.guide.fillFirst.${i}`)}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">today</span>
              {t('pages.guide.dailyUseTitle')}
            </h2>
            <ul className="space-y-2">
              {[0,1,2,3,4].map((i) => (
                <li key={i} className="flex items-center gap-2 text-body-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                  {t(`pages.guide.dailyUse.${i}`)}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-6">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              {t('pages.guide.demoDataTitle')}
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {t('pages.guide.demoDataText')}
            </p>
          </section>

          <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 mb-8">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">warning</span>
              {t('pages.guide.limitationsTitle')}
            </h2>
            <ul className="space-y-2">
              {[0,1,2,3,4].map((i) => (
                <li key={i} className="flex items-start gap-2 text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm mt-0.5">remove</span>
                  {t(`pages.guide.limitations.${i}`)}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-4">
            <Link
              to={publicPage ? '/criar-conta' : '/dashboard/medicamentos'}
              className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all"
            >
              {publicPage ? t('global.createAccount') : t('pages.guide.goToMedications')}
            </Link>
            <Link
              to={publicPage ? '/#precos' : '/dashboard/tarefas'}
              className="px-6 py-3 bg-secondary text-on-secondary font-bold rounded-full hover:opacity-90 transition-all"
            >
              {publicPage ? t('nav.pricing') : t('pages.guide.createTask')}
            </Link>
            <Link
              to={publicPage ? '/entrar' : '/dashboard/emergencia'}
              className="px-6 py-3 bg-error-container text-on-error-container font-bold rounded-full hover:opacity-90 transition-all"
            >
              {publicPage ? t('global.signIn') : t('pages.guide.viewEmergencyCard')}
            </Link>
          </div>
        </div>
      </main>
  );
};

const Guia: React.FC<GuiaProps> = ({ publicPage = false }) => {
  const { t } = useLanguage();

  if (publicPage) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <header className="border-b border-cj-border bg-cj-branco">
          <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-container-padding-mobile md:px-container-padding-desktop">
            <Link to="/">
              <CuidarJuntosLogo variant="default" size="md" />
            </Link>
            <div className="flex items-center gap-3">
              <Link className="text-label-md font-bold text-primary hover:underline" to="/entrar">
                {t('global.signIn')}
              </Link>
              <Link className="rounded-full bg-primary px-5 py-3 text-label-md font-bold text-on-primary" to="/criar-conta">
                {t('global.createAccount')}
              </Link>
            </div>
          </nav>
        </header>
        <GuiaContent publicPage />
        <PublicFooter />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <GuiaContent publicPage={false} />
    </DashboardLayout>
  );
};

export default Guia;
