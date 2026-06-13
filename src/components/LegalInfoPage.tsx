import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from './brand/CuidarJuntosLogo';
import PublicFooter from './PublicFooter';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

interface LegalInfoPageProps {
  namespace: string;
  badgeIcon: string;
  badgeLabelKey: string;
  heroIcon: string;
  summaryIcons: string[];
  sectionIcons: string[];
  tone?: 'primary' | 'warning';
  primaryLink?: {
    to: string;
    labelKey: string;
  };
  secondaryLink?: {
    to: string;
    labelKey: string;
  };
}

const LegalInfoPage: React.FC<LegalInfoPageProps> = ({
  namespace,
  badgeIcon,
  badgeLabelKey,
  heroIcon,
  summaryIcons,
  sectionIcons,
  tone = 'primary',
  primaryLink,
  secondaryLink,
}) => {
  const { t } = useLanguage();
  const cardTone = tone === 'warning' ? 'bg-error-container/30 border-error/20' : 'bg-cj-verde-pale/40 border-primary/15';

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[1100px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle variant="light" />
            <Link to="/criar-conta" className="text-label-md font-bold text-primary hover:underline">
              {t('global.createAccount')}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="bg-cj-grad-card border-b border-cj-border">
          <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-14 md:py-18">
            <span className="inline-flex items-center gap-2 rounded-full bg-cj-verde-pale px-4 py-2 text-label-sm font-bold text-primary">
              <span className="material-symbols-outlined text-base">{badgeIcon}</span>
              {t(badgeLabelKey)}
            </span>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div>
                <h1 className="text-headline-xl md:text-[48px] md:leading-[56px] font-display italic text-on-surface mb-4">
                  {t(`legal.${namespace}.title`)}
                </h1>
                <p className="text-body-lg text-on-surface-variant max-w-3xl">
                  {t(`legal.${namespace}.intro`)}
                </p>
              </div>
              <div className={`rounded-[24px] border p-6 soft-shadow ${cardTone}`}>
                <span className="material-symbols-outlined text-primary text-4xl mb-4">{heroIcon}</span>
                <p className="text-label-sm text-on-surface-variant mb-2">{t(`legal.${namespace}.lastUpdated`)}</p>
                <p className="text-label-md font-bold text-on-surface">{t(`legal.${namespace}.heroNote`)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12 md:py-16">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {summaryIcons.map((icon, index) => (
              <article key={icon} className="bg-cj-branco border border-cj-border rounded-[24px] p-6 soft-shadow">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">{icon}</span>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-3">
                  {t(`legal.${namespace}.summary.${index}.title`)}
                </h2>
                <p className="text-label-md text-on-surface-variant leading-relaxed">
                  {t(`legal.${namespace}.summary.${index}.text`)}
                </p>
              </article>
            ))}
          </section>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="space-y-5">
              {sectionIcons.map((icon, index) => (
                <article key={icon} className="bg-cj-branco border border-cj-border rounded-[20px] p-6">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
                        {t(`legal.${namespace}.sections.${index}.title`)}
                      </h2>
                      <p className="text-body-md text-on-surface-variant leading-relaxed break-words">
                        {t(`legal.${namespace}.sections.${index}.text`)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-5">
              <div className="bg-primary text-on-primary rounded-[24px] p-6 soft-shadow">
                <span className="material-symbols-outlined text-3xl mb-4">contact_support</span>
                <h2 className="text-headline-md font-headline-md mb-3">{t('legal.shared.contactTitle')}</h2>
                <a href="mailto:contato@cuidarjuntos.pt" className="text-on-primary underline decoration-white/50 underline-offset-4 break-words">
                  contato@cuidarjuntos.pt
                </a>
                <p className="mt-4 text-label-md text-white/85">{t('legal.shared.contactText')}</p>
              </div>
              <div className="rounded-[20px] border border-cj-border bg-cj-branco p-5">
                <h2 className="text-headline-sm font-headline-sm text-on-surface mb-3">{t('legal.shared.relatedTitle')}</h2>
                <div className="grid gap-3">
                  <Link to="/privacidade" className="text-label-md font-bold text-primary hover:underline">{t('footer.privacy')}</Link>
                  <Link to="/termos" className="text-label-md font-bold text-primary hover:underline">{t('footer.terms')}</Link>
                  <Link to="/seguranca" className="text-label-md font-bold text-primary hover:underline">{t('footer.dataSecurity')}</Link>
                  <Link to="/cancelamento" className="text-label-md font-bold text-primary hover:underline">{t('footer.cancellation')}</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-14 flex flex-wrap gap-4">
          {primaryLink && (
            primaryLink.to.startsWith('mailto:') ? (
              <a href={primaryLink.to} className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-colors">
                {t(primaryLink.labelKey)}
              </a>
            ) : (
              <Link to={primaryLink.to} className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-colors">
                {t(primaryLink.labelKey)}
              </Link>
            )
          )}
          {secondaryLink && (
            secondaryLink.to.startsWith('mailto:') ? (
              <a href={secondaryLink.to} className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors">
                {t(secondaryLink.labelKey)}
              </a>
            ) : (
              <Link to={secondaryLink.to} className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors">
                {t(secondaryLink.labelKey)}
              </Link>
            )
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default LegalInfoPage;
