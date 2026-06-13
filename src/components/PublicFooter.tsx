import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from './brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';
import { openPrivacyPreferences } from '../lib/privacyConsent';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const className = 'inline-flex min-h-10 items-center text-label-md text-on-surface-variant hover:text-primary transition-colors';
  if (to.includes('#')) {
    return <a className={className} href={to}>{children}</a>;
  }
  return <Link className={className} to={to}>{children}</Link>;
};

const PublicFooter: React.FC = () => {
  const { t } = useLanguage();

  const columns = [
    {
      title: t('footer.product'),
      links: [
        { label: t('footer.howItWorks'), to: '/como-funciona' },
        { label: t('footer.features'), to: '/#funcionalidades' },
        { label: t('footer.pricing'), to: '/#precos' },
        { label: t('footer.blog'), to: '/blog' },
      ],
    },
    {
      title: t('footer.account'),
      links: [
        { label: t('global.signIn'), to: '/entrar' },
        { label: t('global.createAccount'), to: '/criar-conta' },
        { label: t('footer.billing'), to: '/#precos' },
        { label: t('nav.quickGuide'), to: '/guia' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.help'), to: '/blog' },
        { label: t('footer.contact'), to: '/contacto' },
        { label: t('footer.dataSecurity'), to: '/seguranca' },
        { label: t('footer.cancellation'), to: '/cancelamento' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.terms'), to: '/termos' },
        { label: t('footer.privacy'), to: '/privacidade' },
        { label: t('footer.cookies'), to: '/cookies' },
        { label: t('footer.refunds'), to: '/cancelamento' },
      ],
    },
  ];

  const trustItems = [
    { icon: 'lock', label: t('footer.trust.data') },
    { icon: 'payments', label: t('footer.trust.payments') },
    { icon: 'cancel', label: t('footer.trust.cancel') },
    { icon: 'medical_information', label: t('footer.trust.medical') },
    { icon: 'home_health', label: t('footer.trust.portugal') },
  ];

  return (
    <footer className="bg-cj-branco border-t border-cj-border py-14">
      <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr] mb-10">
          <div className="max-w-sm">
            <div className="mb-4">
              <CuidarJuntosLogo variant="default" size="md" />
            </div>
            <p className="text-label-md leading-relaxed text-on-surface-variant">
              {t('footer.brandDescription')}
            </p>
            <a href="mailto:contato@cuidarjuntos.pt" className="mt-4 inline-flex min-h-11 items-center text-label-md font-bold text-primary hover:underline">
              contato@cuidarjuntos.pt
            </a>
          </div>

          <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-label-md font-bold text-primary mb-4">{column.title}</h2>
                <ul className="space-y-1.5">
                  {column.links.map((item) => (
                    <li key={`${column.title}-${item.to}`}>
                      <FooterLink to={item.to}>
                        {item.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-y border-cj-border py-5 sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-2xl bg-cj-verde-pale/45 px-3 py-3">
              <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
              <span className="text-label-sm font-bold text-on-surface">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <p className="text-label-sm text-on-surface-variant max-w-3xl">
            <strong>{t('safety.disclaimer')}</strong>
          </p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-5">
            <p className="text-label-md text-on-surface-variant opacity-75">
              {t('footer.copyright')} ·{' '}
              <a
                className="text-primary hover:underline"
                href="https://www.nebulacraftdesign.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                nebulacraftdesign.com
              </a>
            </p>
            <Link to="/contacto" className="text-label-md font-bold text-primary hover:underline">
              {t('footer.contactPrompt')}
            </Link>
            <button type="button" onClick={openPrivacyPreferences} className="text-label-md font-bold text-primary hover:underline">
              {t('footer.privacyPreferences')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
