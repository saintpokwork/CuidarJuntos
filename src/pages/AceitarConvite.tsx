import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';

const AceitarConvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <CuidarJuntosLogo className="mx-auto mb-6 h-12 w-auto" />
          </div>

          <div className="glass-card rounded-[32px] p-8 soft-shadow border border-white/40">
            {!token ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-error">link_off</span>
                </div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface text-center mb-2">
                  {t('pages.invite.invalidInvite')}
                </h1>
                <p className="text-body-md text-on-surface-variant text-center mb-6">
                  {t('pages.invite.missingToken')}
                </p>
                <Link
                  to="/"
                  className="block w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center"
                >
                  {t('global.continue')}
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                </div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface text-center mb-2">
                  {t('pages.invite.title')}
                </h1>
                <p className="text-body-md text-on-surface-variant text-center mb-6">
                  {t('pages.invite.description')}
                </p>

                {!user ? (
                  <Link
                    to="/criar-conta"
                    className="block w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center mb-3"
                  >
                    {t('pages.invite.createAccount')}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg opacity-50 cursor-not-allowed mb-3"
                  >
                    {t('pages.invite.accept')}
                  </button>
                )}

                <p className="text-label-sm text-on-surface-variant text-center">
                  {t('pages.invite.comingSoon')}
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default AceitarConvite;