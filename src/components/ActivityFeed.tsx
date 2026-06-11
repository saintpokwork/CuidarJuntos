import React from 'react';
import { Link } from 'react-router-dom';
import { useCareData } from '../context/CareDataContext';
import { useLanguage } from '../i18n/LanguageContext';

const ActivityFeed: React.FC = () => {
  const { activityEvents } = useCareData();
  const { t } = useLanguage();

  return (
    <section className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-headline-md font-headline-md text-on-surface">{t('activity.title')}</h3>
          <p className="text-label-sm text-on-surface-variant">{t('activity.subtitle')}</p>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">history</span>
      </div>
      {activityEvents.length === 0 ? (
        <p className="text-label-md text-on-surface-variant py-4">{t('activity.empty')}</p>
      ) : (
        <div className="space-y-3">
          {activityEvents.map((event) => (
            <Link key={event.id} to={event.path} className="flex gap-3 rounded-xl bg-surface-container-low p-3 hover:bg-cj-verde-pale">
              <span className="material-symbols-outlined text-primary">{event.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-label-md font-bold text-on-surface">{event.text}</span>
                <span className="block text-label-sm text-on-surface-variant">{event.when}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ActivityFeed;
