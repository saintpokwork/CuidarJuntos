import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCareData } from '../context/CareDataContext';
import { useLanguage } from '../i18n/LanguageContext';

const NotificationBell: React.FC = () => {
  const { notifications } = useCareData();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const count = notifications.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 lg:bg-primary-fixed/20 lg:text-primary"
        aria-expanded={open}
        aria-label={t('notifications.title')}
      >
        <span className="material-symbols-outlined">notifications</span>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cj-terracota px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-cj-border bg-cj-branco p-3 shadow-xl">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-label-md font-bold text-on-surface">{t('notifications.title')}</p>
            <span className="text-label-sm text-on-surface-variant">{count}</span>
          </div>
          {count === 0 ? (
            <p className="px-2 py-4 text-label-sm text-on-surface-variant">{t('notifications.empty')}</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-surface-container-low p-3 hover:bg-cj-verde-pale"
                >
                  <p className="text-label-md font-bold text-on-surface">{item.title}</p>
                  <p className="text-label-sm text-on-surface-variant">{item.body}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
