import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
  variant?: 'light' | 'dark';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', compact = false, variant = 'dark' }) => {
  const { language, setLanguage } = useLanguage();

  const btnSize = compact ? 'min-h-11 px-3 text-[11px]' : 'min-h-11 px-4 text-[13px]';
  const gap = compact ? 'gap-1' : 'gap-1.5';

  const activeClasses = 'bg-primary text-on-primary font-bold';
  const inactiveClasses =
    variant === 'dark'
      ? 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface';

  return (
    <div className={`inline-flex items-center ${gap} ${className}`} role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLanguage('pt')}
        aria-pressed={language === 'pt'}
        className={`${btnSize} rounded-full font-semibold transition-colors ${
          language === 'pt' ? activeClasses : inactiveClasses
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`${btnSize} rounded-full font-semibold transition-colors ${
          language === 'en' ? activeClasses : inactiveClasses
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
