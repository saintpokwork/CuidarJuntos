import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const RecuperarPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error: resetError } = await resetPassword(email);
    setLoading(false);

    if (resetError) {
      setError(resetError.message || 'Não foi possível enviar as instruções.');
      return;
    }

    setMessage('Se existir uma conta com este email, receberá instruções para recuperar a palavra-passe.');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[900px] mx-auto flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop h-20">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="sm" />
          </Link>
          <LanguageToggle />
          <Link to="/dashboard" className="text-label-md font-bold text-primary hover:underline">
            {t('auth.continueDemo')}
          </Link>
        </nav>
      </header>

      <main className="max-w-[520px] mx-auto px-6 py-16">
        <div className="bg-white shadow-soft rounded-[32px] border border-outline-variant p-10">
          <div className="mb-8 text-center">
            <p className="text-label-sm text-cj-verde uppercase tracking-[0.3em] mb-3">{t('auth.titleReset')}</p>
            <h1 className="text-headline-2 font-headline-lg text-on-surface">{t('auth.titleReset')}</h1>
            <p className="text-body-md text-on-surface-variant mt-3">{t('demo.notice')}</p>
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
            <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-primary text-on-primary font-bold disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? t('auth.sending') : t('auth.submitReset')}
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

          <div className="mt-6 text-center text-label-sm text-on-surface-variant">
            <Link to="/dashboard" className="text-primary font-bold hover:underline">
              Continuar para demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecuperarPassword;
