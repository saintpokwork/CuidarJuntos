import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import PublicFooter from '../components/PublicFooter';

const CriarConta: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const inviteToken = searchParams.get('invite') || localStorage.getItem('cuidarjuntos-pending-invite-token') || '';

  useEffect(() => {
    if (user) {
      navigate(inviteToken ? `/aceitar-convite?token=${encodeURIComponent(inviteToken)}` : '/dashboard');
    }
  }, [user, navigate, inviteToken]);

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!nome.trim()) errors.push(t('global.nameRequired'));
    if (!email.trim()) errors.push(t('global.emailRequired'));
    if (!password) errors.push(t('global.passwordRequired'));
    else if (password.length < 6) errors.push(t('global.passwordMinLength'));
    if (!confirmPassword) errors.push(t('global.passwordConfirmation'));
    else if (password !== confirmPassword) errors.push(t('global.passwordMismatch'));
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setMessage('');

    const { error: signUpError } = await signUp(email, password, nome);
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || t('auth.errorSignUp'));
      return;
    }

    setMessage(t('auth.successSignUp'));
    if (inviteToken) localStorage.setItem('cuidarjuntos-pending-invite-token', inviteToken);
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

      <main className="max-w-[520px] w-full mx-auto px-6 py-16 flex-1">
        <div className="bg-white shadow-soft rounded-[32px] border border-outline-variant p-10">
          <div className="mb-8 text-center">
            <p className="text-label-sm text-cj-verde uppercase tracking-[0.3em] mb-3">{t('auth.titleSignUp')}</p>
            <h1 className="text-headline-2 font-headline-lg text-on-surface">{t('auth.titleSignUp')}</h1>
            <p className="text-body-md text-on-surface-variant mt-3">{t('auth.signUpIntro')}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">{t('global.name')}</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Maria Fernandes"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
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
            <div>
              <label className="block text-label-sm font-bold text-on-surface mb-2">{t('global.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="w-full h-12 px-4 rounded-2xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            {validationErrors.length > 0 && (
              <div className="rounded-2xl p-4 text-label-sm font-medium bg-error-container text-error">
                {validationErrors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-primary text-on-primary font-bold disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? t('auth.creating') : t('auth.submitSignUp')}
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

          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
            >
              {t('auth.tryDemo')}
            </Link>
          </div>

          <div className="mt-8 rounded-[24px] bg-cj-verde-pale/15 border border-cj-verde-pale p-5">
            <p className="text-label-sm text-on-surface-variant">
              {t('auth.infoBoxSignUp')}
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default CriarConta;
