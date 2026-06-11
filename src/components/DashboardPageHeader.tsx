import React from 'react';
import { caregiver } from '../data/initialData';
import CuidarJuntosLogo from './brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';

interface DashboardPageHeaderProps {
  title?: string;
  showSearch?: boolean;
  action?: React.ReactNode;
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  title,
  showSearch = true,
  action,
}) => {
  const { t } = useLanguage();

  return (
    <header className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-stack-md max-w-[1200px] mx-auto bg-background">
      <div className="flex items-center gap-4 min-w-0">
        {title ? (
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary leading-tight">
            {title}
          </h1>
        ) : (
          <span className="hidden md:inline-flex">
            <CuidarJuntosLogo variant="default" size="sm" />
          </span>
        )}
      </div>
      {showSearch && !title && (
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-label-md w-full placeholder-on-surface-variant"
            placeholder={t('dashboard.searchPlaceholder')}
            type="text"
          />
        </div>
      )}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {action}
        <img
          alt={caregiver.nome}
          className="w-10 h-10 rounded-full object-cover lg:hidden"
          src={caregiver.avatar}
        />
      </div>
    </header>
  );
};

export default DashboardPageHeader;
