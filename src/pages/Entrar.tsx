import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import PublicFooter from '../components/PublicFooter';

const Entrar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const inviteToken = searchParams.get('invite') || localStorage.getItem('cuidarjuntos-pending-invite-token') || '';

  useEffect(() => {
    if (searchParams.get('confirmed') === '1') {
      setMessage(t('auth.emailConfirmed'));
    }
  }, [searchParams, t]);

  useEffect(() => {
    if (user) {
      const pendingPlan = localStorage.getItem('cuidarjuntos-pending-plan');
      navigate(inviteToken
        ? `/aceitar-convite?token=${encodeURIComponent(inviteToken)}`
        : pendingPlan
          ? '/dashboard/definicoes?upgrade=1'
          : '/dashboard');
    }
  }, [user, navigate, inviteToken]);

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!email.trim()) errors.push(t('global.emailRequired'));
    if (!password) errors.push(t('global.passwordRequired'));
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage('');
    setError('');

    const { error: authError } = await signIn(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.message || t('auth.errorSignIn'));
      return;
    }

    setMessage(t('auth.successSignIn'));
    if (inviteToken) {
      localStorage.removeItem('cuidarjuntos-pending-invite-token');
      navigate(`/aceitar-convite?token=${encodeURIComponent(inviteToken)}`);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[900px] mx-auto flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop h-20">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="sm" />
          </Link>
          <LanguageToggle variant="light" />
          <Link to="/dashboard" className="text-label-md font-bold text-primary hover:underline">
            {t('auth.continueDemo')}
          </Link>
        </nav>
      </header>

      <main className="max-w-[480px] w-full mx-auto px-6 py-16 flex-1">
        <div className="bg-white shadow-soft rounded-[32px] border border-outline-variant p-10">
          <div className="mb-8 text-center">
            <p className="text-label-sm text-cj-verde uppercase tracking-[0.3em] mb-3">{t('auth.titleSignIn')}</p>
            <h1 className="text-headline-2 font-headline-lg text-on-surface">{t('auth.titleSignIn')}</h1>
            <p className="text-body-md text-on-surface-variant mt-3">{t('auth.signInIntro')}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            {validationErrors.length > 0 && (
              <div className="rounded-2xl p-4 text-label-sm font-medium bg-error-container text-error">
                {validationErrors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t('auth.signingIn') : t('auth.submitSignIn')}
            </button>
          </form>
          {(error || message) && (
            <div
              className={`mt-4 rounded-2xl p-4 text-center text-label-sm font-medium ${
                error ? 'bg-error-container text-error' : 'bg-cj-verde-pale text-cj-terra'
              }`}
            >
              {error || message}
            </div>
          )}

          <div className="mt-6 space-y-4 text-center">
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all">
              {t('auth.continueDemo')}
            </Link>
            <div className="flex flex-wrap justify-center gap-4 text-label-sm text-on-surface-variant">
              <Link to="/criar-conta" className="text-primary hover:underline">
                {t('global.createAccount')}
              </Link>
              <Link to="/recuperar-password" className="text-primary hover:underline">
                {t('auth.titleReset')}
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] bg-cj-verde-pale/15 border border-cj-verde-pale p-5">
            <p className="text-label-sm text-on-surface-variant">
              {t('auth.infoBox')}
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default Entrar;
