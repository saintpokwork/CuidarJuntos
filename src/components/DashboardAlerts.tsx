import React from 'react';
import { Link } from 'react-router-dom';
import { useCareData } from '../context/CareDataContext';
import { useLanguage } from '../i18n/LanguageContext';

const DashboardAlerts: React.FC = () => {
  const { notifications } = useCareData();
  const { t } = useLanguage();
  const visible = notifications.slice(0, 3);

  if (visible.length === 0) return null;

  return (
    <section className="mb-stack-lg grid gap-3">
      <div className="flex items-center gap-2 text-label-md font-bold text-cj-terra">
        <span className="material-symbols-outlined text-cj-terracota">priority_high</span>
        {t('notifications.attention')}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {visible.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="rounded-2xl border border-cj-border bg-cj-branco p-4 shadow-sm hover:border-primary"
          >
            <p className="text-label-md font-bold text-on-surface">{item.title}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DashboardAlerts;
