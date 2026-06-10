import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from './brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';

const PublicFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-cj-branco border-t border-cj-border py-16">
      <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand block */}
          <div className="max-w-xs">
            <div className="mb-4">
              <CuidarJuntosLogo variant="default" size="md" />
            </div>
            <p className="text-on-surface-variant font-label-md">
              {t('footer.brandDescription')}
            </p>
            <p className="mt-3 text-label-sm text-on-surface-variant">
              <a href="mailto:contato@cuidarjuntos.pt" className="text-primary hover:underline">
                contato@cuidarjuntos.pt
              </a>
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-label-md text-primary mb-4">{t('footer.platform')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/como-funciona">
                    {t('footer.howItWorks')}
                  </Link>
                </li>
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/#funcionalidades" onClick={(e) => { e.preventDefault(); window.location.hash = '#funcionalidades'; }}>
                    {t('footer.features')}
                  </Link>
                </li>
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/#precos" onClick={(e) => { e.preventDefault(); window.location.hash = '#precos'; }}>
                    {t('footer.pricing')}
                  </Link>
                </li>
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/blog">
                    {t('footer.blog')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-primary mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/blog">
                    {t('footer.help')}
                  </Link>
                </li>
                <li>
                  <a className="text-on-surface-variant hover:text-primary transition-all text-label-md" href="mailto:contato@cuidarjuntos.pt">
                    {t('footer.contact')}
                  </a>
                </li>
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/privacidade">
                    {t('footer.security')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-primary mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/termos">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link className="text-on-surface-variant hover:text-primary transition-all text-label-md" to="/privacidade">
                    {t('footer.privacy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar with disclaimer */}
        <div className="flex flex-col gap-3 pt-12 border-t border-surface-variant">
          <p className="text-label-sm text-on-surface-variant max-w-3xl">
            <strong>{t('safety.disclaimer')}</strong>
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-3">
            <p className="text-label-md text-on-surface-variant opacity-70">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;