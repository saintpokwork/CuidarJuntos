import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageToggle: React.FC<{ className?: string; compact?: boolean }> = ({ className = '', compact = false }) => {
  const { language, setLanguage } = useLanguage();

  const btnSize = compact ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm';
  const gap = compact ? 'gap-1' : 'gap-2';

  return (
    <div className={`inline-flex items-center ${gap} ${className}`} role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLanguage('pt')}
        aria-pressed={language === 'pt'}
        className={`${btnSize} rounded-full font-semibold transition-colors ${
          language === 'pt' ? 'bg-primary text-on-primary' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white/90'
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`${btnSize} rounded-full font-semibold transition-colors ${
          language === 'en' ? 'bg-primary text-on-primary' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white/90'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
