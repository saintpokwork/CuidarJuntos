import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const HeroDashboardPreview: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 w-full">
      <div className="glass-card p-5 rounded-3xl soft-shadow border border-white/50 bg-white/70 backdrop-blur-sm">
        {/* Dashboard header bar */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-cj-border/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-cj-verde flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">home</span>
            </div>
            <span className="text-[11px] font-bold text-on-surface truncate">{t('nav.dashboard')}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-surface-container-high" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Medication card */}
          <div className="bg-cj-grad-card rounded-xl p-3 shadow-sm">
            <p className="text-[9px] font-bold text-cj-terra uppercase tracking-wide mb-1">{t('dashboard.cardMedications')}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12px] font-bold text-on-surface">Metformina</p>
                <p className="text-[10px] text-on-surface-variant">500mg · 08:00</p>
              </div>
              <span className="material-symbols-outlined text-cj-verde text-lg">pill</span>
            </div>
          </div>

          {/* Appointment card */}
          <div className="bg-cj-verde-pale/60 rounded-xl p-3 shadow-sm">
            <p className="text-[9px] font-bold text-cj-verde uppercase tracking-wide mb-1">{t('dashboard.cardAppointments')}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12px] font-bold text-on-surface">Cardiologia</p>
                <p className="text-[10px] text-on-surface-variant">12 Jul · 14:30</p>
              </div>
              <span className="material-symbols-outlined text-secondary text-lg">calendar_today</span>
            </div>
          </div>

          {/* Task card */}
          <div className="bg-surface-container-low rounded-xl p-3 shadow-sm">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wide mb-1">{t('dashboard.cardTasks')}</p>
            <p className="text-[11px] font-bold text-on-surface truncate">Comprar gaze</p>
            <p className="text-[9px] text-error">Em atraso</p>
          </div>

          {/* Emergency contact card */}
          <div className="bg-cj-terracota/10 rounded-xl p-3 shadow-sm border border-cj-terracota/20">
            <p className="text-[9px] font-bold text-cj-terracota uppercase tracking-wide mb-1">{t('dashboard.cardContacts')}</p>
            <p className="text-[10px] font-medium text-on-surface truncate">Dr. Roberto Santos</p>
            <p className="text-[9px] text-on-surface-variant">Cardiologista</p>
          </div>

          {/* Document + Family row */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <div className="bg-warm-beige rounded-xl p-3 shadow-sm">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wide mb-1">{t('dashboard.cardDocuments')}</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">description</span>
                <span className="text-[11px] font-medium text-on-surface truncate">Analises_julho2024.pdf</span>
              </div>
            </div>
            <div className="bg-secondary-container/30 rounded-xl p-3 shadow-sm flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold">A</div>
              <span className="text-[11px] font-medium text-on-surface">{t('nav.family')}</span>
            </div>
          </div>
        </div>

        {/* Done badge */}
        <div className="absolute -top-4 -right-4 bg-secondary-container p-4 rounded-xl shadow-lg">
          <span className="material-symbols-outlined text-on-secondary-container">done_all</span>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboardPreview;