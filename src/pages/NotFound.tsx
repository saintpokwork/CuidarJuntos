import React from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../i18n/LanguageContext';

const NotFound: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-6">error</span>
          <h1 className="text-headline-xl font-display italic text-on-surface mb-4">{t('notFound.title')}</h1>
          <p className="text-body-lg text-on-surface-variant mb-8">{t('notFound.message')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all">
              {t('notFound.backToHome')}
            </Link>
            <Link to="/dashboard" className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all">
              {t('notFound.goToDashboard')}
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default NotFound;