import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLanguage('pt')}
        aria-pressed={language === 'pt'}
        className={`px-3 py-1 rounded-full font-semibold ${
          language === 'pt' ? 'bg-primary text-on-primary' : 'bg-white/10 text-on-surface'
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-3 py-1 rounded-full font-semibold ${
          language === 'en' ? 'bg-primary text-on-primary' : 'bg-white/10 text-on-surface'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
