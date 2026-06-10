import React, { createContext, useContext, useEffect, useState } from 'react';
import translations, { LangKey } from './translations';

const STORAGE_KEY = 'cuidarjuntos-language';

type LanguageContextValue = {
  language: LangKey;
  setLanguage: (l: LangKey) => void;
  t: (path: string, fallback?: string) => string;
  isEnglish: () => boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LangKey>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    return (stored as LangKey) || 'pt';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // ignore
    }
    // set html lang
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
    }
  }, [language]);

  const setLanguage = (l: LangKey) => setLanguageState(l);

  const t = (path: string, fallback = ''): string => {
    const parts = path.split('.');
    // @ts-ignore
    let cur: any = translations[language];
    for (const p of parts) {
      if (!cur) return fallback;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : fallback;
  };

  const isEnglish = () => language === 'en';

  const value = { language, setLanguage, t, isEnglish };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
