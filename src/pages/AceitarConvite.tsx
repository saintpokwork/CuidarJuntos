import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';
import LanguageToggle from '../components/LanguageToggle';
import {
  acceptCareProfileInvite,
  getCareProfileInviteByToken,
  PendingInvite,
} from '../lib/data/supabaseDataAdapter';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const AceitarConvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<PendingInvite | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'accepting' | 'accepted' | 'error'>('idle');
  const [errorKey, setErrorKey] = useState('');

  useEffect(() => {
    if (!token || !isSupabaseConfigured) return;
    if (!user) {
      setInvite(null);
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    getCareProfileInviteByToken(token).then((loadedInvite) => {
      if (cancelled) return;
      if (!loadedInvite) {
        setErrorKey('pages.invite.notFound');
        setStatus('error');
        return;
      }
      if (loadedInvite.status !== 'pending') {
        setErrorKey('pages.invite.alreadyHandled');
        setStatus('error');
        return;
      }
      if (new Date(loadedInvite.expiresAt).getTime() < Date.now()) {
        setErrorKey('pages.invite.expired');
        setStatus('error');
        return;
      }
      setInvite(loadedInvite);
      setStatus('idle');
    });

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  const handleAccept = async () => {
    if (!token || !user) return;

    setStatus('accepting');
    const result = await acceptCareProfileInvite(token, user.id);
    if (!result.success) {
      setErrorKey(result.error === 'expired' ? 'pages.invite.expired' : 'pages.invite.acceptError');
      setStatus('error');
      return;
    }

    setStatus('accepted');
    localStorage.removeItem('cuidarjuntos-pending-invite-token');
    setTimeout(() => navigate('/dashboard/familia'), 700);
  };

  const savePendingInvite = () => {
    if (token) localStorage.setItem('cuidarjuntos-pending-invite-token', token);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <CuidarJuntosLogo className="mx-auto mb-6 h-12 w-auto" />
            <LanguageToggle variant="light" />
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
            ) : !isSupabaseConfigured ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-error">cloud_off</span>
                </div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface text-center mb-2">
                  {t('pages.invite.unavailableTitle')}
                </h1>
                <p className="text-body-md text-on-surface-variant text-center mb-6">
                  {t('pages.invite.unavailableDescription')}
                </p>
                <Link
                  to="/"
                  className="block w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center"
                >
                  {t('global.continue')}
                </Link>
              </>
            ) : status === 'loading' ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary animate-pulse">mail</span>
                </div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface text-center mb-2">
                  {t('pages.invite.loading')}
                </h1>
              </>
            ) : status === 'error' ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-error">link_off</span>
                </div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface text-center mb-2">
                  {t('pages.invite.invalidInvite')}
                </h1>
                <p className="text-body-md text-on-surface-variant text-center mb-6">
                  {t(errorKey || 'pages.invite.acceptError')}
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
                {invite?.invitedEmail && (
                  <p className="text-label-md text-on-surface text-center mb-6 break-words">
                    {invite.invitedEmail}
                  </p>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={handleAccept}
                    disabled={status === 'accepting' || status === 'accepted'}
                    className="block w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center mb-3 disabled:opacity-60"
                  >
                    {status === 'accepting'
                      ? t('pages.invite.accepting')
                      : status === 'accepted'
                        ? t('pages.invite.accepted')
                        : t('pages.invite.accept')}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to={`/criar-conta?invite=${encodeURIComponent(token)}`}
                      onClick={savePendingInvite}
                      className="block w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-center"
                    >
                      {t('pages.invite.createAccount')}
                    </Link>
                    <Link
                      to={`/entrar?invite=${encodeURIComponent(token)}`}
                      onClick={savePendingInvite}
                      className="block w-full py-4 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all text-center"
                    >
                      {t('pages.invite.signIn')}
                    </Link>
                  </div>
                )}

                <p className="text-label-sm text-on-surface-variant text-center mt-4">
                  {user ? t('pages.invite.signedInHint') : t('pages.invite.signedOutHint')}
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
