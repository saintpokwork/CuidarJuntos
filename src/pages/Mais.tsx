import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { useLanguage } from '../i18n/LanguageContext';

const maisLinks = [
  { path: '/dashboard/guia', labelKey: 'quickGuide', descKey: 'quickGuideDesc', icon: 'menu_book' },
  { path: '/dashboard/perfil', labelKey: 'profile', descKey: 'profileDesc', icon: 'person' },
  { path: '/dashboard/documentos', labelKey: 'documents', descKey: 'documentsDesc', icon: 'description' },
  { path: '/dashboard/emergencia', labelKey: 'emergency', descKey: 'emergencyDesc', icon: 'emergency' },
  { path: '/dashboard/familia', labelKey: 'family', descKey: 'familyDesc', icon: 'group' },
  { path: '/dashboard/notas', labelKey: 'notes', descKey: 'notesDesc', icon: 'event_note' },
  { path: '/dashboard/definicoes?upgrade=1', labelKey: 'plan', descKey: 'planDesc', icon: 'workspace_premium' },
  { path: '/dashboard/definicoes', labelKey: 'settings', descKey: 'settingsDesc', icon: 'settings' },
];

const Mais: React.FC = () => {
  const { t } = useLanguage();
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.more.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <p className="text-body-lg text-on-surface-variant mb-stack-lg">
            {t('pages.more.description')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {maisLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="glass-card p-6 rounded-[24px] soft-shadow border border-white/40 hover:border-primary/30 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <p className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">
                    {t(`pages.more.links.${item.labelKey}`)}
                  </p>
                  <p className="text-label-md text-on-surface-variant">{t(`pages.more.links.${item.descKey}`)}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant ml-auto group-hover:text-primary">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Mais;
